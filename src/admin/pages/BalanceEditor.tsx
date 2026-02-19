import React, { useState, useEffect } from 'react';
import { DollarSign, RefreshCcw } from 'lucide-react';
import Swal from 'sweetalert2';

const BalanceEditor = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [currentBalance, setCurrentBalance] = useState<number | null>(null);
  const [newAmount, setNewAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // Load user list
  useEffect(() => {
    fetch('https://api.nutcoinonsol.com/crypto-backend/admin/get_users_list.php')
      .then(res => res.json())
      .then(data => { if (data.success) setUsers(data.users); });
  }, []);

  // Fetch specific user balance when selected
  useEffect(() => {
    if (!selectedUser) {
      setCurrentBalance(null);
      return;
    }
    
    setFetching(true);
    fetch(`https://api.nutcoinonsol.com/crypto-backend/admin/get_user_balance.php?user_id=${selectedUser}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setCurrentBalance(data.balance);
        setFetching(false);
      });
  }, [selectedUser]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await Swal.fire({
      title: 'Confirm Overwrite',
      text: `Change balance from $${currentBalance} to $${newAmount}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, Update Balance'
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      const res = await fetch('https://api.nutcoinonsol.com/crypto-backend/admin/update_user_balance.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: selectedUser,
          new_balance: parseFloat(newAmount),
          reason: "Manual Admin Overwrite"
        })
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire('Success', 'Balance updated!', 'success');
        setCurrentBalance(parseFloat(newAmount)); // Update UI display
        setNewAmount('');
      }
    } catch (err) {
      Swal.fire('Error', 'Update failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4">
      <div className="mb-4">
        <h5 className="fw-bold d-flex align-items-center gap-2">
          <DollarSign className="text-success" /> Master Balance Editor
        </h5>
      </div>

      <form onSubmit={handleUpdate}>
        {/* USER SELECTION */}
        <div className="mb-3">
          <label className="form-label small fw-bold">Select User</label>
          <select 
            className="form-select bg-light" 
            value={selectedUser} 
            onChange={(e) => setSelectedUser(e.target.value)}
            required
          >
            <option value="">-- Choose User --</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>
            ))}
          </select>
        </div>

        {/* CURRENT BALANCE DISPLAY */}
        {selectedUser && (
          <div className="p-3 rounded-3 bg-light border mb-4 d-flex justify-content-between align-items-center">
            <div>
              <div className="text-muted small fw-bold uppercase">Current Balance</div>
              {fetching ? (
                <div className="spinner-border spinner-border-sm text-primary"></div>
              ) : (
                <h3 className="mb-0 fw-bold text-dark">${currentBalance?.toLocaleString()}</h3>
              )}
            </div>
            <RefreshCcw 
              size={18} 
              className={`text-muted cursor-pointer ${fetching ? 'animate-spin' : ''}`} 
              onClick={() => setSelectedUser(selectedUser)} 
            />
          </div>
        )}

        {/* NEW BALANCE INPUT */}
        <div className="mb-4">
          <label className="form-label small fw-bold">New Absolute Balance ($)</label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0 text-muted">$</span>
            <input 
              type="number" 
              step="0.01"
              className="form-control bg-light border-start-0" 
              placeholder="0.00"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              required 
            />
          </div>
        </div>

        <button type="submit" disabled={loading || fetching} className="btn btn-dark w-100 py-3 fw-bold rounded-3">
          {loading ? 'Processing...' : 'Overwrite Balance'}
        </button>
      </form>
    </div>
  );
};

export default BalanceEditor;