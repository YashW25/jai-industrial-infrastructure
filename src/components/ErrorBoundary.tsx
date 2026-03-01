import React, { Component, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * ErrorBoundary - Catches unhandled React render errors and shows a graceful fallback UI.
 * Wrap the App root with this to prevent blank white screens.
 */
export class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false, error: null };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error('[ErrorBoundary] Uncaught error:', error, info.componentStack);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <div
                    style={{
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'Inter, system-ui, sans-serif',
                        background: '#0f172a',
                        color: '#f8fafc',
                        padding: '2rem',
                        textAlign: 'center',
                    }}
                >
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        Something went wrong
                    </h1>
                    <p style={{ color: '#94a3b8', maxWidth: 480, marginBottom: '2rem', lineHeight: 1.6 }}>
                        An unexpected error occurred. Our team has been notified.
                        <br />
                        <code style={{ fontSize: '0.8rem', color: '#f87171' }}>
                            {this.state.error?.message}
                        </code>
                    </p>
                    <button
                        onClick={this.handleReset}
                        style={{
                            background: '#2563eb',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '0.5rem',
                            padding: '0.75rem 1.5rem',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            fontWeight: 600,
                        }}
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
