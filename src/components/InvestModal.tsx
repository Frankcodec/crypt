import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, Info } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

interface PaymentModalProps {
  show: boolean;
  onClose: () => void;
  amount: number;
  plan: any;
  refreshData: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ show, onClose, amount, plan, refreshData }) => {
  const [wallets, setWallets] = useState<any[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (show) {
      fetch('https://api.nutcoinonsol.com/crypto-backend/get_admin_wallets.php')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.wallets.length > 0) {
            setWallets(data.wallets);
            setSelectedWallet(data.wallets[0]);
          }
        })
        .catch(err => console.error("Error fetching wallets:", err));
    }
  }, [show]);

  const handleConfirmPurchase = async (e: React.MouseEvent) => {
    // 1. Force prevent any default browser behavior
    e.preventDefault();
    
    if (!selectedWallet) {
      return MySwal.fire('Error', 'Please select a payment wallet', 'error');
    }

    setIsSubmitting(true);

    try {
      const payload = {
        user_id: user.id,
        amount: amount,
        plan_name: plan?.name,
        roi: plan?.roi_percentage,
        hours: plan?.duration_hours,
        // Using selectedWallet name or fallback to 'Crypto'
        method: selectedWallet?.currency_name || 'Crypto', 
        network: selectedWallet?.network || 'N/A'
      };

      console.log("Sending Crypto Purchase Payload:", payload);

      const res = await fetch('https://api.nutcoinonsol.com/crypto-backend/purchase_plan.php', {
        method: 'POST', // CRITICAL: Must be POST
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (result.success) {
        await MySwal.fire({
          icon: 'success',
          title: 'Payment Submitted',
          text: result.message,
          confirmButtonColor: '#28a745'
        });
        onClose();
        refreshData();
      } else {
        MySwal.fire('Error', result.message, 'error');
      }
    } catch (err) {
      console.error("Fetch error:", err);
      MySwal.fire('Error', 'Connection to server failed. Ensure XAMPP is running.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    if (selectedWallet) {
      navigator.clipboard.writeText(selectedWallet.wallet_address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!show) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header bg-light border-0 p-4">
            <h5 className="modal-title fw-bold">Confirm Crypto Payment</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          
          <div className="modal-body p-4 text-center">
            <div className="alert alert-info small d-flex align-items-center border-0">
              <Info size={18} className="me-2" />
              <span>Send exactly <b>${amount}</b> to the address below.</span>
            </div>

            <label className="d-block text-start small fw-bold text-muted mb-2">Select Currency/Network</label>
            <select 
              className="form-select mb-4 py-2 border-2"
              onChange={(e) => setSelectedWallet(wallets.find(w => w.id === parseInt(e.target.value)))}
            >
              {wallets.map((w: any) => (
                <option key={w.id} value={w.id}>{w.currency_name} ({w.network})</option>
              ))}
            </select>

            {selectedWallet && (
              <div className="animate__animated animate__fadeIn">
                <div className="bg-white p-3 d-inline-block rounded-4 border mb-3 shadow-sm">
                  <QRCodeSVG value={selectedWallet.wallet_address} size={160} />
                </div>
                
                <div className="input-group mb-2">
                  <input 
                    type="text" 
                    className="form-control bg-light border-0 py-2 font-monospace small" 
                    value={selectedWallet.wallet_address} 
                    readOnly 
                  />
                  <button className="btn btn-primary px-3" onClick={copyToClipboard}>
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
                <p className="text-uppercase small fw-bold text-danger mb-4">Network: {selectedWallet.network}</p>
              </div>
            )}
          </div>

          <div className="modal-footer border-0 p-4 pt-0">
            <button 
              type="button" 
              className="btn btn-dark w-100 py-3 fw-bold rounded-pill shadow"
              onClick={handleConfirmPurchase}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="spinner-border spinner-border-sm me-2"></span>
              ) : "I Have Sent Payment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;