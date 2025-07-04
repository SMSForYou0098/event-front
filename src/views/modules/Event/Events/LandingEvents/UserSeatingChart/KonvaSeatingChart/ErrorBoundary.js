// Create a new file: ErrorBoundary.js
import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Seat map error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <div>Something went wrong loading the seat map.</div>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;