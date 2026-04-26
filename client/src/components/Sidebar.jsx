import { Link, useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-header-icon">₹</div>
        <div className="sidebar-title">
          <h2>SpendWise</h2>
          <p>Smart Expense Tracker</p>
        </div>
      </div>

      <nav className="nav-links">
        <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
          <span>⌂</span> Dashboard
        </Link>
        <Link to="/analytics" className={`nav-link ${location.pathname === '/analytics' ? 'active' : ''}`}>
          <span>📊</span> Analytics
        </Link>
        <Link to="/insights" className={`nav-link ${location.pathname === '/insights' ? 'active' : ''}`}>
          <span>💡</span> Insights
        </Link>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">👤</div>
          <div className="user-info">
            <p>John Doe</p>
            <span>john.doe@example.com</span>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
