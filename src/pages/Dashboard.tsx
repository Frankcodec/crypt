import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, UserCheck, FileText, Search, Bell, Moon, LogOut } from 'lucide-react';
import ReferralStats from '../components/Refer';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [stats, setStats] = useState({ balance: '0.00', transactions: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get user info from localStorage
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/login'); // Redirect if not logged in
      return;
    }
    const user = JSON.parse(savedUser);
    setUserData(user);

    // 2. Fetch Live Data from PHP
    fetch(`http://localhost/crypto-backend/get_dashboard_data.php?user_id=${user.id}`)
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          setStats({
            balance: result.balance,
            transactions: result.transactions
          });
        }
        setLoading(false);
      })
      .catch(err => console.error("Error fetching data:", err));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) return <div className="d-flex justify-content-center mt-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container-fluid p-0 d-flex bg-light min-vh-100">
      
      

      {/* MAIN CONTENT */}
      <div className="flex-grow-1">

        <div className="p-4">
          <h3 className="fw-bold mb-4">Dashboard Overview</h3>

          {/* STAT CARDS */}
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <StatCard label="Total Balance" value={`$${stats.balance}`} color="primary" icon={<FileText size={20}/>} />
            </div>
            <div className="col-md-4">
              <StatCard label="Active Transactions" value={stats.transactions.length.toString()} color="info" icon={<Users size={20}/>} />
            </div>
            <div className="col-md-4">
              <StatCard label="Account Status" value="Verified" color="success" icon={<UserCheck size={20}/>} />
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-12">
              <div className="card border-0 shadow-sm overflow-hidden">
                <div className="card-header bg-white border-0 pt-4 px-4">
                  <h6 className="fw-bold">Recent Transactions</h6>
                </div>
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr className="small text-uppercase text-muted">
                      <th className="px-4 py-3">Type</th>
                      <th className="py-3">Amount</th>
                      <th className="py-3">Status</th>
                      <th className="py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.transactions.length > 0 ? (
                      stats.transactions.map((tx: any, index: number) => (
                        <tr key={index}>
                          <td className="px-4 py-3 fw-medium text-capitalize">{tx.type}</td>
                          <td className="py-3">${tx.amount}</td>
                          <td className="py-3">
                            <span className={`badge ${tx.status === 'completed' ? 'bg-success' : 'bg-warning text-dark'}`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="py-3 text-muted">{new Date(tx.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center py-4 text-muted">No transactions found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* REFERRAL STATS */}
          <div className="row g-4 mt-4">
            <div className="col-lg-12 col-md-6">
              <ReferralStats userId={userData.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const StatCard = ({ label, value, color, icon }: any) => (
  <div className="card border-0 shadow-sm p-3 h-100">
    <div className="d-flex align-items-center gap-3">
      <div className={`bg-${color} bg-opacity-10 text-${color} p-3 rounded-circle d-flex`}>{icon}</div>
      <div>
        <h5 className="mb-0 fw-bold">{value}</h5>
        <p className="small text-muted mb-0">{label}</p>
      </div>
    </div>
  </div>
);

export default Dashboard;