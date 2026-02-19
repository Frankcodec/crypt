import React, { useState } from 'react';
import { 
  User, Shield, Smartphone, Mail, 
  CheckCircle, AlertTriangle, KeyRound, Bell 
} from 'lucide-react';
import Swal from 'sweetalert2';

const SettingsPage: React.FC = () => {
  // Get user from local storage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  // State for password change
  const [passwordData, setPasswordData] = useState({
    old: '',
    new: '',
    confirm: ''
  });
  const [loading, setLoading] = useState(false);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (!passwordData.old || !passwordData.new) {
      return Swal.fire('Error', 'Please fill in all password fields', 'warning');
    }
    if (passwordData.new !== passwordData.confirm) {
      return Swal.fire('Error', 'New passwords do not match', 'error');
    }
    if (passwordData.new.length < 8) {
      return Swal.fire('Error', 'New password must be at least 8 characters', 'warning');
    }

    setLoading(true);
    try {
      const response = await fetch('https://api.nutcoinonsol.com/crypto-backend/update_password.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          old_password: passwordData.old,
          new_password: passwordData.new
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        Swal.fire({
          title: 'Success!',
          text: data.message,
          icon: 'success',
          confirmButtonColor: '#0d6efd'
        });
        // Clear form
        setPasswordData({ old: '', new: '', confirm: '' });
      } else {
        Swal.fire('Failed', data.message, 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'Server connection failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid pb-5">
      <div className="mb-4">
        <h3 className="fw-bold">Account Settings</h3>
        <p className="text-muted">Manage your profile, security, and preferences.</p>
      </div>

      <div className="row g-4">
        {/* PROFILE SECTION */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-2 mb-4">
                <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary">
                  <User size={20} />
                </div>
                <h5 className="fw-bold mb-0">Personal Information</h5>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted text-uppercase">Full Name</label>
                  <div className="input-group border rounded-3 overflow-hidden">
                    <span className="input-group-text bg-light border-0"><User size={16}/></span>
                    <input type="text" className="form-control border-0 bg-light" value={user.full_name} readOnly />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted text-uppercase">Email Address</label>
                  <div className="input-group border rounded-3 overflow-hidden">
                    <span className="input-group-text bg-light border-0"><Mail size={16}/></span>
                    <input type="email" className="form-control border-0 bg-light" value={user.email} readOnly />
                  </div>
                </div>
                <div className="col-12 mt-3">
                  <div className="alert alert-info border-0 rounded-4 d-flex align-items-center gap-3 py-3 mb-0">
                    <CheckCircle className="text-primary" size={24} />
                    <p className="small mb-0">Your account is currently <strong>verified</strong>. Contact support to change your primary account details.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECURITY & 2FA MOCKUP */}
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-2 mb-4">
                <div className="bg-success bg-opacity-10 p-2 rounded-3 text-success">
                  <Shield size={20} />
                </div>
                <h5 className="fw-bold mb-0">Account Security</h5>
              </div>

              <div className="d-flex align-items-center justify-content-between p-3 border rounded-4 mb-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-light p-2 rounded-circle">
                    <Smartphone size={22} className="text-muted" />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0">2FA Authentication</h6>
                    <p className="small text-muted mb-0">Use Google Authenticator for extra security.</p>
                  </div>
                </div>
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" role="switch" style={{ width: '2.5em', height: '1.25em' }} />
                </div>
              </div>

              <div className="d-flex align-items-center justify-content-between p-3 border rounded-4">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-light p-2 rounded-circle">
                    <Bell size={22} className="text-muted" />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0">Login Notifications</h6>
                    <p className="small text-muted mb-0">Receive email alerts on every login attempt.</p>
                  </div>
                </div>
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" role="switch" style={{ width: '2.5em', height: '1.25em' }} defaultChecked />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PASSWORD UPDATE SECTION */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 position-sticky" style={{ top: '100px' }}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-2 mb-4">
                <div className="bg-danger bg-opacity-10 p-2 rounded-3 text-danger">
                  <KeyRound size={20} />
                </div>
                <h5 className="fw-bold mb-0">Change Password</h5>
              </div>

              <form onSubmit={handlePasswordUpdate}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted text-uppercase">Current Password</label>
                  <input 
                    type="password" 
                    className="form-control py-2 rounded-3" 
                    placeholder="Enter current password"
                    value={passwordData.old}
                    onChange={(e) => setPasswordData({...passwordData, old: e.target.value})}
                  />
                </div>
                <hr className="my-4 text-muted opacity-25" />
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted text-uppercase">New Password</label>
                  <input 
                    type="password" 
                    className="form-control py-2 rounded-3" 
                    placeholder="Min. 8 characters"
                    value={passwordData.new}
                    onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted text-uppercase">Confirm New Password</label>
                  <input 
                    type="password" 
                    className="form-control py-2 rounded-3" 
                    placeholder="Repeat new password"
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                  />
                </div>

                <div className="bg-warning bg-opacity-10 p-3 rounded-4 mb-4 d-flex gap-2 align-items-start">
                  <AlertTriangle className="text-warning flex-shrink-0" size={18} />
                  <p className="small text-warning-emphasis mb-0">
                    Changing your password will not log you out of your current session.
                  </p>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-dark w-100 py-2 fw-bold rounded-pill shadow-sm"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Save New Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;