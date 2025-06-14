// redux/todoSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

// Update API URL to use MAMP's default port
const API_URL = 'http://localhost/php-projects/php-todo-react/back-end/public';

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Add request interceptor to handle errors
axiosInstance.interceptors.request.use(
    (config) => {
        console.log('Making request to:', config.url);
        console.log('Request headers:', config.headers);
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor to handle errors
axiosInstance.interceptors.response.use(
    (response) => {
        console.log('Response received:', response);
        return response;
    },
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        console.error('Error config:', error.config);
        console.error('Error status:', error.response?.status);
        console.error('Error headers:', error.response?.headers);
        return Promise.reject(error);
    }
);

interface Todo {
  id: number;
  task: string;
  completed: boolean;
  user_id: number;
  likes: number;
  hasLiked?: boolean;
}

interface TodoState {
  todos: Todo[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: any;
}

const initialState: TodoState = {
  todos: [],
  status: 'idle',
  error: null
};

// Redirect function (handles token expiration)
const handleAuthError = (error: any) => {
    if ((error.response && error.response.status === 401) || error === 'Error!') {
        console.error("Token expired. Redirecting to login...");
        localStorage.removeItem("token");
        window.location.href = "/";
    }
    throw error;
};

// ✅ Fetch Todos (GET)
export const fetchTodos = createAsyncThunk(
    'todos/fetchTodos',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/todos`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

// ✅ Add Task (POST)
export const addTask = createAsyncThunk(
    'todos/addTask',
    async (task: string, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/todos`, 
                { task },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

// ✅ Toggle Task Completion (PUT)
export const toggleComplete = createAsyncThunk(
    'todos/toggleComplete',
    async ({ id, completed }: { id: number, completed: boolean }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_URL}/todos/${id}`, 
                { completed: !completed },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            return { id, completed: !completed };
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

// ✅ Delete Task (DELETE)
export const deleteTask = createAsyncThunk(
    'todos/deleteTask',
    async (id: number, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/todos/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

// ✅ Edit Task (PUT)
export const editTodo = createAsyncThunk(
    'todos/editTodo',
    async ({ id, task }: { id: number, task: string }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_URL}/todos/${id}`, 
                { task },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            return { id, task };
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

// ✅ Toggle Like
export const toggleLike = createAsyncThunk(
    'todos/toggleLike',
    async (id: number, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            console.log('Sending like request for todo:', id); // Debug log
            const response = await axios.post(`${API_URL}/todos/${id}/like`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Like response:', response.data); // Debug log
            return { id, action: response.data.action || 'like' };
        } catch (error) {
            console.error('Like error:', error); // Debug log
            return rejectWithValue(error.response?.data || { error: 'Failed to toggle like' });
        }
    }
);

// ✅ Redux Slice
const todoSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodos.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTodos.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.todos = action.payload;
            })
            .addCase(fetchTodos.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state.todos.push(action.payload);
            })
            .addCase(toggleComplete.fulfilled, (state, action) => {
                const todo = state.todos.find(todo => todo.id === action.payload.id);
                if (todo) {
                    todo.completed = action.payload.completed;
                }
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.todos = state.todos.filter(todo => todo.id !== action.payload);
            })
            .addCase(editTodo.fulfilled, (state, action) => {
                const todo = state.todos.find(todo => todo.id === action.payload.id);
                if (todo) {
                    todo.task = action.payload.task;
                }
            })
            .addCase(toggleLike.fulfilled, (state, action) => {
                console.log('Toggle like reducer:', action.payload); // Debug log
                const todo = state.todos.find(todo => todo.id === action.payload.id);
                if (todo) {
                    if (action.payload.action === 'like') {
                        todo.likes = (todo.likes || 0) + 1;
                        todo.hasLiked = true;
                    } else if (action.payload.action === 'unlike') {
                        todo.likes = Math.max((todo.likes || 0) - 1, 0);
                        todo.hasLiked = false;
                    }
                }
            });
    }
});

export default todoSlice.reducer;
