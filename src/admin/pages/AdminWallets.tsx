import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Wallet, Globe, Loader2, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';

const AdminWallets: React.FC = () => {
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [newWallet, setNewWallet] = useState({ name: '', address: '', network: '' });

  // 1. Fetch Wallets from Backend
  const fetchWallets = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://mondayonsol.fun/crypto-backend/admin/get_wallets.php');
      const data = await res.json();
      if (data.success) {
        setWallets(data.data);
      }
    } catch (err) {
      console.error("Error fetching wallets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  // 2. Add New Wallet
  const handleAddWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch('https://mondayonsol.fun/crypto-backend/admin/add_wallet.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWallet)
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire({ title: 'Added!', text: 'Wallet address is now active.', icon: 'success', timer: 1500 });
        setNewWallet({ name: '', address: '', network: '' });
        fetchWallets();
      } else {
        Swal.fire('Error', data.message, 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'Server connection failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // 3. Delete Wallet
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Delete Wallet?',
      text: "Users will no longer see this address for deposits.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it'
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch('https://mondayonsol.fun/crypto-backend/admin/delete_wallet.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        const data = await res.json();
        if (data.success) {
          Swal.fire('Deleted!', 'Wallet has been removed.', 'success');
          fetchWallets();
        } else {
          Swal.fire('Error', data.message, 'error');
        }
      } catch (err) {
        Swal.fire('Error', 'Could not process request', 'error');
      }
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row g-4">
        {/* ADD WALLET FORM */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-2 mb-4">
                <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary">
                  <Plus size={20} />
                </div>
                <h5 className="fw-bold mb-0">Add New Wallet</h5>
              </div>

              <form onSubmit={handleAddWallet}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">CURRENCY NAME</label>
                  <input 
                    type="text" 
                    className="form-control py-2 rounded-3" 
                    placeholder="e.g. Bitcoin (BTC)"
                    value={newWallet.name}
                    onChange={e => setNewWallet({...newWallet, name: e.target.value})}
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">WALLET ADDRESS</label>
                  <input 
                    type="text" 
                    className="form-control py-2 rounded-3" 
                    placeholder="Enter long address"
                    value={newWallet.address}
                    onChange={e => setNewWallet({...newWallet, address: e.target.value})}
                    required 
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted">NETWORK</label>
                  <input 
                    type="text" 
                    className="form-control py-2 rounded-3" 
                    placeholder="e.g. TRC20, ERC20, BEP2"
                    value={newWallet.network}
                    onChange={e => setNewWallet({...newWallet, network: e.target.value})}
                    required 
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary w-100 py-2 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                  disabled={actionLoading}
                >
                  {actionLoading ? <Loader2 size={18} className="spinner-border spinner-border-sm border-0" /> : <Wallet size={18}/>}
                  {actionLoading ? 'Saving...' : 'Activate Wallet'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* WALLET LIST TABLE */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center gap-2">
                  <div className="bg-info bg-opacity-10 p-2 rounded-3 text-info">
                    <Globe size={20} />
                  </div>
                  <h5 className="fw-bold mb-0">Active Deposit Addresses</h5>
                </div>
                <span className="badge bg-light text-dark border px-3 py-2 rounded-pill">
                  Total: {wallets.length}
                </span>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary opacity-25" role="status"></div>
                  <p className="text-muted mt-2 small">Loading wallets...</p>
                </div>
              ) : wallets.length > 0 ? (
                <div className="table-responsive">
                  <table className="table align-middle">
                    <thead>
                      <tr className="text-muted small text-uppercase">
                        <th className="border-0 pb-3">Currency</th>
                        <th className="border-0 pb-3">Network</th>
                        <th className="border-0 pb-3">Address</th>
                        <th className="border-0 pb-3 text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {wallets.map((w: any) => (
                        <tr key={w.id}>
                          <td className="py-3 border-top-0">
                            <div className="fw-bold">{w.currency_name}</div>
                          </td>
                          <td className="py-3 border-top-0">
                            <span className="badge bg-light text-dark border fw-normal">{w.network}</span>
                          </td>
                          <td className="py-3 border-top-0">
                            <code className="bg-light p-1 rounded text-dark small">{w.wallet_address}</code>
                          </td>
                          <td className="py-3 border-top-0 text-end">
                            <button 
                              className="btn btn-outline-danger btn-sm border-0 rounded-circle p-2"
                              onClick={() => handleDelete(w.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <AlertCircle size={40} className="text-muted opacity-25 mb-3" />
                  <h6 className="text-muted">No wallets found</h6>
                  <p className="small text-muted mb-0">Add a wallet to start receiving deposits.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWallets;