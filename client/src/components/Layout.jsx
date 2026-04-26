import Sidebar from './Sidebar';
import '../pages/Dashboard.css';

const Layout = ({ children, title, subtitle }) => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <header className="main-header">
          <div className="main-title">
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <div className="date-pill">
            <span>📅</span> {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </header>
        {children}
      </main>
    </div>
  );
};

export default Layout;
