import React, { useState, useEffect } from 'react';
import { Wallet, ArrowDownCircle} from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { QRCodeSVG } from 'qrcode.react';

const MySwal = withReactContent(Swal);

// --- REUSABLE DEPOSIT MODAL ---
const DepositModal = ({ show, onClose, amount, refreshData }: any) => {
  const [wallets, setWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (show) {
      fetch('https://mondayonsol.fun/crypto-backend/crypto-backend/get_admin_wallets.php')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setWallets(data.wallets);
            setSelectedWallet(data.wallets[0]);
          }
        });
    }
  }, [show]);

  const handleConfirm = async () => {
    MySwal.fire({ title: 'Logging Deposit...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    
    try {
      const res = await fetch('https://mondayonsol.fun/crypto-backend/crypto-backend/log_deposit.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          amount: amount,
          method:  selectedWallet?.currency_name || 'Crypto',
          network: selectedWallet?.network || ''
        })
      });
      const result = await res.json();
      MySwal.close();

      if (result.success) {
        MySwal.fire({ icon: 'success', title: 'Request Sent', text: 'Admin will verify your transfer shortly.' });
        onClose();
        refreshData();
      }
    } catch (e) {
      MySwal.fire({ icon: 'error', title: 'Error', text: 'Server connection failed.' });
    }
  };

  if (!show) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header border-0">
            <h5 className="fw-bold">Crypto Deposit</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body text-center p-4">
            <h6>Send exactly <span className="text-primary fw-bold">${amount}</span></h6>
            
            <select className="form-select my-3" onChange={(e) => setSelectedWallet(wallets.find((w: any) => w.id == e.target.value))}>
              {wallets.map((w: any) => <option key={w.id} value={w.id}>{w.currency_name} ({w.network})</option>)}
            </select>

            {selectedWallet && (
              <>
                <div className="bg-white p-2 d-inline-block rounded border mb-3">
                  <QRCodeSVG value={selectedWallet.wallet_address} size={150} />
                </div>
                <div className="input-group mb-3">
                  <input type="text" className="form-control bg-light small" value={selectedWallet.wallet_address} readOnly />
                  <button className="btn btn-outline-primary" onClick={() => {
                    navigator.clipboard.writeText(selectedWallet.wallet_address);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}>{copied ? 'Copied!' : 'Copy'}</button>
                </div>
              </>
            )}
          </div>
          <div className="modal-footer border-0">
            <button className="btn btn-primary w-100 py-2 fw-bold" onClick={handleConfirm}>I Have Sent Payment</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN DEPOSIT PAGE ---
const DepositPage: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [recentDeposits, setRecentDeposits] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchHistory = async () => {
    const res = await fetch(`https://mondayonsol.fun/crypto-backend/crypto-backend/get_transactions.php?user_id=${user.id}&type=deposit`);
    const data = await res.json();
    if (data.success) setRecentDeposits(data.data);
  };

  useEffect(() => { fetchHistory(); }, []);

  const initiateDeposit = () => {
    if (!amount || parseFloat(amount) <= 0) {
      MySwal.fire({ icon: 'warning', title: 'Invalid Amount', text: 'Please enter a deposit amount.' });
      return;
    }
    setShowModal(true);
  };

  return (
    <div className="p-4 container-fluid" style={{ maxWidth: '800px' }}>
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4 text-center">
          <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
            <Wallet className="text-primary" size={32} />
          </div>
          <h3 className="fw-bold">Fund Your Account</h3>
          <p className="text-muted">Enter the amount you wish to deposit into your secure wallet.</p>
          
          <div className="mt-4" style={{ maxWidth: '400px', margin: '0 auto' }}>
            <div className="input-group input-group-lg mb-3">
              <span className="input-group-text bg-white border-end-0">$</span>
              <input 
                type="number" 
                className="form-control border-start-0 ps-0" 
                placeholder="0.00" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
              />
            </div>
            <button className="btn btn-primary btn-lg w-100 fw-bold" onClick={initiateDeposit}>
              Continue to Deposit
            </button>
          </div>
        </div>
      </div>

      <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
        <ArrowDownCircle className="text-muted" size={20} /> Deposit History
      </h5>
      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light small text-uppercase">
              <tr>
                <th className="ps-4">Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentDeposits.map((d: any) => (
                <tr key={d.id}>
                  <td className="ps-4 small text-muted">{new Date(d.created_at).toLocaleDateString()}</td>
                  <td className="fw-bold">${d.amount}</td>
                  <td>
                    <span className={`badge rounded-pill ${d.status === 'completed' ? 'bg-success' : 'bg-warning text-dark'}`}>
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DepositModal 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        amount={amount} 
        refreshData={fetchHistory} 
      />
    </div>
  );
};

export default DepositPage;