import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import MainLayout from './layouts/MainLayout';
import DashboardHome from './pages/Dashboard';
import DepositPage from './pages/DepositPage';
import WithdrawPage from './pages/WithdrawPage';
import InvestPage from './pages/InvestPage';
import InvestmentDetail from './components/InvestmentDetail';
import SettingsPage from './pages/SettingsPage';
import AdminLayout from './admin/layouts/AdminLayout';
import AdminWallets from './admin/pages/AdminWallets';
import AdminTransactions from './admin/pages/AdminTransactions';
import AdminPlans from './admin/pages/AdminPlans';
import AdminApprovePlan from './admin/pages/AdminApprovePlan';
import AdminUserManagement from './admin/pages/AdminUserManagement';
import UserDetails from './admin/components/UserDetails';
import AdminDashboard from './admin/pages/AdminDashboard';
import PlatformSettings from './admin/pages/PlatformSettings';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLogin from './admin/components/AdminLogin';
import LandingPage from './layouts/LandingPage';
import AdminEmailPanel from './admin/pages/AdminEmailPanel';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<LandingPage />} />
        
        {/* NESTED DASHBOARD ROUTES */}
        <Route path="/dashboard" element={<MainLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="deposit" element={<DepositPage />} />
          <Route path="withdraw" element={<WithdrawPage />} />
          <Route path="invest" element={<InvestPage />} />
          <Route path="investment/:id" element={<InvestmentDetail />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        {/* ADMIN ROUTES WITH PROTECTION */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="wallets" element={<AdminWallets />} />
            <Route path="transactions" element={<AdminTransactions />} />
            <Route path="plans" element={<AdminPlans />} />
            <Route path="approve-plans" element={<AdminApprovePlan />} />
            <Route path="users" element={<AdminUserManagement />} />
            <Route path="user/:id" element={<UserDetails />} />
            <Route path="settings" element={<PlatformSettings />} />
            <Route path="email" element={<AdminEmailPanel />} />
          </Route>
        </Route>
        <Route path="/admin-login" element={<AdminLogin />} />
        {/* REDIRECT UNKNOWN ROUTES */}
        <Route path="/login" element={<Login />} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;