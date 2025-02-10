import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorBoundary from './ErrorBoundary';
import reportWebVitals from './reportWebVitals';
/*
// Custom error handling logic
const handleGlobalError = (message, source, lineno, colno, error) => {
  console.error('Global error caught:', message, source, lineno, colno, error);
  // Set an error flag in sessionStorage (use sessionStorage instead of localStorage to avoid persisting across sessions)
  sessionStorage.setItem('hasError', 'true');
  // Attempt to reload the page
  window.location.reload();
};

const handleUnhandledRejection = (event) => {
  console.error('Unhandled promise rejection:', event);
  // Set an error flag in sessionStorage
  sessionStorage.setItem('hasError', 'true');
  // Attempt to reload the page
  window.location.reload();
};

// Assign custom error handlers
window.onerror = handleGlobalError;
window.onunhandledrejection = handleUnhandledRejection;

// Check if the page was reloaded due to an error
window.addEventListener('load', () => {
  const hasError = sessionStorage.getItem('hasError');
  if (hasError) {
    // Show the error banner
    const errorBanner = document.getElementById('global-error-banner');
    if (errorBanner) {
      errorBanner.style.display = 'block';
    }
    // Clear the error flag
    sessionStorage.removeItem('hasError');
  }
});




root.render(

  <React.StrictMode>
    <ErrorBoundary>
      <div id="global-error-banner" className="error-banner" style={{ display: 'none' }}>
        <p>Sorry, an unexpected error occurred.</p>
        <button onClick={() => document.getElementById('global-error-banner').style.display = 'none'} className="close-button">X</button>
      </div>
      <App />
      </ErrorBoundary>
  </React.StrictMode>
);*/

//</ErrorBoundary>
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
      <App />
);


reportWebVitals();
