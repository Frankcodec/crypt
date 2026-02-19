import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area 
} from 'recharts';
import { Users, Wallet, TrendingUp, Clock, ArrowUpRight, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://api.nutcoinonsol.com/crypto-backend/admin/get_dashboard_stats.php')
      .then(res => res.json())
      .then(res => {
        if (res.success) setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="d-flex justify-content-center p-5"><div className="spinner-border text-primary"></div></div>;
  if (!data) return <div className="p-5 text-center text-danger">Failed to load dashboard data.</div>;

  const statCards = [
    { label: 'Total Users', value: data.stats.total_users, icon: <Users />, color: 'text-primary', bg: 'bg-primary-subtle' },
    { label: 'Platform Balance', value: `$${Number(data.stats.total_balance).toLocaleString()}`, icon: <Wallet />, color: 'text-success', bg: 'bg-success-subtle' },
    { label: 'Active Stakes', value: `$${Number(data.stats.active_stakes).toLocaleString()}`, icon: <TrendingUp />, color: 'text-info', bg: 'bg-info-subtle' },
    { label: 'Pending Payouts', value: data.stats.pending_withdrawals, icon: <Clock />, color: 'text-warning', bg: 'bg-warning-subtle' },
  ];

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">System Overview</h2>
          <p className="text-muted small">Real-time platform analytics and financial health.</p>
        </div>
        <button className="btn btn-white shadow-sm border rounded-3 px-3 py-2 small" onClick={() => window.location.reload()}>
          <Activity size={16} className="me-2 text-primary" /> Refresh Data
        </button>
      </div>

      {/* Summary Cards */}
      <div className="row g-4 mb-4">
        {statCards.map((card, i) => (
          <div className="col-md-3" key={i}>
            <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
              <div className="d-flex align-items-center">
                <div className={`${card.bg} ${card.color} p-3 rounded-3 me-3`}>
                  {card.icon}
                </div>
                <div>
                  <div className="text-muted small fw-bold text-uppercase">{card.label}</div>
                  <h4 className="fw-bold mb-0">{card.value}</h4>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Main Bar Chart */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <h5 className="fw-bold mb-4">Inflow vs Outflow (Last 7 Days)</h5>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <BarChart data={data.chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#999', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#f8f9fa'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                  />
                  <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                  <Bar dataKey="deposits" fill="#0d6efd" radius={[6, 6, 0, 0]} name="Completed Deposits" barSize={35} />
                  <Bar dataKey="withdrawals" fill="#ff4d4d" radius={[6, 6, 0, 0]} name="Completed Withdrawals" barSize={35} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Area Chart & Quick Actions */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <h5 className="fw-bold mb-1">Growth Trend</h5>
            <p className="text-muted small mb-4">Visualizing deposit volume</p>
            <div style={{ width: '100%', height: 180 }}>
              <ResponsiveContainer>
                <AreaChart data={data.chartData}>
                  <defs>
                    <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d6efd" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0d6efd" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip />
                  <Area type="monotone" dataKey="deposits" stroke="#0d6efd" strokeWidth={3} fillOpacity={1} fill="url(#colorIn)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 p-4 bg-dark text-white h-auto">
            <h6 className="fw-bold mb-3">Quick Navigation</h6>
            <div className="d-grid gap-2">
              <button onClick={() => navigate('/admin/users')} className="btn btn-outline-light text-start d-flex justify-content-between align-items-center py-2">
                User Management <ArrowUpRight size={16} />
              </button>
              <button onClick={() => navigate('/admin/plans')} className="btn btn-outline-light text-start d-flex justify-content-between align-items-center py-2">
                Investment Plans <ArrowUpRight size={16} />
              </button>
              <button onClick={() => navigate('/admin/transactions')} className="btn btn-outline-light text-start d-flex justify-content-between align-items-center py-2">
                Transaction Logs <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;