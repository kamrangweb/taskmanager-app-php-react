import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    username: string | null;
    error: string | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    token: localStorage.getItem('token'),
    username: localStorage.getItem('username'),
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<{ token: string; username: string }>) => {
            state.isAuthenticated = true;
            state.token = action.payload.token;
            state.username = action.payload.username;
            state.error = null;
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('username', action.payload.username);
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.isAuthenticated = false;
            state.token = null;
            state.username = null;
            state.error = action.payload;
            localStorage.removeItem('token');
            localStorage.removeItem('username');
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.token = null;
            state.username = null;
            state.error = null;
            localStorage.removeItem('token');
            localStorage.removeItem('username');
        }
    }
});

export const { loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer; 