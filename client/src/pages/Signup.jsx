import { useState } from 'react';
import { signup } from '../services/auth';

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
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Signup Page</h1>
      {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
      {success && <p style={{ color: 'green', marginBottom: '15px' }}>{success}</p>}
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
            minLength="6"
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '10px 15px', cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Signing up...' : 'Signup'}
        </button>
      </form>
    </div>
  );
};

export default Signup;
