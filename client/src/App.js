import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import StockfishGamePage from './StockfishGamePage';
import AnalysisBoardPage from './AnalysisBoardPage';
import SignupPage from './SignupPage';
import BlunderPunisher from './BlunderPunisher';
import WeaknessFinder from './WeaknessFinder';
import FeedbackPage from './FeedbackPage';
import TreeExplorer from './TreeExplorer';

// Global error handlers
window.onerror = (message, source, lineno, colno, error) => {
  if (error?.message?.includes('ArrayBuffer allocation failed')) {
    displayErrorBanner('Array Buffer Allocation Failed');
  } else {
    displayErrorBanner('Unexpected error encountered');
  }
  // Return true to prevent the default error handling
  return true;
};

window.onunhandledrejection = (event) => {
  if (event.reason?.message?.includes('ArrayBuffer allocation failed')) {
    displayErrorBanner('Array Buffer Allocation Failed');
  } else {
    displayErrorBanner('Unexpected error encountered');
  }
  // Return true to prevent the default error handling
  return true;
};
// Function to display the error banner and reload the page
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
}

function App() {
  // Check for stored error message on page load
  useEffect(() => {
    const errorMessage = localStorage.getItem('errorMessage');
    if (errorMessage) {
      const banner = document.createElement('div');
      banner.className = 'error-banner';
      banner.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background-color: red;
        color: white;
        text-align: center;
        padding: 10px;
        z-index: 1000;
      `;
      banner.innerHTML = `<p>${errorMessage}</p>`;
      document.body.appendChild(banner);

      // Clear the error message from localStorage
      localStorage.removeItem('errorMessage');

      // Remove the banner after 3 seconds
      setTimeout(() => {
        banner.remove();
      }, 3000);
    }
  }, []);

  return (
      <Router>
        <div>
          <Routes>
            <Route exact path="/" element={<LandingPage />} />
            <Route path="/play-stockfish" element={<StockfishGamePage />} />
            <Route path="/blunder-punisher" element={<BlunderPunisher />} />
            <Route path="/weakness-finder" element={<WeaknessFinder />} />
            <Route path="/analysis-board" element={<AnalysisBoardPage />} />
            <Route path="/tree-explorer" element={<TreeExplorer />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;


/*





*/