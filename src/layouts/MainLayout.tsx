import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Wallet, ArrowDownCircle, LogOut, 
  Settings, Bell, CreditCard, ChevronDown 
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Notification States
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // 1. Fetch Notifications Logic
  const fetchNotifications = async () => {
    if (!user.id) return;
    try {
      const res = await fetch(`https://mondayonsol.fun/crypto-backend/crypto-backend/get_notifications.php?user_id=${user.id}`);
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data.list || []);
        setUnreadCount(data.data.unread_count || 0);
      }
    } catch (err) {
      console.error("Failed to fetch notifications");
    }
  };

  // 2. Mark as Read Logic (Triggered when dropdown opens)
  const markNotificationsAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      await fetch(`https://mondayonsol.fun/crypto-backend/crypto-backend/mark_notifications_read.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id })
      });
      setUnreadCount(0); // Update UI locally
    } catch (err) {
      console.error("Error marking notifications as read");
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [user.id]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="container-fluid p-0 d-flex bg-light min-vh-100">
      
      {/* SIDEBAR */}
      <nav className="bg-white border-end vh-100 position-sticky top-0 d-none d-lg-block" style={{ width: '260px' }}>
        <div className="p-4 d-flex flex-column h-100">
          <div className="d-flex align-items-center gap-2 mb-5 px-2">
            <div className="bg-primary rounded-3 shadow-sm d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px' }}>
              <Wallet size={20} className="text-white" />
            </div>
            <h5 className="mb-0 fw-bold tracking-tight">CryptoPay</h5>
          </div>
          
          <ul className="nav flex-column gap-2 flex-grow-1">
            <SidebarLink to="/dashboard" icon={<LayoutDashboard size={18}/>} label="Dashboard" active={location.pathname === '/dashboard'} />
            <SidebarLink to="/dashboard/invest" icon={<CreditCard size={18}/>} label="Investment" active={location.pathname === '/dashboard/invest'} />
            <SidebarLink to="/dashboard/deposit" icon={<ArrowDownCircle size={18}/>} label="Deposit" active={location.pathname === '/dashboard/deposit'} />
            <SidebarLink to="/dashboard/withdraw" icon={<Wallet size={18}/>} label="Withdraw" active={location.pathname === '/dashboard/withdraw'} />
            <SidebarLink to="/dashboard/settings" icon={<Settings size={18}/>} label="Settings" active={location.pathname === '/dashboard/settings'} />
          </ul>

          <div className="border-top pt-3">
             <button onClick={handleLogout} className="btn btn-link text-danger text-decoration-none d-flex align-items-center gap-2 w-100 px-3">
              <LogOut size={16}/> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* RIGHT SIDE CONTENT */}
      <div className="flex-grow-1 d-flex flex-column">
        
        {/* HEADER */}
        <header className="navbar bg-white border-bottom px-4 py-2 sticky-top shadow-sm" style={{ zIndex: 1020 }}>
          <div className="container-fluid p-0">
            <div className="d-md-block d-none">
              <span className="text-muted small">Account Overview</span>
              <h6 className="mb-0 fw-bold">{user.full_name || 'Member'}</h6>
            </div>

            <div className="ms-auto d-flex align-items-center gap-3">
              
              {/* NOTIFICATION DROP-DOWN */}
              <div className="dropdown">
                <button 
                  className="btn btn-light rounded-circle p-2 position-relative border" 
                  data-bs-toggle="dropdown"
                  onClick={markNotificationsAsRead}
                >
                  <Bell size={20} className="text-muted" />
                  {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <div className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4 mt-2 p-0" style={{ width: '320px' }}>
                  <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                    <span className="fw-bold small">Notifications</span>
                    {unreadCount > 0 && <span className="badge bg-primary rounded-pill small">{unreadCount} New</span>}
                  </div>
                  <div className="overflow-auto" style={{ maxHeight: '350px' }}>
                    {notifications.length > 0 ? (
                      notifications.map((note: any) => (
                        <div key={note.id} className={`p-3 border-bottom transition-all ${note.is_read ? '' : 'bg-light'}`}>
                          <p className="fw-bold mb-1 small text-dark">{note.title}</p>
                          <p className="text-muted mb-1" style={{ fontSize: '0.75rem', lineHeight: '1.2' }}>{note.message}</p>
                          <p className="text-xs text-muted mb-0" style={{ fontSize: '0.65rem' }}>
                            {new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(note.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-5 text-center text-muted">
                        <Bell size={30} className="mb-2 opacity-25" />
                        <p className="small mb-0">No notifications yet</p>
                      </div>
                    )}
                  </div>
                  <div className="p-2 border-top text-center">
                    <button className="btn btn-link btn-sm text-decoration-none small text-primary">Clear all</button>
                  </div>
                </div>
              </div>

              {/* PROFILE DROPDOWN */}
              <div className="dropdown">
                <button 
                  className="btn btn-white border-0 d-flex align-items-center gap-2 p-1 pe-2 rounded-pill hover-bg-light shadow-none" 
                  data-bs-toggle="dropdown"
                >
                  <img 
                    src={`https://ui-avatars.com/api/?name=${user.full_name}&background=0D6EFD&color=fff&bold=true`} 
                    className="rounded-circle border" 
                    width="35" 
                    height="35"
                    alt="user" 
                  />
                  <ChevronDown size={14} className="text-muted d-none d-sm-block" />
                </button>

                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-4 mt-2 p-2" style={{ minWidth: '220px' }}>
                  <li className="px-3 py-2 border-bottom mb-2">
                    <p className="small fw-bold mb-0 text-truncate">{user.full_name}</p>
                    <p className="text-muted mb-0" style={{ fontSize: '0.7rem' }}>{user.email}</p>
                  </li>
                  <li>
                    <Link className="dropdown-item rounded-3 py-2 d-flex align-items-center gap-2" to="/dashboard/deposit">
                      <ArrowDownCircle size={16} className="text-primary" /> Quick Deposit
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item rounded-3 py-2 d-flex align-items-center gap-2" to="/dashboard/settings">
                      <Settings size={16} className="text-secondary" /> Account Settings
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item rounded-3 py-2 text-danger d-flex align-items-center gap-2" onClick={handleLogout}>
                      <LogOut size={16} /> Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <main className="p-4 flex-grow-1 overflow-auto">
          <div className="container-fluid p-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

// Sidebar Link Component for cleaner code
const SidebarLink = ({ icon, label, to, active }: any) => (
  <li className="nav-item">
    <Link 
      to={to} 
      className={`nav-link d-flex align-items-center gap-3 rounded-3 px-3 py-2 transition-all ${
        active 
          ? 'bg-primary text-white shadow-sm' 
          : 'text-secondary hover-bg-light'
      }`}
    >
      {icon} <span className="fw-medium">{label}</span>
    </Link>
  </li>
);

export default MainLayout;