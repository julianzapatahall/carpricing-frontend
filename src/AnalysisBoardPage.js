import React, { useState , useEffect} from 'react';
import { Link, useLocation } from 'react-router-dom';
import AnalysisBoard from './AnalysisBoard';
import './styles.css';

// Import both logo images
import logo from './checkmatewizard_transparent.png'; // Adjust the path as needed
import logoWhite from './checkmatewizard_pure_white.png'; // Adjust the path as needed


const AnalysisBoardPage = () => {
    const location = useLocation();
    const initialFen = location.state?.fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const [orientation, setOrientation] = useState('white');
    const [fen, setFen] = useState(initialFen); // Use the FEN passed from EditBoard or the default starting position
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
                <div className='analysis-board-section'>
                    <AnalysisBoard fen={fen} />
                </div>
            </main>
            <footer>
                <p>&copy; 2025 CheckmateWizard.com All rights reserved.</p>
            </footer>
        </div>
    );
};

export default AnalysisBoardPage;