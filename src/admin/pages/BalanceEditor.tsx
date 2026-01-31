import React, { useState, useEffect } from 'react';
import { DollarSign, Save, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';

const BalanceEditor = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('https://mondayonsol.fun/crypto-backend/admin/get_users_list.php')
      .then(res => res.json())
      .then(data => { if (data.success) setUsers(data.users); });
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `This will overwrite the user's current balance to $${newAmount}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it'
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      const res = await fetch('https://mondayonsol.fun/crypto-backend/admin/update_user_balance.php', {
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
        Swal.fire('Updated!', data.message, 'success');
        setNewAmount('');
      } else {
        Swal.fire('Failed', data.message, 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'Server connection error', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4">
      <div className="mb-4 d-flex align-items-center gap-2">
        <DollarSign className="text-success" />
        <h5 className="mb-0 fw-bold">Master Balance Editor</h5>
      </div>

      <div className="alert alert-info border-0 small">
        <AlertCircle size={16} className="me-2"/>
        Warning: This directly overwrites the <b>total_balance</b> in both the <code>users</code> and <code>balances</code> tables.
      </div>

      <form onSubmit={handleUpdate}>
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

        <div className="mb-4">
          <label className="form-label small fw-bold">New Absolute Balance ($)</label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">$</span>
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

        <button type="submit" disabled={loading} className="btn btn-dark w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2">
          {loading ? <span className="spinner-border spinner-border-sm"></span> : <><Save size={18}/> Overwrite Balance</>}
        </button>
      </form>
    </div>
  );
};

export default BalanceEditor;