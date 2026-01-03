import React, { useState, useEffect } from 'react';
import { Landmark, ArrowUpRight, ShieldCheck, AlertCircle, Info } from 'lucide-react';
import Swal from 'sweetalert2';

const WithdrawPage: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState('ERC20');
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetch(`http://localhost/crypto-backend/get_dashboard_data.php?user_id=${user.id}`)
      .then(res => res.json())
      .then(data => { if (data.success) setBalance(data.balance); });
  }, []);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (parseFloat(amount) > balance) {
      return Swal.fire('Error', 'Insufficient balance', 'error');
    }
    if (address.length < 10) {
      return Swal.fire('Error', 'Please enter a valid wallet address', 'warning');
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost/crypto-backend/withdraw.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          amount: amount,
          wallet_address: address,
          network: network
        })
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire('Requested', 'Your withdrawal is pending admin approval.', 'success');
        setAmount('');
        setAddress('');
      } else {
        Swal.fire('Failed', data.message, 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'Server error', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 container-fluid" style={{ maxWidth: '600px' }}>
      <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
        <div className="card-header bg-dark p-4 text-white border-0">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-primary p-2 rounded-3">
              <Landmark size={24} />
            </div>
            <div>
              <h4 className="fw-bold mb-0">Withdraw Funds</h4>
              <p className="small mb-0 opacity-75">Securely move assets to your external wallet</p>
            </div>
          </div>
        </div>
        
        <div className="card-body p-4">
          <div className="bg-light p-3 rounded-3 mb-4 d-flex justify-content-between align-items-center">
            <span className="text-muted small fw-bold">Available for Withdrawal</span>
            <span className="h5 fw-bold text-primary mb-0">${Number(balance).toLocaleString()}</span>
          </div>

          <form onSubmit={handleWithdraw}>
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">Amount to Withdraw ($)</label>
              <input 
                type="number" 
                className="form-control form-control-lg" 
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">Select Network</label>
              <select className="form-select" value={network} onChange={(e) => setNetwork(e.target.value)}>
                <option value="ERC20">Ethereum (ERC20)</option>
                <option value="TRC20">TRON (TRC20)</option>
                <option value="BEP20">Binance Smart Chain (BEP20)</option>
                <option value="BTC">Bitcoin Network</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="form-label small fw-bold text-muted">Destination Wallet Address</label>
              <textarea 
                className="form-control" 
                rows={2} 
                placeholder="Paste your long wallet address here..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
              <div className="form-text d-flex align-items-center gap-1 text-warning">
                <AlertCircle size={12} /> Double check your address; crypto transfers are irreversible.
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 py-3 fw-bold rounded-3 shadow-sm" disabled={loading}>
              {loading ? 'Processing...' : 'Request Withdrawal'} <ArrowUpRight size={18} className="ms-1" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WithdrawPage;