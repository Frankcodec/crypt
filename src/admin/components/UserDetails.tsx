import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Wallet, 
  Users, 
  TrendingUp, 
  History, 
  User as UserIcon,
  Mail,
  Calendar,
  PlusCircle
} from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const UserDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'plans' | 'history'>('plans');

  const fetchFullDetails = async () => {
    try {
      const res = await fetch(`https://api.nutcoinonsol.com/crypto-backend/admin/get_user_full_details.php?id=${id}`);
      const result = await res.json();
      
      if (result.success) {
        setUserData(result.data.user);
        setTransactions(result.data.transactions);
        setPlans(result.data.plans);
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFullDetails();
  }, [id]);

  const handleManualDeposit = () => {
    MySwal.fire({
      title: 'Manual Deposit',
      html: `
        <div class="text-start">
          <label class="form-label small text-muted fw-bold">Amount ($)</label>
          <input type="number" id="swal-amount" class="form-control mb-3" placeholder="0.00">
          <label class="form-label small text-muted fw-bold">Description</label>
          <input type="text" id="swal-desc" class="form-control" placeholder="e.g. Bonus Credit, Offline BTC Deposit">
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Confirm Deposit',
      confirmButtonColor: '#198754',
      preConfirm: () => {
        const amount = (document.getElementById('swal-amount') as HTMLInputElement).value;
        const description = (document.getElementById('swal-desc') as HTMLInputElement).value;
        if (!amount || parseFloat(amount) <= 0) {
          Swal.showValidationMessage('Please enter a valid amount');
        }
        return { amount, description };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch('https://api.nutcoinonsol.com/crypto-backend/admin/manual_deposit.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: id,
              amount: result.value.amount,
              description: result.value.description
            })
          });
          const data = await res.json();
          if (data.success) {
            MySwal.fire('Success', 'Balance updated and transaction recorded', 'success');
            fetchFullDetails(); // Refresh UI
          } else {
            MySwal.fire('Error', data.message, 'error');
          }
        } catch (err) {
          MySwal.fire('Error', 'Server connection failed', 'error');
        }
      }
    });
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );

  if (!userData) return (
    <div className="container p-5 text-center">
      <h3 className="text-muted">User not found</h3>
      <button className="btn btn-primary mt-3" onClick={() => navigate('/admin/users')}>Back to Users</button>
    </div>
  );

  return (
    <div className="container-fluid p-4">
      {/* Top Navigation */}
      <button 
        onClick={() => navigate(-1)} 
        className="btn btn-link text-decoration-none text-dark d-flex align-items-center mb-4 ps-0"
      >
        <ArrowLeft size={20} className="me-2" /> Back to User Management
      </button>

      <div className="row g-4">
        {/* Left Column: Profile Card */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
            <div className="bg-primary p-4 text-center">
              <div className="bg-white rounded-circle d-inline-flex p-3 mb-3 shadow-sm">
                <UserIcon size={48} className="text-primary" />
              </div>
              <h4 className="text-white fw-bold mb-1">{userData.full_name}</h4>
              <span className="badge bg-white text-primary rounded-pill px-3 text-uppercase small fw-bold">
                {userData.role}
              </span>
            </div>
            
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-3">
                <Mail size={18} className="text-muted me-3" />
                <div>
                  <div className="small text-muted">Email Address</div>
                  <div className="fw-semibold text-break">{userData.email}</div>
                </div>
              </div>

              <div className="d-flex align-items-center mb-3">
                <Calendar size={18} className="text-muted me-3" />
                <div>
                  <div className="small text-muted">Join Date</div>
                  <div className="fw-semibold">
                    {new Date(userData.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
                  </div>
                </div>
              </div>

              <hr className="my-4 opacity-50" />

              <div className="row g-3 mb-4">
                <div className="col-6">
                  <div className="p-3 bg-light rounded-3 text-center">
                    <Wallet size={20} className="text-success mb-2" />
                    <div className="small text-muted">Balance</div>
                    <div className="fw-bold">${parseFloat(userData.total_balance).toLocaleString()}</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 bg-light rounded-3 text-center">
                    <Users size={20} className="text-info mb-2" />
                    <div className="small text-muted">Referrals</div>
                    <div className="fw-bold">{userData.referral_count}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <button 
                onClick={handleManualDeposit}
                className="btn btn-success w-100 rounded-3 py-2 d-flex align-items-center justify-content-center gap-2 mb-2 shadow-sm"
              >
                <PlusCircle size={18} /> Manual Deposit
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Tables */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="card-header bg-white border-0 p-3">
              <ul className="nav nav-pills nav-fill bg-light p-1 rounded-3">
                <li className="nav-item">
                  <button 
                    className={`nav-link rounded-3 border-0 d-flex align-items-center justify-content-center gap-2 ${activeTab === 'plans' ? 'active shadow-sm' : 'text-muted'}`}
                    onClick={() => setActiveTab('plans')}
                  >
                    <TrendingUp size={18} /> Investments ({plans.length})
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link rounded-3 border-0 d-flex align-items-center justify-content-center gap-2 ${activeTab === 'history' ? 'active shadow-sm' : 'text-muted'}`}
                    onClick={() => setActiveTab('history')}
                  >
                    <History size={18} /> Transactions ({transactions.length})
                  </button>
                </li>
              </ul>
            </div>

            <div className="card-body p-0">
              {activeTab === 'plans' ? (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                      <tr className="small text-muted text-uppercase">
                        <th className="ps-4 py-3">Plan Name</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {plans.length > 0 ? plans.map((p) => (
                        <tr key={p.id}>
                          <td className="ps-4">
                            <div className="fw-bold">{p.plan_name}</div>
                            <div className="small text-muted">ID: #{p.id}</div>
                          </td>
                          <td className="fw-semibold">${parseFloat(p.amount_invested).toLocaleString()}</td>
                          <td>
                            <span className={`badge rounded-pill ${p.status === 'active' ? 'bg-success' : p.status === 'pending' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="small text-muted">
                            {new Date(p.start_date || p.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan={4} className="text-center py-5 text-muted">No investments found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                      <tr className="small text-muted text-uppercase">
                        <th className="ps-4 py-3">Description</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.length > 0 ? transactions.map((t) => (
                        <tr key={t.id}>
                          <td className="ps-4">
                            <div className="fw-semibold small mb-1">{t.description}</div>
                            <span className="badge bg-light text-dark border small text-uppercase" style={{fontSize: '9px'}}>{t.type}</span>
                          </td>
                          <td className={`fw-bold ${['deposit', 'payout', 'bonus'].includes(t.type) ? 'text-success' : 'text-danger'}`}>
                            {['deposit', 'payout', 'bonus'].includes(t.type) ? '+' : '-'}${parseFloat(t.amount).toLocaleString()}
                          </td>
                          <td>
                            <span className={`badge bg-opacity-10 text-${t.status === 'completed' ? 'success' : 'warning'} bg-${t.status === 'completed' ? 'success' : 'warning'}`}>
                              {t.status}
                            </span>
                          </td>
                          <td className="small text-muted">
                            {new Date(t.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan={4} className="text-center py-5 text-muted">No transactions found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;