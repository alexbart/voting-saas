// frontend/src/routes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VoterLayout from './layouts/VoterLayout';
import AdminLayout from './layouts/AdminLayout';
import VoterDashboard from './pages/voter/Dashboard';
import CastVote from './pages/voter/CastVote';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminAudit from './pages/admin/Audit';
import AdminCreateElection from './pages/admin/CreateElection';
import LandingPage from './pages/LandingPage';  
import MainLayout from './layouts/MainLayout';
import Results from './pages/admin/Results';
// Protected route wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" />;
  }
  return children;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<MainLayout />}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      </Route>

      {/* Voter routes */}
      <Route
        path="/voter/*"
        element={
          <ProtectedRoute allowedRoles={['Student', 'Shareholder', 'Teacher', 'Candidate']}>
            <VoterLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<VoterDashboard />} />
        <Route path="vote/:id" element={<CastVote />} />
      </Route>

      {/* Admin routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="audit" element={<AdminAudit />} />
        <Route path="create-election" element={<AdminCreateElection />} />
        <Route path="results/:id" element={<Results />} />
      </Route>

      {/* Redirect root */}
      <Route path="/" element={<Navigate to="/voter" />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}