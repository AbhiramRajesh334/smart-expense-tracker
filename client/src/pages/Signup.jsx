import { useState } from 'react';
import { Link } from 'react-router-dom';
import { signup } from '../services/auth';
import '../pages/Dashboard.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const data = await signup(email, password);
      setSuccess(data.message || 'Signup successful! You can now login.');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: 'var(--bg-main)',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '40px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '32px' }}>
          <div className="sidebar-header-icon">💸</div>
          <h2 style={{ margin: 0, fontSize: '24px', color: 'var(--text-primary)' }}>SpendWise</h2>
        </div>
        
        <h3 style={{ textAlign: 'center', marginBottom: '24px', color: 'var(--text-primary)', fontSize: '20px', fontWeight: '600' }}>
          Create an Account
        </h3>
        
        {error && <div className="error-message">{error}</div>}
        {success && (
          <div style={{ 
            backgroundColor: 'rgba(34, 197, 94, 0.1)', 
            color: '#4ade80', 
            padding: '12px', 
            borderRadius: '8px', 
            border: '1px solid rgba(34, 197, 94, 0.2)', 
            marginBottom: '24px',
            fontSize: '14px'
          }}>
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Create a password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-purple)', textDecoration: 'none', fontWeight: '500' }}>
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
