import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, Info } from 'lucide-react';

interface Props {
  show: boolean;
  onClose: () => void;
  amount: number;
}

const PaymentModal: React.FC<Props> = ({ show, onClose, amount }) => {
  const [wallets, setWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Fetch wallets from your new backend script
    fetch('https://mondayonsol.fun/crypto-backend/get_admin_wallets.php')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setWallets(data.wallets);
          setSelectedWallet(data.wallets[0]);
        }
      });
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedWallet.wallet_address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!show) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg p-3">
          <div className="modal-header border-0">
            <h5 className="fw-bold">Pay with Crypto</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          
          <div className="modal-body text-center">
            <p className="text-muted small">Send exactly <b>${amount}</b> worth of crypto to the address below.</p>
            
            {/* 1. CURRENCY DROPDOWN */}
            <div className="mb-4 text-start">
              <label className="small fw-bold text-muted">Select Coin</label>
              <select 
                className="form-select" 
                onChange={(e) => setSelectedWallet(wallets.find((w: any) => w.id == e.target.value))}
              >
                {wallets.map((w: any) => (
                  <option key={w.id} value={w.id}>{w.currency_name} ({w.network})</option>
                ))}
              </select>
            </div>

            {/* 2. QR CODE */}
            {selectedWallet && (
              <div className="bg-light p-3 rounded d-inline-block mb-4">
                <QRCodeSVG value={selectedWallet.wallet_address} size={180} />
              </div>
            )}

            {/* 3. READ-ONLY INPUT + COPY BUTTON */}
            <div className="input-group mb-3">
              <input 
                type="text" 
                className="form-control bg-light border-0 py-2 small" 
                value={selectedWallet?.wallet_address || ''} 
                readOnly 
              />
              <button className="btn btn-primary px-3" onClick={handleCopy}>
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>

            <div className="alert alert-info py-2 small d-flex align-items-center gap-2 text-start">
              <Info size={16} />
              Wait for network confirmation after sending.
            </div>
          </div>

          <div className="modal-footer border-0">
            <button className="btn btn-secondary w-100" onClick={onClose}>I've Sent the Payment</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;