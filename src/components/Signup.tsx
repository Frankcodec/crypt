import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { User, Mail, Lock, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

// Set your API Base URL here or in an .env file
const API_BASE_URL = 'https://api.nutcoinonsol.com/crypto-backend';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const otpInputRef = useRef<HTMLInputElement>(null);
  
  // State Management
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [refId, setRefId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Handle Referral and Countdown Timer
  useEffect(() => {
    const r = searchParams.get('ref');
    if (r) setRefId(r);

    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [searchParams, timer]);

  // Focus OTP input when step 2 loads
  useEffect(() => {
    if (step === 2 && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [step]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleError = (error: any, defaultMsg: string) => {
    console.error("API Error:", error);
    Swal.fire('Error', error.message || defaultMsg, 'error');
  };

  // --- STEP 1: SEND OTP ---
  const handleSendCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.email) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/send_otp.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email.toLowerCase().trim() }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setStep(2);
        setCanResend(false);
        setTimer(60); 
        Swal.fire({
          title: 'Code Sent!',
          text: 'Check your email (including spam).',
          icon: 'success',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
      } else {
        throw new Error(data.message || 'Failed to send code');
      }
    } catch (err) {
      handleError(err, 'Connection failed. Ensure your backend has CORS enabled.');
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 2: VERIFY OTP ---
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/verify_otp.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            email: formData.email.toLowerCase().trim(), 
            otp: otp 
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        setStep(3);
      } else {
        throw new Error(data.message || 'Invalid or expired code.');
      }
    } catch (err) {
      handleError(err, 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 3: FINAL SIGNUP ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return Swal.fire('Error', 'Passwords do not match', 'error');
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/signup.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
          ref_id: refId
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        Swal.fire('Welcome!', 'Account created successfully.', 'success')
            .then(() => navigate('/login'));
      } else {
        throw new Error(data.message || 'Signup failed.');
      }
    } catch (err) {
      handleError(err, 'Final registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-lg border-0 rounded-4 overflow-hidden" style={{ maxWidth: '900px', width: '100%' }}>
        <div className="row g-0">
          
          {/* LEFT DECORATION */}
          <div className="col-md-5 bg-primary d-none d-md-flex align-items-center justify-content-center text-white p-5 text-center">
            <div>
              <ShieldCheck size={80} className="mb-4 opacity-75" />
              <h2 className="fw-bold">Secured Platform</h2>
              <p className="opacity-75">Bank-grade encryption for your wealth journey.</p>
              {refId && (
                <div className="badge bg-white text-primary px-3 py-2 mt-3 rounded-pill">
                  Referral Reward Applied 🎁
                </div>
              )}
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="col-md-7 bg-white p-4 p-md-5">
            
            {/* STEP 1: EMAIL */}
            {step === 1 && (
              <form onSubmit={handleSendCode}>
                <h3 className="fw-bold mb-1">Create Account</h3>
                <p className="text-muted mb-4 small">Verify your email to continue.</p>
                <div className="mb-4">
                  <label className="form-label small fw-bold">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0"><Mail size={18} className="text-muted"/></span>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      className="form-control bg-light border-start-0" 
                      placeholder="name@example.com"
                      required 
                      onChange={handleChange} 
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary w-100 py-3 fw-bold rounded-3 shadow-sm d-flex align-items-center justify-content-center">
                  {loading ? <Loader2 className="animate-spin me-2" size={20} /> : 'Continue'}
                </button>
              </form>
            )}

            {/* STEP 2: OTP */}
            {step === 2 && (
              <form onSubmit={handleVerifyCode}>
                <button type="button" onClick={() => setStep(1)} className="btn btn-sm btn-link text-decoration-none p-0 mb-3 d-flex align-items-center gap-1 text-muted">
                  <ArrowLeft size={14}/> Change Email
                </button>
                <h3 className="fw-bold mb-1">Verify Inbox</h3>
                <p className="text-muted mb-4 small">Sent to: <b>{formData.email}</b></p>
                <div className="mb-4">
                  <input 
                    ref={otpInputRef}
                    type="text" 
                    maxLength={6} 
                    className="form-control bg-light text-center fw-bold fs-3 py-3" 
                    placeholder="000000" 
                    style={{ letterSpacing: '8px' }}
                    required 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                  />
                </div>
                <button type="submit" disabled={loading || otp.length < 6} className="btn btn-primary w-100 py-3 fw-bold rounded-3 shadow-sm mb-3">
                  {loading ? 'Verifying...' : 'Verify Code'}
                </button>
                <div className="text-center">
                  {canResend ? (
                    <button type="button" className="btn btn-link btn-sm text-decoration-none fw-bold" onClick={() => handleSendCode()}>Resend Code</button>
                  ) : (
                    <span className="text-muted small">Resend in <b className="text-primary">{timer}s</b></span>
                  )}
                </div>
              </form>
            )}

            {/* STEP 3: DETAILS */}
            {step === 3 && (
              <form onSubmit={handleSubmit}>
                <h3 className="fw-bold mb-1 text-success">Verification Successful!</h3>
                <p className="text-muted mb-4 small">Setup your login credentials.</p>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0"><User size={18} className="text-muted"/></span>
                    <input type="text" name="full_name" className="form-control bg-light border-start-0" placeholder="John Doe" required onChange={handleChange} />
                  </div>
                </div>
                <div className="row mb-4 g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0"><Lock size={18} className="text-muted"/></span>
                      <input type="password" name="password" className="form-control bg-light border-start-0" required onChange={handleChange} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Confirm</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0"><Lock size={18} className="text-muted"/></span>
                      <input type="password" name="confirmPassword" className="form-control bg-light border-start-0" required onChange={handleChange} />
                    </div>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn btn-success w-100 py-3 fw-bold rounded-3 shadow-sm">
                  {loading ? 'Finalizing...' : 'Complete Registration'}
                </button>
              </form>
            )}

            <div className="mt-4 text-center">
               <p className="text-muted small mb-0">
                Already have an account? <Link to="/login" className="text-primary fw-bold text-decoration-none">Login</Link>
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;