// frontend/src/layouts/VoterLayout.jsx
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function VoterLayout() {
  const { logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Navbar */}
      <nav className="navbar navbar-expand navbar-light bg-light shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/voter">🗳️ Voting SaaS</Link>
          <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt me-1"></i> Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container flex-grow-1 py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            {location.pathname !== '/voter' && (
              <Link to="/voter" className="text-decoration-none text-muted">
                <i className="fas fa-arrow-left me-2"></i>
                Back to Elections
              </Link>
            )}
            <h2 className="mb-0 mt-2">
              {location.pathname === '/voter' ? 'Active Elections' : 'Cast Your Vote'}
            </h2>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}