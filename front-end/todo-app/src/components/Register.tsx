import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    // const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost/php-projects/php-todo-react/back-end/public/index.php/register",
                { 
                    username, 
                    password 
                }
            );
            alert(response.data);
            // navigate("/login");
        } catch (error) {
            console.error("Registration failed", error);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.header}>Create an Account</h2>
                <form onSubmit={handleRegister} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={styles.input}
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button type="submit" style={styles.button}>Register</button>
                </form>
                <p style={styles.footerText}>
                    Already have an account? <Link to="/" style={styles.link} >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f4f4",
    },
    card: {
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        width: "350px",
        textAlign: "center",
    },
    header: {
        fontSize: "22px",
        fontWeight: "bold",
        marginBottom: "20px",
        color: "#333",
    },
    form: {
        display: "flex",
        flexDirection: "column",
    },
    inputGroup: {
        marginBottom: "15px",
        textAlign: "left",
    },
    label: {
        fontSize: "14px",
        color: "#555",
        marginBottom: "5px",
        display: "block",
    },
    input: {
        width: "100%",
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        fontSize: "14px",
        outline: "none",
        transition: "border-color 0.3s",
    },
    inputFocus: {
        borderColor: "#007bff",
    },
    button: {
        width: "100%",
        padding: "10px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
        transition: "background-color 0.3s",
    },
    buttonHover: {
        backgroundColor: "#0056b3",
    },
    footerText: {
        marginTop: "15px",
        fontSize: "14px",
        color: "#555",
    },
    link: {
        color: "#007bff",
        textDecoration: "none",
        cursor: "pointer",
    },
};

export default Register;