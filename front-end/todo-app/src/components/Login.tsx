import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess, loginFailure } from '../store/slices/authSlice';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { setToken } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const loginData = {
            username: username,
            password: password
        };

        const API_URL = 'http://localhost/php-projects/php-todo-react/back-end/public/login';
        
        console.log('Sending login request:', {
            url: API_URL,
            method: 'POST',
            data: loginData
        });

        try {
            const response = await axios({
                method: 'POST',
                url: API_URL,
                data: loginData,
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            console.log('Response status:', response.status);
            console.log('Response data:', response.data);

            if (response.data.status === 'success') {
                // Set token in AuthContext
                setToken(response.data.token);
                
                // Update Redux state
                dispatch(loginSuccess({
                    token: response.data.token,
                    username: response.data.username
                }));
                
                navigate('/todos');
            } else {
                const errorMessage = response.data.message || 'Login failed. Please check your credentials.';
                dispatch(loginFailure(errorMessage));
                setError(errorMessage);
            }
        } catch (error) {
            console.error('Login error:', error);
            if (axios.isAxiosError(error)) {
                console.error('Axios error details:', {
                    status: error.response?.status,
                    data: error.response?.data,
                    headers: error.response?.headers
                });
                const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
                dispatch(loginFailure(errorMessage));
                setError(errorMessage);
            } else {
                const errorMessage = 'An unexpected error occurred.';
                dispatch(loginFailure(errorMessage));
                setError(errorMessage);
            }
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleLogin} method="POST">
                <div className="form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;