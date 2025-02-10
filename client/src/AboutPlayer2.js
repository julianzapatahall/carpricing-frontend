import React from 'react';
import './styles.css';
import { Link } from 'react-router-dom';
import fabianoCaruana from './fabiano.jpg'; // Add the path to Fabiano Caruana's headshot
import julianZapataHall from './julian.jpg'; // Add the path to Julian Zapata-Hall's headshot

// Import both logo images
import logo from './squarechesslogolong.png'; // Adjust the path as needed
import logoWhite from './squarechesslogolongwhite.png'; // Adjust the path as needed

const AboutEric = () => {
    const [isLogoHovered, setIsLogoHovered] = React.useState(false);

    return (
        <div className="about-us-page">
            <header>
                <nav>
                    <ul>
                        <li onMouseEnter={() => setIsLogoHovered(true)}
                            onMouseLeave={() => setIsLogoHovered(false)}>
                            <Link to="/">
                                <img src={isLogoHovered ? logoWhite : logo} alt="Home" style={{ height: '40px' }} />
                            </Link>
                        </li>
                        <li><Link to="/blunder-punisher" className="prepare-link">Blunder Punisher</Link></li>
                        <li><Link to="/weakness-finder">Weakness Finder</Link></li>
                        <li><Link to="/analysis-board">Analysis Board</Link></li>
                        <li><Link to="/about-player">About Player</Link></li>
                    </ul>
                </nav>
            </header>

            <main>
            <section className="hero">
                <section className="mission-statement">
                    <h1>The Team</h1>
                </section>
                
                <section className="team">
                    <div className="team-member">
                        <img src={fabianoCaruana} alt="Fabiano Caruana" className="team-photo" />
                        <h2>Fabiano Caruana</h2>
                        <p>COO/Co-Founder</p>
                    </div>
                    <div className="team-member">
                        <img src={julianZapataHall} alt="Julian Zapata-Hall" className="team-photo" />
                        <h2>Julian Zapata-Hall</h2>
                        <p>CEO/Co-Founder</p>
                    </div>
                </section>
                
                </section>
            </main>

            <footer>
                <p>&copy; 2024 SquareChess.org All rights reserved.</p>
            </footer>
        </div>
    );
};

export default AboutEric;
