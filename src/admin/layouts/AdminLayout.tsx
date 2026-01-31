import React, { useState } from 'react';
import { 
  Users, Activity, CreditCard, BarChart3, 
  Settings, UserPlus, ShieldAlert, PlusCircle, Menu, X, 
  Mail
} from 'lucide-react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="d-flex bg-light min-vh-100">
      
      {/* MOBILE OVERLAY (Backdrop) */}
      {isSidebarOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50 d-lg-none" 
          style={{ zIndex: 1040 }} 
          onClick={closeSidebar}
        />
      )}

      {/* SIDEBAR */}
      <div className={`
        bg-dark text-white p-4 position-fixed position-lg-sticky top-0 vh-100 transition-all
        ${isSidebarOpen ? 'start-0' : 'start-n280'} start-lg-0
      `} 
      style={{ 
        width: '280px', 
        zIndex: 1050,
        left: isSidebarOpen ? '0' : '-280px',
        transition: 'left 0.3s ease'
      }}>
        <div className="d-flex align-items-center justify-content-between mb-5">
          <div className="d-flex align-items-center gap-2">
            <div className="bg-primary p-2 rounded-3 text-white"><ShieldAlert size={24}/></div>
            <h4 className="mb-0 fw-bold">Admin Panel</h4>
          </div>
          {/* Close button for mobile */}
          <button className="btn btn-link text-white d-lg-none p-0" onClick={closeSidebar}>
            <X size={24} />
          </button>
        </div>

        <nav className="nav flex-column gap-1">
          <AdminNavLink to="/admin" icon={<Activity size={18}/>} label="Overview" active={location.pathname === '/admin'} onClick={closeSidebar} />
          <AdminNavLink to="/admin/users" icon={<Users size={18}/>} label="User Management" active={location.pathname === '/admin/users'} onClick={closeSidebar} />
          <AdminNavLink to="/admin/transactions" icon={<CreditCard size={18}/>} label="Approve/Decline" active={location.pathname === '/admin/transactions'} onClick={closeSidebar} />
          <AdminNavLink to="/admin/plans" icon={<PlusCircle size={18}/>} label="Manage Plans" active={location.pathname === '/admin/plans'} onClick={closeSidebar} />
          <AdminNavLink to="/admin/wallets" icon={<CreditCard size={18}/>} label="System Wallets" active={location.pathname === '/admin/wallets'} onClick={closeSidebar} />
          <AdminNavLink to="/admin/settings" icon={<Settings size={18}/>} label="Platform Settings" active={location.pathname === '/admin/settings'} onClick={closeSidebar} />
          <AdminNavLink to="/admin/approve-plans" icon={<BarChart3 size={18}/>} label="Approve Plans" active={location.pathname === '/admin/approve-plans'} onClick={closeSidebar} />
          <AdminNavLink to="/admin/email" icon={<Mail size={18}/>} label="Email Panel" active={location.pathname === '/admin/email'} onClick={closeSidebar} />
          <AdminNavLink to="/admin/balance-editor" icon={<CreditCard size={18}/>} label="Balance Editor" active={location.pathname === '/admin/balance-editor'} onClick={closeSidebar} />
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-grow-1" style={{ minWidth: 0 }}>
        <header className="bg-white border-bottom p-3 p-lg-4 d-flex justify-content-between align-items-center sticky-top">
          <div className="d-flex align-items-center gap-3">
            {/* Hamburger Menu Icon */}
            <button className="btn btn-light d-lg-none border" onClick={toggleSidebar}>
              <Menu size={20} />
            </button>
            <h5 className="fw-bold mb-0 d-none d-sm-block">Control Center</h5>
          </div>
          
          <div className="d-flex gap-2">
             <button className="btn btn-primary btn-sm rounded-pill px-3 shadow-sm d-flex align-items-center">
                <UserPlus size={16} className="me-lg-2"/> 
                <span className="d-none d-lg-inline">Create User</span>
             </button>
          </div>
        </header>

        <main className="p-3 p-lg-4">
          <div className="container-fluid px-0">
            <Outlet />
          </div>
        </main>
      </div>

      {/* CSS for custom transitions and hover */}
      <style>{`
        .start-n280 { left: -280px; }
        .transition-all { transition: all 0.3s ease; }
        .hover-bg-dark:hover { background-color: rgba(255,255,255,0.05); color: white !important; }
        @media (min-width: 992px) {
          .start-lg-0 { left: 0 !important; position: sticky !important; }
        }
      `}</style>
    </div>
  );
};

const AdminNavLink = ({ to, icon, label, active, onClick }: any) => (
  <Link 
    to={to} 
    onClick={onClick}
    className={`nav-link d-flex align-items-center gap-3 px-3 py-3 rounded-3 transition-all ${active ? 'bg-primary text-white shadow' : 'text-secondary hover-bg-dark'}`}
  >
    {icon} <span className="fw-medium text-nowrap">{label}</span>
  </Link>
);

export default AdminLayout;