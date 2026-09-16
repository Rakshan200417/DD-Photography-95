import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="container mt-5 text-center">
                    <h1>Something went wrong.</h1>
                    <p className="text-danger">{this.state.error && this.state.error.toString()}</p>
                    <button className="btn btn-primary" onClick={() => window.location.href = '/'}>Reload Page</button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
