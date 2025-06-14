import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './assets/styles/reboot.scss';
import './assets/styles/login.scss';
import './assets/styles/navbar.scss';
import './assets/styles/todolist.scss';

import TodoApp from './components/TodoApp';
import Login from './components/Login';
import Register from './components/Register';
import Header from './components/Header';
import PrivateRoute from "./components/PrivateRoute";

// Kullanıcı ve görevlerin durumlarını tipler ile tanımlıyoruz
interface User {
    token: string;
}

interface Task {
    id: string;
    title: string;
    completed: boolean;
}

const App: React.FC = () => {
    // TypeScript ile tipleri belirliyoruz
    const [user, setUser] = useState<string | null>(null);  // Token olarak string ya da null
    const [user_name, setUserName] = useState<string | null>(null); // User name
    const [likedTasks, setLikedTasks] = useState<Task[]>([]); // Liked Tasks State

    console.log((localStorage.getItem('token')), "EXXXXXXX")

    // Token kontrolü ve user state yönetimi
    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('Checking stored token:', token);
        if (token) {
            try {
                // Verify token is valid JWT
                const parts = token.split('.');
                if (parts.length === 3) {
                    setUser(token);
                } else {
                    console.error('Invalid token format');
                    localStorage.removeItem('token');
                    setUser(null);
                }
            } catch (error) {
                console.error('Error processing token:', error);
                localStorage.removeItem('token');
                setUser(null);
            }
        }
    }, []);

    // Token süresinin geçerliliğini kontrol ediyoruz
    useEffect(() => {
        const checkTokenExpiration = () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setUser(null);
                return;
            }
    
            try {
                const decodedToken = JSON.parse(atob(token.split(".")[1])); // JWT decode
                const expTime = decodedToken.exp * 1000;
                
                if (Date.now() >= expTime) {
                    console.log('Token expired');
                    localStorage.removeItem("token");
                    setUser(null);
                }
            } catch (error) {
                console.error('Error checking token expiration:', error);
                localStorage.removeItem("token");
                setUser(null);
            }
        };
    
        checkTokenExpiration();
        const interval = setInterval(checkTokenExpiration, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Router>
                <Header user={user} likedTasks={likedTasks} />
                
                <Routes>
                    <Route path="/" element={<Login user={user} setUser={setUser} user_name={user_name} setUserName={setUserName} />} />
                    <Route path="/register" element={!user ? <Register user={user} /> : <Navigate to="/todos" />} />
                    <Route path="/todos" element={<PrivateRoute user={user}><TodoApp user={user} likedTasks={likedTasks} setLikedTasks={setLikedTasks} /></PrivateRoute>} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </>
    );
};

export default App;
