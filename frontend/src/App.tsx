import { useEffect, useState } from 'react';
import './App.css';

interface ApiStatus {
  status: string;
  timestamp: string;
  service: string;
}

function App() {
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkApi = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/ping`);
        if (!response.ok) throw new Error('API not available');
        const data = await response.json();
        setApiStatus(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to connect to API');
        setApiStatus(null);
      } finally {
        setLoading(false);
      }
    };

    checkApi();
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>🏃 FBC Running</h1>
      </header>

      <main className="main">
        <div className="status-card">
          <h2>System Status</h2>
          {loading && <p className="loading">Checking API connection...</p>}
          {error && (
            <div className="status error">
              <span className="indicator">●</span>
              <span>Backend: Offline</span>
              <p className="error-message">{error}</p>
            </div>
          )}
          {apiStatus && (
            <div className="status success">
              <span className="indicator">●</span>
              <span>Backend: Online</span>
              <p className="details">
                Service: {apiStatus.service}<br />
                Last check: {new Date(apiStatus.timestamp).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <p>FBC Running © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;
