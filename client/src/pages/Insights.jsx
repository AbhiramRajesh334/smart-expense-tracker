import { useState } from 'react';
import Layout from '../components/Layout';

const AI_QUERY_URL = 'http://localhost:5000/api/ai/query';
const EXAMPLE_QUERIES = ['Food expenses this week', 'Travel last month', 'Auto expenses'];

const Insights = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const handleAsk = async () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery || loading) return;

    setLoading(true);
    setError('');
    setResponse('');

    try {
      const token = localStorage.getItem('token');
      const apiResponse = await fetch(AI_QUERY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: trimmedQuery }),
      });

      const data = await apiResponse.json();
      if (!apiResponse.ok) {
        throw new Error(data.message || 'Failed to fetch AI insight');
      }

      setResponse(data.message || 'No response generated.');
    } catch (err) {
      setError(err.message || 'Something went wrong while getting AI response.');
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (example) => {
    setQuery(example);
    setError('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAsk();
    }
  };

  return (
    <Layout title="AI Insights" subtitle="Intelligent expense recommendations">
      <div className="card" style={{ maxWidth: '920px', margin: '0 auto' }}>
        <div className="card-header" style={{ marginBottom: '18px' }}>
          <h3>
            <span>🤖</span> AI Expense Assistant
          </h3>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', alignItems: 'stretch' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Ask about your expenses..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              width: 'auto',
              minWidth: 0,
              background: '#161a22',
              color: '#fff',
              borderRadius: '12px',
            }}
          />
          <button
            type="button"
            className="btn-primary"
            onClick={handleAsk}
            disabled={loading || !query.trim()}
            style={{
              width: '140px',
              minWidth: '140px',
              flexShrink: 0,
              marginTop: 0,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6d5efc, #7f66ff)',
            }}
          >
            {loading ? 'Thinking...' : 'Ask'}
          </button>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '10px' }}>Try examples:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {EXAMPLE_QUERIES.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => handleExampleClick(example)}
                style={{
                  padding: '7px 12px',
                  borderRadius: '999px',
                  border: '1px solid #2d3445',
                  background: '#121722',
                  color: '#d8deea',
                  cursor: 'pointer',
                }}
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {response && (
          <div
            style={{
              marginTop: '14px',
              padding: '16px',
              borderRadius: '12px',
              background: '#111827',
              border: '1px solid #253048',
              boxShadow: '0 6px 18px rgba(0, 0, 0, 0.25)',
            }}
          >
            <p style={{ color: '#9fb0c8', marginBottom: '6px', fontSize: '0.9rem' }}>Result</p>
            <p style={{ color: '#f1f5f9', lineHeight: '1.6' }}>{response}</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Insights;
