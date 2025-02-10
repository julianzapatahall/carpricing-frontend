import React, { Component } from 'react';
import handleGlobalError from './App.js'; // Import the global error handler


/**
 * ErrorBoundary component to catch React errors within components.
 * Prevents UI from breaking and shows a fallback UI instead.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }
  

  static getDerivedStateFromError(error) {
    // Update state to indicate an error occurred
    return { hasError: true, errorMessage: error.message || 'Something went wrong' };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Component Error:", error, errorInfo);
    handleGlobalError(error); // Use global error handler
  }
  

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>An unexpected error occurred</h2>
          <p>{this.state.errorMessage}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
