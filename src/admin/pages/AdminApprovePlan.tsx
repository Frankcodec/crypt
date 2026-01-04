import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

interface Investment {
  id: number;
  full_name: string;
  email: string;
  plan_name: string;
  amount_invested: number;
  method: string;
  network: string;
  status: string;
  created_at: string;
}

const AdminApprovePlan: React.FC = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvestments = async () => {
    try {
      const res = await fetch('https://mondayonsol.fun/crypto-backend/admin/get_all_investments.php');
      const data = await res.json();
      if (data.success) {
        setInvestments(data.investments);
      }
    } catch (err) {
      console.error("Failed to fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    const confirm = await MySwal.fire({
      title: `Confirm ${action}?`,
      text: `Change status to ${action === 'approve' ? 'Active' : 'Rejected'}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: action === 'approve' ? '#198754' : '#dc3545',
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`https://mondayonsol.fun/crypto-backend/admin/${action}_investment.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ investment_id: id })
        });
        const result = await res.json();
        if (result.success) {
          MySwal.fire('Success', result.message, 'success');
          fetchInvestments();
        }
      } catch (err) {
        MySwal.fire('Error', 'Action failed', 'error');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return <span className="badge bg-success-subtle text-success px-3">Active</span>;
      case 'pending': return <span className="badge bg-warning-subtle text-warning px-3">Pending</span>;
      case 'rejected': return <span className="badge bg-danger-subtle text-danger px-3">Rejected</span>;
      case 'completed': return <span className="badge bg-primary-subtle text-primary px-3">Completed</span>;
      default: return <span className="badge bg-secondary text-white px-3">{status}</span>;
    }
  };

  if (loading) return <div className="p-5 text-center"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container-fluid p-4">
      <div className="mb-4">
        <h2 className="fw-bold">All Platform Investments</h2>
        <p className="text-muted">Total Investments: {investments.length}</p>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="bg-light">
              <tr className="text-muted small text-uppercase">
                <th className="ps-4">Investor</th>
                <th>Plan Detail</th>
                <th>Amount</th>
                <th>Status</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {investments.map((item) => (
                <tr key={item.id}>
                  <td className="ps-4">
                    <div className="fw-bold">{item.full_name}</div>
                    <div className="small text-muted">{item.email}</div>
                  </td>
                  <td>
                    <div className="fw-bold">{item.plan_name}</div>
                    <div className="small text-muted">{item.method} ({item.network})</div>
                  </td>
                  <td className="fw-bold text-dark">${Number(item.amount_invested).toLocaleString()}</td>
                  <td>{getStatusBadge(item.status)}</td>
                  <td className="text-end pe-4">
                    {item.status === 'pending' ? (
                      <div className="d-flex justify-content-end gap-2">
                        <button onClick={() => handleAction(item.id, 'approve')} className="btn btn-sm btn-success rounded-3"><CheckCircle size={16}/></button>
                        <button onClick={() => handleAction(item.id, 'reject')} className="btn btn-sm btn-danger rounded-3"><XCircle size={16}/></button>
                      </div>
                    ) : (
                      <button className="btn btn-sm btn-light border" disabled><Eye size={16} /> Locked</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminApprovePlan;