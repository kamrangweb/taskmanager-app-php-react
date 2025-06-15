import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import './assets/styles/reboot.scss';
import './assets/styles/login.scss';
import './assets/styles/navbar.scss';
import './assets/styles/todolist.scss';
import Login from './components/Login';
import TodoApp from './components/TodoApp';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import Register from './components/Register';
import { useAuth } from './contexts/AuthContext';

const AppRoutes = () => {
    const { token } = useAuth();

    return (
        <Router>
            <Header />
            <Routes>
                <Route 
                    path="/login" 
                    element={token ? <Navigate to="/todos" replace /> : <Login />} 
                />
                <Route
                    path="/todos"
                    element={
                        <PrivateRoute>
                            <TodoApp />
                        </PrivateRoute>
                    }
                />
                <Route 
                    path="/" 
                    element={token ? <Navigate to="/todos" replace /> : <Navigate to="/login" replace />} 
                />
                <Route 
                    path="/register" 
                    element={token ? <Navigate to="/todos" replace /> : <Register />} 
                />
            </Routes>
        </Router>
    );
};

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Provider>
    );
};

export default App;
