// CustomErrorHandler.js
import React from 'react';

class CustomErrorHandler extends React.Component {
  componentDidMount() {
    window.onerror = this.handleGlobalError;
    window.onunhandledrejection = this.handleUnhandledRejection;
  }

  handleGlobalError = (message, source, lineno, colno, error) => {
    console.error('Global error caught:', message, source, lineno, colno, error);
    // Set an error flag in localStorage
    localStorage.setItem('hasError', 'true');
    // Attempt to reload the page
    window.location.reload();
  };

  handleUnhandledRejection = (event) => {
    console.error('Unhandled promise rejection:', event);
    // Set an error flag in localStorage
    localStorage.setItem('hasError', 'true');
    // Attempt to reload the page
    window.location.reload();
  };

  render() {
    return this.props.children;
  }
}

export default CustomErrorHandler;
