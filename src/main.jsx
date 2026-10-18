import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Crash Error:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('ag_settings');
      localStorage.removeItem('ag_students');
      localStorage.removeItem('ag_courses');
      localStorage.removeItem('ag_payments');
      localStorage.removeItem('ag_teachers');
      localStorage.removeItem('ag_expenses');
    } catch (e) {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8f7f4',
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            padding: '1.5rem',
            textAlign: 'center',
            color: '#0f172a'
          }}
        >
          <div
            style={{
              maxWidth: '520px',
              backgroundColor: '#ffffff',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #e2e8f0'
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}
            >
              !
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
              Al Ghazi Digital Institute Portal
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Application encountered a display issue on this device. Click below to load your dashboard smoothly.
            </p>
            {this.state.error?.message && (
              <pre
                style={{
                  textAlign: 'left',
                  backgroundColor: '#f1f5f9',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  color: '#dc2626',
                  overflowX: 'auto',
                  marginBottom: '1.25rem'
                }}
              >
                {this.state.error.message}
              </pre>
            )}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Reload App
              </button>
              <button
                onClick={this.handleReset}
                style={{
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  border: '1px solid #cbd5e1',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Reset & Clear Storage
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
