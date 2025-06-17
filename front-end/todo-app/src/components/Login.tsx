import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess, loginFailure } from '../store/slices/authSlice';
import { useAuth } from '../contexts/AuthContext';
import '../assets/styles/login.scss';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { setToken } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const loginData = {
            username: username,
            password: password
        };

        const API_URL = 'http://localhost/php-projects/php-todo-react/back-end/public/login';
        
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

            if (response.data.status === 'success') {
                setToken(response.data.token);
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
                const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
                dispatch(loginFailure(errorMessage));
                setError(errorMessage);
            } else {
                const errorMessage = 'An unexpected error occurred.';
                dispatch(loginFailure(errorMessage));
                setError(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h1>Welcome Back!</h1>
                    <p>Please enter your details to sign in</p>
                </div>

                {error && (
                    <div className="error-message">
                        <span>⚠️</span> {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className={`login-button ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        Don't have an account?{' '}
                        <Link to="/register" className="register-link">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;