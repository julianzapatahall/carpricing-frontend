//UsrName: zapatahall1 pasword: tAma...#1055
import React, { useState, useEffect } from 'react';
import './styles.css';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import Axios for making HTTP requests
import GoogleAd from "./GoogleAd";


// Import both logo images
import logo from './checkmatewizard_transparent.png'; // Adjust the path as needed
import logoWhite from './checkmatewizard_pure_white.png'; // Adjust the path as needed


const LandingPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogoHovered, setIsLogoHovered] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1200);

    // Event listener for window resize
    useEffect(() => {
                const handleResize = () => {
                    const isNowMobile = window.innerWidth < 1200;
                    setIsMobile(isNowMobile);
            
                    if (isNowMobile) {
                        console.log('Applying frozen class');
                        document.body.classList.add('frozen');
                    } else {
                        console.log('Removing frozen class');
                        document.body.classList.remove('frozen');
                    }
                };
            
                window.addEventListener('resize', handleResize);
            
                handleResize();
            
                return () => window.removeEventListener('resize', handleResize);
            }, []);
            

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/auth/login', { username, password });
            console.log(response.data); // Handle successful login response
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error(error.response.data);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.error(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error', error.message);
            }
        }
    };
    

    return (
        <div className="landing-page">
            <header>
                <nav>
                    <ul>
                        <li
                            onMouseEnter={() => setIsLogoHovered(true)}
                            onMouseLeave={() => setIsLogoHovered(false)}
                        >
                            <Link to="/">
                                <img src={isLogoHovered ? logoWhite : logo} alt="Home" style={{ height: '39px' }} />
                            </Link>
                        </li>
                        {isMobile ? (
                            <div className="navdropdown-container">
                                <div
                                    className={`${isDropdownOpen ? 'navdropdown' : 'navdropdown'}`}
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <li
                                        className="navdropdown-header"
                                        style={{
                
                                            lineHeight: '1.78',
                                            padding: '10px 20px',
                
                                            fontSize: '22px',
                                            color: 'white',
                                        }}
                                        
                                    >
                                        ☰ Menu
                                    </li>
                                    {isDropdownOpen && (
                                        <ul>
                                            <li>
                                                <Link
                                                    to="/blunder-punisher"
                                                    className="nav-link"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                >
                                                    Blunder Punisher
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/weakness-finder"
                                                    className="nav-link"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                >
                                                    Weakness Finder
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/analysis-board"
                                                    className="nav-link"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                >
                                                    Analysis Board
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/feedback"
                                                    className="nav-link"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                >
                                                    Your Feedback
                                                </Link>
                                            </li>
                                        </ul>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <ul>
                                <li>
                                    <Link to="/blunder-punisher" className="prepare-link">
                                        Blunder Punisher
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/weakness-finder">Weakness Finder</Link>
                                </li>
                                <li>
                                    <Link to="/analysis-board">Analysis Board</Link>
                                </li>
                                <li>
                                    <Link to="/feedback">Your Feedback</Link>
                                </li>
                            </ul>
                        )}
                    </ul>
                </nav>
            </header>

            <main>
                <section className="herocarlsen">
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
                                 <Link to="/signup"><button className="create-account-button">Create a CheckmateWizard Account</button></Link>

                            </div>
                        </div>
                    </section>
                    <div className="recommendation-section">
                        <div className="green-box">
                            <p>More than 0 Users</p>
                            <p> Recommended by GMs</p>
                        </div>
                    </div>
                </section>
                <div className="hero-content">
                        <h1>Master Your Chess With Superior Preparation</h1>
                        <button className="cta-button">Get Started</button>
                    </div>
            </main>

            <footer>
            <p>&copy; 2025 CheckmateWizard.com All rights reserved.</p>
            </footer>
            <GoogleAd />
        </div>
    );
};

export default LandingPage;

