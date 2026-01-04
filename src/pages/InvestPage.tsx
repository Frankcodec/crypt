import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ShieldCheck, Calendar, Check, Copy } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// --- HELPER: Duration Logic ---
const formatDuration = (h: any) => {
  const hours = Number(h);
  if (isNaN(hours)) return '0 Hours';
  if (hours >= 24) {
    const days = hours / 24;
    return `${days % 1 === 0 ? days : days.toFixed(1)} ${days === 1 ? 'Day' : 'Days'}`;
  }
  return `${hours} ${hours === 1 ? 'Hour' : 'Hours'}`;
};

// --- MODAL 1: AMOUNT SELECTION ---
const AmountModal = ({ show, onClose, plan, userBalance, onConfirm }: any) => {
  const [amount, setAmount] = useState<number>(0);

  useEffect(() => {
    if (plan) setAmount(Number(plan.min_deposit));
  }, [plan, show]);

  if (!show || !plan) return null;
  const isInsufficient = userBalance < amount;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 p-3">
          <div className="modal-header border-0 pb-0">
            <h5 className="fw-bold">Configure Investment</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body text-center">
            <p className="text-muted small">Plan: <span className="fw-bold text-primary">{plan.name}</span></p>
            <div className="mb-4">
              <h2 className="fw-bold text-dark">${Number(amount).toLocaleString()}</h2>
              <input type="range" className="form-range" min={plan.min_deposit} max={plan.max_deposit} step={10} value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
              <div className="d-flex justify-content-between x-small fw-bold text-muted">
                <span>Min: ${plan.min_deposit}</span><span>Max: ${plan.max_deposit}</span>
              </div>
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text bg-white">$</span>
              <input type="number" className="form-control fw-bold" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
            </div>
            <div className={`p-3 rounded-3 mb-3 ${isInsufficient ? 'bg-warning-subtle' : 'bg-success-subtle'}`}>
              <div className="d-flex justify-content-between align-items-center small">
                <span className="fw-bold">Your Balance: ${Number(userBalance).toLocaleString()}</span>
                <span className={`badge ${isInsufficient ? 'bg-warning text-dark' : 'bg-success'}`}>
                  {isInsufficient ? 'External Transfer' : 'Instant Activation'}
                </span>
              </div>
            </div>
            <button className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm" onClick={() => onConfirm(amount, isInsufficient ? 'Crypto' : 'Balance')}>
              Proceed to {isInsufficient ? 'Payment' : 'Staking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MODAL 2: CRYPTO PAYMENT ---
const PaymentModal = ({ show, onClose, amount, plan, refreshData }: any) => {
  const [wallets, setWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleConfirm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    console.log('=== handleConfirm CALLED ===');
    console.log('User:', user);
    console.log('Plan:', plan);
    console.log('SelectedWallet:', selectedWallet);
    console.log('Amount:', amount);
    
    if (!user || !user.id) {
      MySwal.fire({ icon: 'error', title: 'Error', text: 'User not logged in' });
      return;
    }

    if (!plan || !selectedWallet) {
      MySwal.fire({ icon: 'error', title: 'Error', text: 'Missing plan or wallet data' });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        user_id: user.id,
        amount: amount,
        plan_name: plan.name,
        roi: plan.roi_percentage,
        hours: plan.duration_hours,
        method: selectedWallet.currency_name || 'Crypto',
        network: selectedWallet.network || 'N/A'
      };

      console.log('Sending payload:', payload);

      const res = await fetch('https://mondayonsol.fun/crypto-backend/crypto-backend/purchase_plan.php', {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      console.log('Response:', result);

      if (result.success) {
        MySwal.fire({ 
          icon: 'success', 
          title: 'Success', 
          text: result.message || 'Investment processed successfully!' 
        });
        onClose();
        refreshData();
      } else {
        MySwal.fire({ 
          icon: 'error', 
          title: 'Error', 
          text: result.message 
        });
      }
    } catch (err) {
      console.error('Fetch error:', err);
      MySwal.fire({ 
        icon: 'error', 
        title: 'Error', 
        text: 'Server communication failed.' 
      });
    } finally {
      setIsSubmitting(false);
    }
};

  if (!show) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1070 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg p-3 rounded-4">
          <div className="modal-header border-0 pb-0">
            <h5 className="fw-bold">Crypto Transfer</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body text-center">
            <p className="small text-muted mb-4">Transfer <b>${amount}</b> to activate <b>{plan.name}</b></p>
            <select className="form-select mb-3" onChange={(e) => setSelectedWallet(wallets.find((w: any) => w.id == e.target.value))}>
              {wallets.map((w: any) => <option key={w.id} value={w.id}>{w.currency_name} ({w.network})</option>)}
            </select>
            {selectedWallet && (
              <div className="mb-3">
                <div className="bg-white p-2 d-inline-block rounded border mb-3">
                  <QRCodeSVG value={selectedWallet.wallet_address} size={140} />
                </div>
                <div className="input-group">
                  <input type="text" className="form-control bg-light small" value={selectedWallet.wallet_address} readOnly />
                  <button className="btn btn-primary" onClick={() => {
                    navigator.clipboard.writeText(selectedWallet.wallet_address);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}>{copied ? <Check size={18}/> : <Copy size={18}/>}</button>
                </div>
                <small className="text-danger fw-bold mt-2 d-block text-uppercase">Network: {selectedWallet.network}</small>
              </div>
            )}
          </div>
          <button className="btn btn-dark w-100 py-2 fw-bold rounded-pill mb-2" onClick={handleConfirm} disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "I Have Sent Payment"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
const InvestPage: React.FC = () => {
  const [plans, setPlans] = useState([]);
  const [myInvestments, setMyInvestments] = useState([]);
  const [userBalance, setUserBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showAmountModal, setShowAmountModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [finalAmount, setFinalAmount] = useState(0);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchData = async () => {
    try {
      const [pRes, mRes, bRes] = await Promise.all([
        fetch('https://mondayonsol.fun/crypto-backend/crypto-backend/get_plans.php'),
        fetch(`https://mondayonsol.fun/crypto-backend/crypto-backend/get_my_investments.php?user_id=${user.id}`),
        fetch(`https://mondayonsol.fun/crypto-backend/crypto-backend/get_dashboard_data.php?user_id=${user.id}`)
      ]);
      const p = await pRes.json();
      const m = await mRes.json();
      const b = await bRes.json();
      if (p.success) setPlans(p.plans);
      if (m.success) setMyInvestments(m.data);
      if (b.success) setUserBalance(b.balance);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const onAmountConfirmed = async (amount: number, method: 'Balance' | 'Crypto') => {
    setShowAmountModal(false);
    setFinalAmount(amount);

    if (method === 'Balance') {
      const confirm = await MySwal.fire({
        title: 'Confirm Investment',
        text: `Stake $${amount} from your balance?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Stake it'
      });

      if (confirm.isConfirmed) {
        try {
          const payload = { 
            user_id: user.id, 
            amount: amount, 
            plan_name: selectedPlan.name, 
            roi: selectedPlan.roi_percentage, 
            hours: selectedPlan.duration_hours,
            method: 'Balance',
            network: 'Internal'
          };

          const res = await fetch('https://mondayonsol.fun/crypto-backend/crypto-backend/purchase_plan.php', {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          
          const result = await res.json();
          MySwal.fire(result.success ? 'Success' : 'Error', result.message, result.success ? 'success' : 'error');
          fetchData();
        } catch (e) {
          MySwal.fire('Error', 'Connection failed', 'error');
        }
      }
    } else {
      setShowPayModal(true);
    }
  };

  if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="p-4 container-fluid" style={{ maxWidth: '1200px' }}>
      <div className="d-flex justify-content-between align-items-end mb-5">
        <h2 className="fw-bold text-dark">Investment Hub</h2>
        <div className="bg-white p-3 rounded-4 shadow-sm border px-4 text-end">
          <p className="small text-muted mb-0 fw-bold">Wallet Balance</p>
          <h4 className="fw-bold text-primary mb-0">${Number(userBalance).toLocaleString()}</h4>
        </div>
      </div>

      <div className="row g-4 mb-5">
        {plans.map((plan: any) => (
          <div className="col-lg-4" key={plan.id}>
            <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden border-top border-primary border-4">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between mb-2">
                  <h6 className="fw-bold text-muted mb-0 small text-uppercase">{plan.name}</h6>
                  <Zap size={18} className="text-warning fill-warning" />
                </div>
                <h3 className="fw-bold mb-4">${Number(plan.min_deposit).toLocaleString()} - ${Number(plan.max_deposit).toLocaleString()}</h3>
                <div className="bg-light p-3 rounded-3 mb-4">
                  <div className="d-flex justify-content-between small mb-2"><span className="text-muted">Yield</span><span className="text-success fw-bold">+{plan.roi_percentage}% ROI</span></div>
                  <div className="d-flex justify-content-between small"><span className="text-muted">Term</span><span className="fw-bold text-primary">{formatDuration(plan.duration_hours)}</span></div>
                </div>
                <button onClick={() => { setSelectedPlan(plan); setShowAmountModal(true); }} className="btn btn-primary w-100 fw-bold py-2 rounded-3">Activate Plan</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex align-items-center gap-2 mb-3"><ShieldCheck className="text-success" /><h5 className="fw-bold mb-0">Active Portfolio</h5></div>
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-5">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr className="small text-muted text-uppercase">
                <th className="ps-4">Plan</th><th>Capital</th><th>Maturity</th><th>Status</th><th className="text-end pe-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {myInvestments.map((inv: any) => (
                <tr key={inv.id}>
                  <td className="ps-4 fw-bold text-dark">{inv.plan_name}</td>
                  <td className="fw-bold">${Number(inv.amount_invested).toLocaleString()}</td>
                  <td className="small text-muted"><Calendar size={14} className="me-1"/>{new Date(inv.end_date).toLocaleDateString()}</td>
                  <td><span className={`badge rounded-pill px-3 ${inv.status === 'active' ? 'bg-info bg-opacity-10 text-info' : 'bg-warning bg-opacity-10 text-warning'}`}>{inv.status}</span></td>
                  <td className="text-end pe-4"><Link to={`/dashboard/investment/${inv.id}`} className="btn btn-outline-primary btn-sm rounded-pill px-4">Audit</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AmountModal show={showAmountModal} onClose={() => setShowAmountModal(false)} plan={selectedPlan} userBalance={userBalance} onConfirm={onAmountConfirmed} />
      <PaymentModal show={showPayModal} onClose={() => setShowPayModal(false)} amount={finalAmount} plan={selectedPlan} refreshData={fetchData} />
    </div>
  );
};

export default InvestPage;