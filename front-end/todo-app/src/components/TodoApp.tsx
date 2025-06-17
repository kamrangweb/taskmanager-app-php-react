// src/TodoApp.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { Todo } from '../types/todo';
import { useAuth } from '../contexts/AuthContext';
import '../assets/styles/todolist.scss';

const TodoApp: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState('');
    const [editingTodo, setEditingTodo] = useState<number | null>(null);
    const [editText, setEditText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const { token } = useAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const username = useSelector((state: RootState) => state.auth.username);

    useEffect(() => {
        fetchTodos();
    }, [token]);

    useEffect(() => {
        // Check if all tasks are completed
        if (todos.length > 0 && todos.every(todo => Boolean(todo.completed))) {
            setShowCompletionModal(true);
        }
    }, [todos]);

    const fetchTodos = async () => {
        if (!token) return;

        try {
            setLoading(true);
            setError(null);
            console.log('Fetching todos with token:', token);

            const response = await fetch('http://localhost/php-projects/php-todo-react/back-end/public/todos', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Response status:', response.status);
            const rawResponse = await response.text();
            console.log('Raw response:', rawResponse);

            let result;
            try {
                result = JSON.parse(rawResponse);
                console.log('Parsed response:', result);
                console.log('Response type:', typeof result);
                console.log('Data type:', typeof result.data);
                console.log('Is data array?', Array.isArray(result.data));
                if (Array.isArray(result.data)) {
                    console.log('First todo item:', result.data[0]);
                }
            } catch (e) {
                console.error('Failed to parse response as JSON:', e);
                throw new Error('Invalid JSON response from server');
            }

            if (result.status === 'success') {
                console.log('Success response, data:', result.data);
                const todosArray = Array.isArray(result.data) ? result.data : [];
                console.log('Setting todos array:', todosArray);
                setTodos(todosArray);
            } else {
                console.log('Error response:', result);
                setTodos([]);
            }
        } catch (err) {
            console.error('Error fetching todos:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
            setTodos([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTodo.trim() || !token) return;

        try {
            const response = await fetch('http://localhost/php-projects/php-todo-react/back-end/public/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ task: newTodo })
            });

            const data = await response.json();
            if (data.status === 'success') {
                setNewTodo('');
                fetchTodos();
            } else {
                setError(data.message || 'Failed to add todo');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    const handleToggleComplete = async (id: number) => {
        try {
            const response = await fetch(`http://localhost/php-projects/php-todo-react/back-end/public/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ completed: !Boolean(todos.find(t => t.id === id)?.completed) })
            });
            const data = await response.json();
            if (data.status === 'success') {
                fetchTodos();
            } else {
                setError(data.message || 'Failed to update todo');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    const handleEdit = (id: number, task: string) => {
        setEditingTodo(id);
        setEditText(task);
    };

    const handleSaveEdit = async () => {
        if (!editingTodo || !editText.trim() || !token) return;

        try {
            const response = await fetch(`http://localhost/php-projects/php-todo-react/back-end/public/todos/${editingTodo}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ task: editText })
            });

            const data = await response.json();
            if (data.status === 'success') {
                setEditingTodo(null);
                setEditText('');
                fetchTodos();
            } else {
                setError(data.message || 'Failed to update todo');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    const handleDelete = async (id: number) => {
        if (!token) return;

        try {
            const response = await fetch(`http://localhost/php-projects/php-todo-react/back-end/public/todos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (data.status === 'success') {
                fetchTodos();
            } else {
                setError(data.message || 'Failed to delete todo');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="todolist">
            <h1 className="todo-header">Todo List</h1>
            
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    id="todo-input"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add a new todo"
                />
                <button type="submit" id="add-button">Add</button>
            </form>

            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            
            <ul id="todo-list">
                {todos && todos.length > 0 ? (
                    todos.map((todo) => (
                        <li key={todo.id} className="todo-item">
                            <div>
                                <button
                                    onClick={() => handleToggleComplete(todo.id)}
                                    className="complete-button"
                                >
                                    {Boolean(todo.completed) ? '✓' : '○'}
                                </button>
                                <span className={`task-text ${Boolean(todo.completed) ? 'line-through' : ''}`}>
                                    {todo.task}
                                </span>
                            </div>
                            <div>
                                <button
                                    onClick={() => handleEdit(todo.id, todo.task)}
                                    className="edit-button"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(todo.id)}
                                    className="delete-button"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="todo-item">No todos yet. Add one above!</li>
                )}
            </ul>

            {editingTodo && (
                <div className="edit-modal">
                    <div className="edit-modal-content">
                        <h2>Edit Todo</h2>
                        <input
                            type="text"
                            id="todo-input"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                        />
                        <div>
                            <button onClick={handleSaveEdit} className="edit-button">Save</button>
                            <button onClick={() => setEditingTodo(null)} className="delete-button">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {showCompletionModal && (
                <div className="completion-modal">
                    <div className="completion-modal-content">
                        <h2>🎉 Congratulations! 🎉</h2>
                        <p>All tasks completed!</p>
                        <button 
                            onClick={() => setShowCompletionModal(false)}
                            className="completion-button"
                        >
                            Awesome!
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TodoApp;
