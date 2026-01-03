import React, { useState, useEffect } from 'react';
import { 
  X, ArrowDownCircle, ArrowUpCircle, 
  RefreshCw, Copy, Search, CheckCircle2 
} from 'lucide-react';
import Swal from 'sweetalert2';

const AdminTransactions: React.FC = () => {
  const [deposits, setDeposits] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Fetch All Transactions
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost/crypto-backend/admin/get_all_transactions.php');
      const data = await res.json();
      
      if (data.success && Array.isArray(data.data)) {
        setDeposits(data.data.filter((t: any) => t.type === 'deposit'));
        setWithdrawals(data.data.filter((t: any) => t.type === 'withdrawal'));
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTransactions(); }, []);

  // 2. Handle Copy Address
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Address copied!',
      showConfirmButton: false,
      timer: 1500
    });
  };

  // 3. Handle Actions (Approve/Decline)
  const handleAction = async (id: number, type: 'deposit' | 'withdrawal', action: 'approve' | 'decline') => {
    const result = await Swal.fire({
      title: `${action.toUpperCase()} ${type.toUpperCase()}?`,
      text: `Confirming this will update the user's status and balance.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: action === 'approve' ? '#10b981' : '#ef4444',
      confirmButtonText: `Yes, ${action}`
    });

    if (result.isConfirmed) {
      try {
        const endpoint = `${action}_${type}.php`;
        const res = await fetch(`http://localhost/crypto-backend/admin/${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transaction_id: id })
        });
        const data = await res.json();
        if (data.success) {
          Swal.fire('Updated', data.message, 'success');
          fetchTransactions();
        } else {
          Swal.fire('Error', data.message, 'error');
        }
      } catch (err) {
        Swal.fire('Error', 'Server communication failed', 'error');
      }
    }
  };

  // Filter Logic
  const filterFn = (t: any) => t.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || t.amount.toString().includes(searchTerm);
  const filteredDeposits = deposits.filter(filterFn);
  const filteredWithdrawals = withdrawals.filter(filterFn);

  return (
    <div className="container-fluid py-4">
      {/* HEADER & SEARCH */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1">Financial Requests</h3>
          <p className="text-muted small mb-0">Manage incoming deposits and outgoing payouts.</p>
        </div>
        <div className="d-flex gap-2">
          <div className="input-group bg-white border rounded-pill px-3 shadow-sm" style={{ maxWidth: '300px' }}>
            <span className="input-group-text bg-transparent border-0"><Search size={18} className="text-muted"/></span>
            <input 
              type="text" 
              className="form-control border-0 shadow-none" 
              placeholder="Search user or amount..." 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={fetchTransactions} className="btn btn-dark rounded-circle p-2 shadow-sm">
            <RefreshCw size={20} className={loading ? 'spin' : ''} />
          </button>
        </div>
      </div>

      {/* DEPOSITS TABLE */}
      <div className="card border-0 shadow-sm rounded-4 mb-5">
        <div className="card-header bg-white border-0 py-4 px-4 d-flex align-items-center gap-2">
          <div className="bg-success-subtle p-2 rounded-3 text-success"><ArrowDownCircle size={22}/></div>
          <h5 className="fw-bold mb-0">Incoming Deposits</h5>
        </div>
        <div className="table-responsive px-4 pb-4">
          <table className="table align-middle">
            <thead className="small text-muted text-uppercase">
              <tr>
                <th className="border-0">User</th>
                <th className="border-0">Amount</th>
                <th className="border-0">Method</th>
                <th className="border-0">Status</th>
                <th className="border-0 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeposits.length > 0 ? filteredDeposits.map(t => (
                <tr key={t.id}>
                  <td>
                    <div className="fw-bold">{t.full_name}</div>
                    <div className="x-small text-muted">{new Date(t.created_at).toLocaleString()}</div>
                  </td>
                  <td className="fw-bold text-success">+${Number(t.amount).toLocaleString()}</td>
                  <td><span className="badge bg-light text-dark border fw-normal">{t.method}</span></td>
                  <td><StatusBadge status={t.status} /></td>
                  <td className="text-end">
                    {t.status === 'pending' && (
                      <div className="d-flex gap-2 justify-content-end">
                        <button onClick={() => handleAction(t.id, 'deposit', 'approve')} className="btn btn-success btn-sm rounded-pill px-3">Approve</button>
                        <button onClick={() => handleAction(t.id, 'deposit', 'decline')} className="btn btn-outline-danger btn-sm rounded-pill px-3">Decline</button>
                      </div>
                    )}
                  </td>
                </tr>
              )) : <tr><td colSpan={5} className="text-center py-5 text-muted">No pending deposits.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* WITHDRAWALS TABLE */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-header bg-white border-0 py-4 px-4 d-flex align-items-center gap-2">
          <div className="bg-danger-subtle p-2 rounded-3 text-danger"><ArrowUpCircle size={22}/></div>
          <h5 className="fw-bold mb-0">Withdrawal Requests</h5>
        </div>
        <div className="table-responsive px-4 pb-4">
          <table className="table align-middle">
            <thead className="small text-muted text-uppercase">
              <tr>
                <th className="border-0">User</th>
                <th className="border-0">Amount</th>
                <th className="border-0">Payout Destination</th>
                <th className="border-0">Status</th>
                <th className="border-0 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWithdrawals.length > 0 ? filteredWithdrawals.map(t => (
                <tr key={t.id}>
                  <td>
                    <div className="fw-bold">{t.full_name}</div>
                    <div className="x-small text-muted" >{new Date(t.created_at).toLocaleString()}</div>
                  </td>
                  <td className="fw-bold text-danger">-${Number(t.amount).toLocaleString()}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="bg-light px-2 py-1 rounded border small font-monospace text-dark">
                        {t.wallet_address ? `${t.wallet_address.substring(0, 6)}...${t.wallet_address.substring(t.wallet_address.length - 4)}` : 'N/A'}
                      </div>
                      <button 
                        className="btn btn-sm btn-link p-0 text-secondary" 
                        onClick={() => copyToClipboard(t.wallet_address)}
                      >
                        <Copy size={14}/>
                      </button>
                    </div>
                    <div className="x-small text-primary fw-bold mt-1">{t.network}</div>
                  </td>
                  <td><StatusBadge status={t.status} /></td>
                  <td className="text-end">
                    {t.status === 'pending' && (
                      <div className="d-flex gap-2 justify-content-end">
                        <button onClick={() => handleAction(t.id, 'withdrawal', 'approve')} className="btn btn-primary btn-sm rounded-pill px-3">Mark Paid</button>
                        <button onClick={() => handleAction(t.id, 'withdrawal', 'decline')} className="btn btn-outline-danger btn-sm rounded-pill px-3">Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              )) : <tr><td colSpan={5} className="text-center py-5 text-muted">No pending withdrawals.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const configs = {
    pending: { class: 'bg-warning-subtle text-warning-emphasis', icon: <Clock size={12}/> },
    approved: { class: 'bg-success text-white', icon: <CheckCircle2 size={12}/> },
    completed: { class: 'bg-success text-white', icon: <CheckCircle2 size={12}/> },
    declined: { class: 'bg-danger-subtle text-danger', icon: <X size={12}/> },
    rejected: { class: 'bg-danger-subtle text-danger', icon: <X size={12}/> }
  };
  const config = configs[status as keyof typeof configs] || { class: 'bg-secondary text-white', icon: null };
  return (
    <span className={`badge rounded-pill px-3 py-2 d-inline-flex align-items-center gap-1 ${config.class}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const Clock = ({ size }: { size: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

export default AdminTransactions;