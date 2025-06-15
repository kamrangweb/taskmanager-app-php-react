import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../assets/styles/navbar.scss';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { token, setToken } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        setToken(null);
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container">
                <div className="logo">
                    <Link to="/" className="logo-text">TaskMAN</Link>
                </div>
                <button className="menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <svg viewBox="0 0 24 24">
                        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                    </svg>
                </button>
                <div className={`nav-elements ${isMenuOpen ? 'active' : ''}`}>
                    <ul>
                        {token ? (
                            <>
                                <li>
                                    <Link to="/todos">Todos</Link>
                                </li>
                                <li className="logout">
                                    <button onClick={handleLogout}>Logout</button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to="/login">Login</Link>
                                </li>
                                <li>
                                    <Link to="/register">Register</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;

// import React, { useState } from 'react';
// import axios from 'axios';

// const Header = () => {
//     return (
//         <h2>You are in the Blogs</h2>
//     );
// };

// export default Header;