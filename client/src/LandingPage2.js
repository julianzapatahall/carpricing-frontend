import React, { useState } from 'react';
import './styles2.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logo from './logopage.png';
import logoWhite from './logopage.png'; // Using the same image for both states for now

const LandingPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogoHovered, setIsLogoHovered] = useState(false);

    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/auth/login', { username, password });
            console.log(response.data);
        } catch (error) {
            console.error(error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="landing-page">
            <header>
                <nav>
                    <ul>
                        <li onMouseEnter={() => setIsLogoHovered(true)} onMouseLeave={() => setIsLogoHovered(false)}>
                            <Link to="/">
                                <img src={isLogoHovered ? logoWhite : logo} alt="Home" className="logo" />
                            </Link>
                        </li>
                        <li><Link to="/" className="prepare-link">Blunder Punisher</Link></li>
                        <li><Link to="/">Weakness Finder</Link></li>
                        <li><Link to="/analysis-board">Analysis Board</Link></li>
                        <li><Link to="#about-us">About Us</Link></li>
                    </ul>
                </nav>
            </header>

            <main>
                <section className="hero">
                    <div className="hero-content">
                        <h1>Master Your Chess with Superior Preparation</h1>
                        <button className="cta-button">Get Started</button>
                    </div>
                    <section className="login-section">
                        <div className="login-form">
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={handleUsernameChange}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={handlePasswordChange}
                            />
                            <button className="login-button" onClick={handleLogin}>Log In</button>
                        
                            <div className="create-account-div">
                                <p>Don't have an account?</p>
                                <Link to="/signup" className="create-account-button">Create a SquareChess Account</Link>
                            </div>
                        </div>
                    </section>
                    <div className="recommendation-section">
                        <div className="green-box">
                            <p>More than 500 Users Recommended by GMs</p>
                        </div>
                    </div>
                </section>
            </main>

            <footer>
                <p>&copy; 2024 SquareChess.org All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
