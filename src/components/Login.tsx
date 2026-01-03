import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {  Mail, Lock, UserPlus, ShieldCheck } from 'lucide-react';
import Swal from 'sweetalert2';
import DynamicNavbar from './Nav';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost/crypto-backend/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Save user session to localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        // Redirect to dashboard
        Swal.fire({
                  title: 'Account Created!',
                  text: 'You can now log in to start investing.',
                  icon: 'success',
                  confirmButtonColor: '#0d6efd'
                }).then(() => {
                  navigate('/dashboard');
                });
      } else {
        Swal.fire('Signup Failed', data.message, 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'Could not connect to the server.', 'error');
    }
  };

  return (
    // <div className="container d-flex justify-content-center align-items-center vh-100">
    //   <form onSubmit={handleLogin} className="card p-4 shadow-sm" style={{ width: '350px' }}>
    //     <h3 className="text-center mb-4">Login</h3>
    //     {error && <div className="alert alert-danger p-2 small">{error}</div>}
        
    //     <div className="mb-3">
    //       <label className="form-label small fw-bold">Email</label>
    //       <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
    //     </div>

    //     <div className="mb-3">
    //       <label className="form-label small fw-bold">Password</label>
    //       <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
    //     </div>

    //     <button type="submit" className="btn btn-primary w-100">Sign In</button>
    //   </form>
    // </div>

    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <DynamicNavbar />
      <div className="card shadow-lg border-0 rounded-4 overflow-hidden" style={{ maxWidth: '900px', width: '100%' }}>
        <div className="row g-0">
          {/* Left Side: Branding */}
          <div className="col-md-5 bg-primary d-none d-md-flex align-items-center justify-content-center text-white p-5">
            <div className="text-center">
              <ShieldCheck size={80} className="mb-4 opacity-75" />
              <h2 className="fw-bold">Join the Future</h2>
              <p className="opacity-75">Secure your assets with our next-gen investment audit platform.</p>
              
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="col-md-7 bg-white p-lg-5 p-3 py-5">
            <div className="mb-4">
              <h3 className="fw-bold">Login to your account</h3>
              <p className="text-muted">Fill in the details to get started.</p>
            </div>

            <form onSubmit={handleLogin}>
              

              <div className="mb-3">
                <label className="form-label small fw-bold">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0"><Mail size={18} className="text-muted"/></span>
                  <input type="email" name="email" className="form-control bg-light border-start-0" required onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-12">
                  <label className="form-label small fw-bold">Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0"><Lock size={18} className="text-muted"/></span>
                    <input type="password" name="password" className="form-control bg-light border-start-0" required onChange={(e) => setPassword(e.target.value)} />
                  </div>
                </div>
                
              </div>

              <button type="submit" className="btn btn-primary w-100 py-3 fw-bold rounded-3 shadow-sm mb-3">
                <UserPlus size={18} className="me-2" /> Login
              </button>

              <p className="text-center text-muted small mb-0">
                Don't have an account? <Link to="/login" className="text-primary fw-bold text-decoration-none">Signup</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Login;