import React, { useState } from 'react';
import './styles.css';
import { Link } from 'react-router-dom';
import PlayStockfish from './PlayStockfish';
import logo from './squarechesslogolong.png'; // Adjust the path as needed
import logoWhite from './squarechesslogolongwhite.png'; // Adjust the path as needed

const StockfishGamePage = () => {
    const [isLogoHovered, setIsLogoHovered] = useState(false);

    return (
        <div className="landing-page">
            <header>
                <nav>
                    <ul>
                        <li onMouseEnter={() => setIsLogoHovered(true)}
                            onMouseLeave={() => setIsLogoHovered(false)}>
                            <Link to="/">
                                <img src={isLogoHovered ? logoWhite : logo} alt="Home" style={{height: '40px' }} />
                            </Link>
                        </li>
                        <li><Link to="/" className="prepare-link">Prepare</Link></li>
                        <li><Link to="/analysis-board">Analysis Board</Link></li>
                        <li><Link to="/import-games">Import Games</Link></li>
                        <li><Link to="#about-us">About Us</Link></li>
                    </ul>
                </nav>
            </header>

            <main>
            <div><PlayStockfish/></div>
            </main>
            

            <footer>
                <p>&copy; SquareChess.org All rights reserved.</p>
            </footer>
        </div>
    );
};

export default StockfishGamePage;