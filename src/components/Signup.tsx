import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { User, Mail, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Steps: 1 = Email, 2 = OTP, 3 = Final Details
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  
  // Timer States for Resend logic
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [refId, setRefId] = useState<string | null>(null);

  // 1. Detect Referral & Handle Countdown Timer
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
      if (interval) clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [searchParams, timer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- ACTION: SEND/RESEND OTP ---
  const handleSendCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Explicitly grab email from state to avoid undefined errors
    const emailToSend = formData.email;
    if (!emailToSend) return Swal.fire('Error', 'Please enter your email.', 'error');
    if (!canResend || loading) return;

    setLoading(true);
    try {
      const res = await fetch('https://mondayonsol.fun/crypto-backend/send_otp.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToSend }),
      });
      const data = await res.json();
      
      if (data.success) {
        setStep(2);
        setCanResend(false);
        setTimer(60); // Reset to 60 seconds
        
        Swal.fire({
          title: 'Code Sent!',
          text: 'Check your email (and spam folder).',
          icon: 'success',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
      } else {
        Swal.fire('Error', data.message, 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Connection failed. Check your internet or server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- ACTION: VERIFY OTP ---
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('https://mondayonsol.fun/crypto-backend/verify_otp.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp: otp }),
      });
      const data = await res.json();
      if (data.success) {
        setStep(3);
      } else {
        Swal.fire('Invalid Code', data.message || 'Incorrect verification code.', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Verification failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- ACTION: FINAL SIGNUP ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return Swal.fire('Error', 'Passwords do not match', 'error');
    }

    setLoading(true);
    try {
      const response = await fetch('https://mondayonsol.fun/crypto-backend/signup.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
          ref_id: refId
        }),
      });
      const data = await response.json();
      if (data.success) {
        Swal.fire('Welcome!', 'Account created successfully.', 'success').then(() => navigate('/login'));
      } else {
        Swal.fire('Signup Failed', data.message, 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Final signup failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-lg border-0 rounded-4 overflow-hidden" style={{ maxWidth: '900px', width: '100%' }}>
        <div className="row g-0">
          
          {/* LEFT SIDE: BRANDING */}
          <div className="col-md-5 bg-primary d-none d-md-flex align-items-center justify-content-center text-white p-5 text-center">
            <div>
              <ShieldCheck size={80} className="mb-4 opacity-75" />
              <h2 className="fw-bold">Secured Platform</h2>
              <p className="opacity-75">We verify every user to maintain the integrity of our audit ecosystem.</p>
              {refId && (
                <div className="badge bg-white text-primary px-3 py-2 mt-3 rounded-pill shadow-sm">
                  Referral Reward Active 🎁
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE: FORMS */}
          <div className="col-md-7 bg-white p-4 p-md-5">
            
            {/* STEP 1: COLLECT EMAIL */}
            {step === 1 && (
              <div className="animate-fade-in">
                <h3 className="fw-bold mb-1 text-dark">Join Us</h3>
                <p className="text-muted mb-4 small">Enter your email to get started.</p>
                <form onSubmit={handleSendCode}>
                  <div className="mb-4">
                    <label className="form-label small fw-bold">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0"><Mail size={18} className="text-muted"/></span>
                      <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        className="form-control bg-light border-start-0" 
                        placeholder="your@email.com"
                        required 
                        onChange={handleChange} 
                      />
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="btn btn-primary w-100 py-3 fw-bold rounded-3 shadow-sm d-flex justify-content-center align-items-center">
                    {loading ? <Loader2 className="animate-spin me-2" size={20} /> : 'Continue'}
                  </button>
                </form>
              </div>
            )}

            {/* STEP 2: OTP VERIFICATION */}
            {step === 2 && (
              <div className="animate-fade-in text-center">
                <button type="button" onClick={() => setStep(1)} className="btn btn-sm btn-link text-decoration-none p-0 mb-3 d-flex align-items-center gap-1 text-muted mx-auto">
                  <ArrowLeft size={14}/> Change Email
                </button>
                <h3 className="fw-bold mb-1 text-dark">Check Your Inbox</h3>
                <p className="text-muted mb-4 small">Verification code sent to: <br/> <b>{formData.email}</b></p>
                
                <form onSubmit={handleVerifyCode}>
                  <div className="mb-4">
                    <input 
                      type="text" 
                      maxLength={6} 
                      className="form-control bg-light text-center fw-bold fs-2 py-3 border-2 border-primary border-opacity-25" 
                      placeholder="000000" 
                      style={{ letterSpacing: '8px' }}
                      required 
                      onChange={(e) => setOtp(e.target.value)} 
                    />
                  </div>
                  
                  <button type="submit" disabled={loading} className="btn btn-primary w-100 py-3 fw-bold rounded-3 shadow-sm mb-3">
                    {loading ? 'Verifying...' : 'Verify Code'}
                  </button>
                </form>

                {/* RESEND SECTION */}
                <div className="mt-2">
                  {canResend ? (
                    <button 
                      type="button" 
                      className="btn btn-link btn-sm text-primary fw-bold text-decoration-none d-inline-flex align-items-center gap-2" 
                      onClick={() => handleSendCode()}
                      disabled={loading}
                    >
                      {loading && <span className="spinner-border spinner-border-sm"></span>}
                      Resend Code
                    </button>
                  ) : (
                    <div className="p-2 bg-light rounded-pill d-inline-block px-3">
                      <span className="text-muted small">Resend available in <b className="text-primary">{timer}s</b></span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: ACCOUNT DETAILS */}
            {step === 3 && (
              <div className="animate-fade-in">
                <h3 className="fw-bold mb-1 text-success">Verified! ✅</h3>
                <p className="text-muted mb-4 small">Complete your registration to continue.</p>
                <form onSubmit={handleSubmit}>
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
                      <input type="password" name="password" className="form-control bg-light" required onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Confirm Password</label>
                      <input type="password" name="confirmPassword" className="form-control bg-light" required onChange={handleChange} />
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="btn btn-success w-100 py-3 fw-bold rounded-3 shadow-sm">
                    {loading ? 'Finalizing...' : 'Complete Registration'}
                  </button>
                </form>
              </div>
            )}

            <div className="mt-4 text-center">
               <p className="text-muted small mb-0">
                Already have an account? <Link to="/login" className="text-primary fw-bold text-decoration-none">Login</Link>
               </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Simple CSS animation for transitions */}
      <style>{`
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Signup;