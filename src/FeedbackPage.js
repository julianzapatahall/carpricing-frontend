import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
// Import both logo images
import logo from './checkmatewizard_transparent.png'; // Adjust the path as needed
import logoWhite from './checkmatewizard_pure_white.png'; // Adjust the path as needed
import DOMPurify from 'dompurify'; // For input sanitization


const FeedbackPage = () => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1200);
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  
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
              

              const handleSubmit = async (e) => {
                e.preventDefault();
                
                // Input validation
                if (!feedback.trim()) {
                  displayErrorBanner('Please enter your feedback');
                  return;
                }
            
                // Sanitize inputs
                const cleanFeedback = DOMPurify.sanitize(feedback);
                const cleanEmail = DOMPurify.sanitize(email);
            
                try {
                  // Send to secure backend (example using Firebase)
                  const response = await fetch('https://your-firebase-function-url/feedback', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      message: cleanFeedback,
                      email: cleanEmail,
                      timestamp: new Date().toISOString()
                    })
                  });
            
                  if (response.ok) {
                    setSuccessMessage('Thank you for your feedback!');
                    setFeedback('');
                    setEmail('');
                    setTimeout(() => setSuccessMessage(''), 3000);
                  } else {
                    displayErrorBanner('Failed to submit feedback. Please try again.');
                  }
                } catch (error) {
                  displayErrorBanner('Connection error. Please check your network.');
                }
              };
            
              // Add this inside the main content section
              const feedbackForm = (
                <div className="feedback-container">
                  <form onSubmit={handleSubmit} className="feedback-form">
                    <div className="form-group">
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Your feedback (max 500 characters)"
                        maxLength={500}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Optional email for response"
                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                      />
                    </div>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    {successMessage && <div className="success-message">{successMessage}</div>}
                    <button type="submit" className="submit-button">Submit Feedback</button>
                  </form>
                </div>
              );

  const handleSectionClick = (section) => {
    setSelectedSection(selectedSection === section ? null : section);
  };
  function displayErrorBanner(message) {
            console.log(2);
            // Clear any existing banners first
            const existingBanners = document.querySelectorAll('.error-banner');
            existingBanners.forEach(banner => banner.remove());
            console.log(3);
            // Create and style banner
            const banner = document.createElement('div');
            banner.className = 'error-banner';
            banner.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: #ff4444;
                color: white;
                padding: 15px;
                text-align: center;
                z-index: 10000;
                font-size: 16px;
                font-weight: bold;
                animation: slideIn 0.3s ease-out;
            `;
            console.log(4);
          
            // Add keyframe animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideIn {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(0); }
                }
            `;
            document.head.appendChild(style);
          
            banner.innerHTML = `<p>${message}</p>`;
            document.body.prepend(banner);
          
            // Reload after 3 seconds
            setTimeout(() => {
                banner.remove();
                style.remove();
                window.location.reload();
            }, 3000);
          };


  const getBlackPiecePath = (piece) => {
    switch (piece) {
      case 'king':
        return 'f/f0/Chess_kdt45.svg';
      case 'queen':
        return '4/47/Chess_qdt45.svg';
      case 'rook':
        return 'f/ff/Chess_rdt45.svg';
      case 'bishop':
        return '9/98/Chess_bdt45.svg';
      case 'knight':
        return 'e/ef/Chess_ndt45.svg';
      case 'pawn':
        return 'c/c7/Chess_pdt45.svg';
      default:
        return '';
    }
  };

  const getWhitePiecePath = (piece) => {
    switch (piece) {
      case 'king':
        return '4/42/Chess_klt45.svg';
      case 'queen':
        return '1/15/Chess_qlt45.svg';
      case 'rook':
        return '7/72/Chess_rlt45.svg';
      case 'bishop':
        return 'b/b1/Chess_blt45.svg';
      case 'knight':
        return '7/70/Chess_nlt45.svg';
      case 'pawn':
        return '4/45/Chess_plt45.svg';
      default:
        return '';
    }
  };

  const sections = {
    bio: "Feature Player, was born and immediately excelled through hard work and perseverance.",
    accomplishments: "List, Of, Accomplishments",
    skills: {
      positionalPlay: "The featured player has great positional play.",
      endgameMastery: "The featured player has great endgame play.",
      versatility: "The featured player has great versatile play."
    }
  };

  return (
    <div className="about-magnus">
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
        <h1 className="artistic-heading">Help Us Improve</h1>
      <p className="artistic-subheading">We Want Your Feedback!!</p>
      </header>
      <main style={{backgroundImage:'notgonnawork.png'}}>
      {feedbackForm}
        
      <div className="floating-pieces">
        {['king', 'queen', 'rook', 'bishop', 'knight', 'pawn'].flatMap((piece) =>
          ['black', 'white'].flatMap((color) =>
            [...Array(10)].map((_, i) => (
              <img
                key={`${piece}-${color}-${i}`}
                src={`https://upload.wikimedia.org/wikipedia/commons/${color === 'black' ? getBlackPiecePath(piece) : getWhitePiecePath(piece)}`}
                className={`chess-piece ${piece}-${color}-${i}`}
                alt={`${piece}-${color}`}
              />
            ))
          )
        )}
        <div className="hidden-section bio">
          <span>Community</span>
        </div>
        <div className="hidden-section accomplishments">
          <span>Chess Knowledge</span>
        </div>
        <div className="hidden-section skills">
          <span>Skills</span>
        </div>
      </div>
      

      {selectedSection && (
        <div className={`section-content ${selectedSection}`}>
          {selectedSection === 'bio' && <div className="scrollable-content"><p>{sections.bio}</p></div>}
          {selectedSection === 'accomplishments' && (
            <div className="scrollable-content">
              <ul>{sections.accomplishments.split(', ').map(acc => <li key={acc}>{acc}</li>)}</ul>
            </div>
          )}
          {selectedSection === 'skills' && (
            <div className="scrollable-content">
              <h3>Positional Play</h3>
              <p>{sections.skills.positionalPlay}</p>
              <h3>Endgame Mastery</h3>
              <p>{sections.skills.endgameMastery}</p>
              <h3>Versatility</h3>
              <p>{sections.skills.versatility}</p>
            </div>
          )}
        </div>
      )}
      </main>
      <footer>
      <p>&copy; 2025 CheckmateWizard.com All rights reserved.</p>
      </footer>
    </div>
  );
};

export default FeedbackPage;

//        <div className="hidden-section skills" onClick={() => handleSectionClick('skills')}>
