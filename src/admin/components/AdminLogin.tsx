

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('https://api.nutcoinonsol.com/crypto-backend/admin/auth/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Save user session to localStorage
        localStorage.setItem('admin_user', JSON.stringify(data.user));

        Swal.fire({
          icon: 'success',
          title: 'Welcome Back!',
          text: 'Login successful.',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          navigate('/admin');
        });
      } else {
        Swal.fire('Error', data.message || 'Invalid credentials', 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'Server connection failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card border-0 shadow-lg rounded-4 overflow-hidden" style={{ maxWidth: '450px', width: '90%' }}>
        <div className="bg-primary p-5 text-center text-white">
          <div className="bg-white rounded-circle d-inline-flex p-3 mb-3 text-primary shadow">
            <ShieldAlert size={40} />
          </div>
          <h3 className="fw-bold mb-0">Admin Portal</h3>
          <p className="opacity-75 small">Enter your credentials to access the system</p>
        </div>
        
        <div className="card-body p-4 p-lg-5">
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="form-label small fw-bold text-muted">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0"><Mail size={18} className="text-muted"/></span>
                <input 
                  type="email" 
                  className="form-control bg-light border-start-0 py-2" 
                  placeholder="admin@platform.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label small fw-bold text-muted">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0"><Lock size={18} className="text-muted"/></span>
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="form-control bg-light border-start-0 border-end-0 py-2" 
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  className="input-group-text bg-light border-start-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-100 py-2 fw-bold rounded-3 shadow-sm mb-3"
              disabled={loading}
            >
              {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : 'Sign In to Dashboard'}
            </button>
            
            <div className="text-center">
              <a href="#" className="text-decoration-none small text-muted">Forgot password? Contact Support</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;