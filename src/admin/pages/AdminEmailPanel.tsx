import React, { useState, useEffect } from 'react';
import { Mail, Send, Type, User, PlusCircle } from 'lucide-react';
import Swal from 'sweetalert2';

const AdminEmailPanel = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState('dropdown'); // 'dropdown' or 'manual'
  
  const [emailData, setEmailData] = useState({
    email: '',
    subject: '',
    message: ''
  });

  // Fetch users on load
  useEffect(() => {
    fetch('https://mondayonsol.fun/crypto-backend/admin/get_users_list.php')
      .then(res => res.json())
      .then(data => {
        if (data.success) setUsers(data.users);
      });
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailData.email || !emailData.message) return;

    setLoading(true);
    try {
      const res = await fetch('https://mondayonsol.fun/crypto-backend/admin/admin_send_email.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData)
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire('Success', 'Email sent to ' + emailData.email, 'success');
        setEmailData({ ...emailData, message: '' }); // Clear message only
      } else {
        Swal.fire('Error', data.message, 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'Connection failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4" style={{ maxWidth: '700px' }}>
      <div className="mb-4">
        <h5 className="fw-bold d-flex align-items-center gap-2">
          <Mail className="text-primary" /> Communications Center
        </h5>
        <p className="text-muted small">Send personalized emails to platform members via Brevo.</p>
      </div>

      <form onSubmit={handleSend}>
        {/* RECIPIENT SELECTION */}
        <div className="mb-3">
          <label className="form-label small fw-bold text-muted">Recipient Type</label>
          <div className="d-flex gap-2 mb-2">
            <button 
              type="button" 
              className={`btn btn-sm ${selectedType === 'dropdown' ? 'btn-primary' : 'btn-light'}`}
              onClick={() => setSelectedType('dropdown')}
            >
              <User size={14} className="me-1"/> Registered User
            </button>
            <button 
              type="button" 
              className={`btn btn-sm ${selectedType === 'manual' ? 'btn-primary' : 'btn-light'}`}
              onClick={() => setSelectedType('manual')}
            >
              <PlusCircle size={14} className="me-1"/> Custom Email
            </button>
          </div>

          {selectedType === 'dropdown' ? (
            <select 
              className="form-select bg-light" 
              required
              value={emailData.email}
              onChange={(e) => setEmailData({...emailData, email: e.target.value})}
            >
              <option value="">-- Select a User --</option>
              {users.map(u => (
                <option key={u.id} value={u.email}>{u.full_name} ({u.email})</option>
              ))}
            </select>
          ) : (
            <input 
              type="email" 
              className="form-control bg-light" 
              placeholder="Enter custom email address"
              required
              value={emailData.email}
              onChange={(e) => setEmailData({...emailData, email: e.target.value})}
            />
          )}
        </div>

        {/* SUBJECT */}
        <div className="mb-3">
          <label className="form-label small fw-bold text-muted">Subject</label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0"><Type size={16}/></span>
            <input 
              type="text" 
              className="form-control bg-light border-start-0" 
              placeholder="Email subject line"
              required 
              value={emailData.subject}
              onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
            />
          </div>
        </div>

        {/* MESSAGE */}
        <div className="mb-4">
          <label className="form-label small fw-bold text-muted">Message (HTML content supported)</label>
          <textarea 
            className="form-control bg-light" 
            rows={6} 
            placeholder="Hello, we noticed your account..."
            required
            value={emailData.message}
            onChange={(e) => setEmailData({...emailData, message: e.target.value})}
          ></textarea>
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary w-100 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2">
          {loading ? (
            <span className="spinner-border spinner-border-sm"></span>
          ) : (
            <><Send size={18}/> Send Message</>
          )}
        </button>
      </form>
    </div>
  );
};

export default AdminEmailPanel;