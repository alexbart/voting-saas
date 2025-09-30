// frontend/src/layouts/AdminLayout.jsx
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminLayout() {
  const { logout } = useAuth();
  const location = useLocation();

  // Map routes to human-readable titles
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard';
    if (path === '/admin/users') return 'User Management';
    if (path === '/admin/audit') return 'Audit Logs';
    if (path === '/admin/create-election') return 'Create Election';
    if (path.startsWith('/admin/results/')) return 'Election Results';
    return 'Admin Panel';
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-vh-100 d-flex">
      {/* Sidebar */}
      <div className="d-flex flex-column flex-shrink-0 p-3 bg-light" style={{ width: 280 }}>
        <Link to="/admin" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
          <span className="fs-4">🗳️ Admin Panel</span>
        </Link>
        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>
              <i className="fas fa-tachometer-alt me-2"></i> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/users" className={`nav-link ${location.pathname === '/admin/users' ? 'active' : ''}`}>
              <i className="fas fa-users me-2"></i> Users
            </Link>
          </li>
          <li>
            <Link to="/admin/audit" className={`nav-link ${location.pathname === '/admin/audit' ? 'active' : ''}`}>
              <i className="fas fa-history me-2"></i> Audit Logs
            </Link>
          </li>
          <li>
            <Link to="/admin/create-election" className={`nav-link ${location.pathname === '/admin/create-election' ? 'active' : ''}`}>
              <i className="fas fa-plus-circle me-2"></i> Create Election
            </Link>
          </li>
        </ul>
        <hr />
        <button className="btn btn-outline-danger w-100" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt me-2"></i> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            {location.pathname !== '/admin' && (
              <Link to="/admin" className="text-decoration-none text-muted">
                <i className="fas fa-arrow-left me-2"></i>
                Back to Dashboard
              </Link>
            )}
            <h2 className="mb-0 mt-2">{getPageTitle()}</h2>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}