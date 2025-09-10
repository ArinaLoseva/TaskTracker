import React, { useState } from 'react';
import 'D:/projects/task-tracker/frontend/src/styles/Register.css';
import lavender from 'D:/projects/task-tracker/frontend/src/assets/l1.jpg';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/auth/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: login,
                    password: password
                })
            });

            if (response.ok) {
                const data = await response.json();

                localStorage.setItem("token", data.token);
                localStorage.setItem("refreshToken", data.refreshToken);

                alert('Авторизация прошла успешно!');
                navigate("/notespage");
            } else {
                const err = await response.text();
                alert(`Ошибка: ${err}`);
            }
        } catch (error) {
            alert("Ошибка сети. Проверь сервер.");
            console.error(error);
        }
    };

    return (
        <div className="register-container">
            <div className="left-panel">
                <h1 className="logo">LavenderTask</h1>
                <div className="form-box">
                    <h2>Authorization</h2>
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
                        <button type="submit">Log in</button>
                        <Link to="/register">I don't have an account yet</Link>
                    </form>
                </div>
            </div>
            <div className="right-panel" style={{ backgroundImage: `url(${lavender})` }}></div>
        </div>
    );
};

export default Login;
