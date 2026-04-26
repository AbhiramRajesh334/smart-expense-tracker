import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Login Page</h1>
      {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '10px 15px', cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
