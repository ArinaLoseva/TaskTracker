import React, { useState } from 'react';
import 'D:/projects/task-tracker/frontend/src/styles/Register.css';
import lavender from 'D:/projects/task-tracker/frontend/src/assets/l1.jpg';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: login,
                password: password,
                confirmPassword: confirmPassword
            })
        });

        if (response.ok) {
            alert('Аккаунт создан!');
            navigate("/notespage");
        } else {
            const err = await response.text();
            alert(`Ошибка: ${err}`);
        }
    };

    return (
        <div className="register-container">
            <div className="left-panel">
                <h1 className="logo">LavenderTask</h1>
                <div className="form-box">
                    <h2>Registration</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Login"
                            value={login}
                            onChange={e => setLogin(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                        <button type="submit">Create account</button>
                        <Link to="/login">I already have an account</Link>
                    </form>
                </div>
            </div>
            <div className="right-panel" style={{ backgroundImage: `url(${lavender})` }}></div>
        </div>
    );
};

export default Register;
