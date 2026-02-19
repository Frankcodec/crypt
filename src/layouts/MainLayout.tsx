import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Wallet, ArrowDownCircle, LogOut, 
  Settings, Bell, CreditCard, Menu, X 
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (!user.id) return;
    try {
      const res = await fetch(`https://api.nutcoinonsol.com/crypto-backend/get_notifications.php?user_id=${user.id}`);
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data.list || []);
        setUnreadCount(data.data.unread_count || 0);
      }
    } catch (err) { console.error("Failed to fetch notifications"); }
  };

  const markNotificationsAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      await fetch(`https://api.nutcoinonsol.com/mark_notifications_read.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id })
      });
      setUnreadCount(0);
    } catch (err) { console.error("Error marking as read"); }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user.id]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Close sidebar when clicking a link on mobile
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="d-flex bg-light min-vh-100 position-relative">
      
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50 d-lg-none" 
          style={{ zIndex: 1040 }} 
          onClick={closeSidebar}
        />
      )}

      {/* SIDEBAR (Desktop: Fixed, Mobile: Offcanvas) */}
      <nav 
        className={`bg-white border-end vh-100 position-fixed top-0 start-0 transition-all shadow-sm d-lg-block ${isSidebarOpen ? 'translate-x-0' : 'translate-x-mobile'}`}
        style={{ width: '260px', zIndex: 1050, transition: 'transform 0.3s ease-in-out' }}
      >
        <div className="p-4 d-flex flex-column h-100">
          <div className="d-flex align-items-center justify-content-between mb-5 px-2">
            <div className="d-flex align-items-center gap-2">
              <div className="bg-primary rounded-3 shadow-sm d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px' }}>
                <Wallet size={20} className="text-white" />
              </div>
              <h5 className="mb-0 fw-bold">CryptoPay</h5>
            </div>
            <button className="btn d-lg-none p-0 border-0" onClick={closeSidebar}>
              <X size={24} />
            </button>
          </div>
          
          <ul className="nav flex-column gap-2 flex-grow-1">
            <SidebarLink to="/dashboard" icon={<LayoutDashboard size={18}/>} label="Dashboard" active={location.pathname === '/dashboard'} onClick={closeSidebar} />
            <SidebarLink to="/dashboard/invest" icon={<CreditCard size={18}/>} label="Investment" active={location.pathname === '/dashboard/invest'} onClick={closeSidebar} />
            <SidebarLink to="/dashboard/deposit" icon={<ArrowDownCircle size={18}/>} label="Deposit" active={location.pathname === '/dashboard/deposit'} onClick={closeSidebar} />
            <SidebarLink to="/dashboard/withdraw" icon={<Wallet size={18}/>} label="Withdraw" active={location.pathname === '/dashboard/withdraw'} onClick={closeSidebar} />
            <SidebarLink to="/dashboard/settings" icon={<Settings size={18}/>} label="Settings" active={location.pathname === '/dashboard/settings'} onClick={closeSidebar} />
          </ul>

          <div className="border-top pt-3">
             <button onClick={handleLogout} className="btn btn-link text-danger text-decoration-none d-flex align-items-center gap-2 w-100 px-3">
              <LogOut size={16}/> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <div className="flex-grow-1 d-flex flex-column w-100" style={{ marginLeft: 'var(--sidebar-offset)' }}>
        
        {/* HEADER */}
        <header className="navbar bg-white border-bottom px-3 px-lg-4 py-2 sticky-top shadow-sm" style={{ zIndex: 1020 }}>
          <div className="container-fluid p-0">
            {/* Mobile Menu Toggle */}
            <button className="btn btn-light d-lg-none me-2" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={22} />
            </button>

            <div className="d-none d-sm-block">
              <span className="text-muted small">Welcome back,</span>
              <h6 className="mb-0 fw-bold">{user.full_name?.split(' ')[0] || 'Member'}</h6>
            </div>

            <div className="ms-auto d-flex align-items-center gap-2 gap-md-3">
              
              {/* NOTIFICATIONS */}
              <div className="dropdown">
                <button className="btn btn-light rounded-circle p-2 position-relative border" data-bs-toggle="dropdown" onClick={markNotificationsAsRead}>
                  <Bell size={18} className="text-muted" />
                  {unreadCount > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{unreadCount}</span>}
                </button>
                <div className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4 mt-2 p-0" style={{ width: '280px', maxWidth: '90vw' }}>
                  <div className="p-3 border-bottom fw-bold small">Notifications</div>
                  <div className="overflow-auto" style={{ maxHeight: '300px' }}>
                    {notifications.length > 0 ? (
                      notifications.map((note: any) => (
                        <div key={note.id} className="p-3 border-bottom small text-muted">
                          <p className="fw-bold mb-1 text-dark">{note.title}</p>
                          <p className="mb-0 text-truncate">{note.message}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-muted small">No notifications</div>
                    )}
                  </div>
                </div>
              </div>

              {/* USER PROFILE */}
              <div className="dropdown">
                <button className="btn p-0 border-0" data-bs-toggle="dropdown">
                  <img src={`https://ui-avatars.com/api/?name=${user.full_name}&background=0D6EFD&color=fff&bold=true`} className="rounded-circle border" width="35" height="35" alt="user" />
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4 p-2 mt-2">
                  <li className="px-3 py-2 small border-bottom"><strong>{user.full_name}</strong></li>
                  <li><Link className="dropdown-item rounded-3" to="/dashboard/settings">Settings</Link></li>
                  <li><button className="dropdown-item text-danger rounded-3" onClick={handleLogout}>Sign Out</button></li>
                </ul>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="py-3 px-lg-3 px-2  p-md-4 flex-grow-1" style={{ paddingBottom: '80px' }}>
          <Outlet />
        </main>

        {/* MOBILE BOTTOM NAVIGATION (Visible only on mobile) */}
        <div className="d-lg-none fixed-bottom bg-white border-top shadow-lg py-2 px-3">
          <div className="d-flex justify-content-between align-items-center">
            <MobileTab to="/dashboard" icon={<LayoutDashboard size={20}/>} active={location.pathname === '/dashboard'} />
            <MobileTab to="/dashboard/invest" icon={<CreditCard size={20}/>} active={location.pathname === '/dashboard/invest'} />
            <MobileTab to="/dashboard/deposit" icon={<ArrowDownCircle size={20}/>} active={location.pathname === '/dashboard/deposit'} />
            <MobileTab to="/dashboard/withdraw" icon={<Wallet size={20}/>} active={location.pathname === '/dashboard/withdraw'} />
            <MobileTab to="/dashboard/settings" icon={<Settings size={20}/>} active={location.pathname === '/dashboard/settings'} />
          </div>
        </div>
      </div>

      <style>{`
        :root { --sidebar-offset: 260px; }
        @media (max-width: 991.98px) {
          :root { --sidebar-offset: 0px; }
          .translate-x-mobile { transform: translateX(-100%); }
          .translate-x-0 { transform: translateX(0); }
        }
        .transition-all { transition: all 0.3s ease; }
        .hover-bg-light:hover { background-color: #f8f9fa; }
      `}</style>
    </div>
  );
};

const SidebarLink = ({ icon, label, to, active, onClick }: any) => (
  <li className="nav-item">
    <Link to={to} onClick={onClick} className={`nav-link d-flex align-items-center gap-3 rounded-3 px-3 py-2 ${active ? 'bg-primary text-white' : 'text-secondary hover-bg-light'}`}>
      {icon} <span className="fw-medium">{label}</span>
    </Link>
  </li>
);

const MobileTab = ({ icon, to, active }: any) => (
  <Link to={to} className={`p-2 rounded-3 ${active ? 'text-primary' : 'text-muted'}`}>
    {icon}
  </Link>
);

export default MainLayout;