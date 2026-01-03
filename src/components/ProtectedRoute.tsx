// filepath: src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const adminData = localStorage.getItem('admin_user');
  const admin = adminData ? JSON.parse(adminData) : null;

  // Check if user exists and has the admin role
  if (!admin || admin.role !== 'admin') {
    return <Navigate to="/admin-login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;