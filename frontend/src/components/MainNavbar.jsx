import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function MainNavbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">🗳️ Voting SaaS</Link>
        <div className="d-flex align-items-center">
          {currentUser ? (
            <div className="d-flex align-items-center">
              {currentUser.role === 'Admin' && (
                <Link to="/admin" className="btn btn-outline-primary btn-sm me-2">
                  Admin
                </Link>
              )}
              <Link 
                to={currentUser.role === 'Admin' ? '/admin' : '/voter'} 
                className="btn btn-primary btn-sm me-2"
              >
                Dashboard
              </Link>
              <button className="btn btn-outline-secondary btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-primary me-2">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}