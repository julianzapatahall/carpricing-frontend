import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AnalysisBoard from './AnalysisBoard';
import EditBoard from './EditBoard';
import './styles.css';
import Chessboard from 'chessboardjsx';
// Import both logo images
import logo from './squarechessai_transparent_new.png'; // Adjust the path as needed
import logoWhite from './squarechessai_no_black_new.png'; // Adjust the path as needed

    
const EditBoardPage = () => {
    const [isLogoHovered, setIsLogoHovered] = useState(false);
    
    return (
        <div className="landing-page">
            <header>
                <nav>
                    <ul>
                        <li onMouseEnter={() => setIsLogoHovered(true)}
                            onMouseLeave={() => setIsLogoHovered(false)}>
                            <Link to="/">
                                <img src={isLogoHovered ? logoWhite : logo} alt="Home" style={{height: '39px' }} />
                            </Link>
                        </li>
                        <li className='highlighted' style={{ color: '#F7B26A'}}><Link to="/">Prepare</Link></li>
                        <li><Link to="/analysis-board">Analysis Board</Link></li>
                        <li><Link to="#import-games">Import Games</Link></li>
                        <li><Link to="#about-us">About Us</Link></li>
                    </ul>
                </nav>
            </header>

            <main>
            <div style={boardsContainer}>
                
                    <EditBoard></EditBoard>
                    
            </div>
            </main>

            <footer>
                <p>&copy; 2025 SquareChess. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default EditBoardPage;

const boardStyle = {
    borderRadius: "5px",
    boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
};

const boardsContainer = {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center"
};

