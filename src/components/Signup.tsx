import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, ShieldCheck } from 'lucide-react';
import Swal from 'sweetalert2';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // State for form fields
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Capture the 'ref' from the URL (e.g., ?ref=12)
  const [refId, setRefId] = useState<string | null>(null);

  useEffect(() => {
    const r = searchParams.get('ref');
    if (r) {
      setRefId(r);
      console.log("Referral detected from User ID:", r);
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return Swal.fire('Error', 'Passwords do not match', 'error');
    }

    try {
      const response = await fetch('https://mondayonsol.fun/crypto-backend/crypto-backend/signup.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
          ref_id: refId // This sends the ID to your new signup.php logic
        }),
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          title: 'Account Created!',
          text: 'You can now log in to start investing.',
          icon: 'success',
          confirmButtonColor: '#0d6efd'
        }).then(() => {
          navigate('/login');
        });
      } else {
        Swal.fire('Signup Failed', data.message, 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Could not connect to the server.', 'error');
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-lg border-0 rounded-4 overflow-hidden" style={{ maxWidth: '900px', width: '100%' }}>
        <div className="row g-0">
          {/* Left Side: Branding */}
          <div className="col-md-5 bg-primary d-none d-md-flex align-items-center justify-content-center text-white p-5">
            <div className="text-center">
              <ShieldCheck size={80} className="mb-4 opacity-75" />
              <h2 className="fw-bold">Join the Future</h2>
              <p className="opacity-75">Secure your assets with our next-gen investment audit platform.</p>
              {refId && (
                <div className="badge bg-white text-primary px-3 py-2 mt-3 rounded-pill">
                  Ref Link Active ✅
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="col-md-7 bg-white p-5">
            <div className="mb-4">
              <h3 className="fw-bold">Create Account</h3>
              <p className="text-muted">Fill in the details to get started.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Full Name</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0"><User size={18} className="text-muted"/></span>
                  <input type="text" name="full_name" className="form-control bg-light border-start-0" required onChange={handleChange} />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0"><Mail size={18} className="text-muted"/></span>
                  <input type="email" name="email" className="form-control bg-light border-start-0" required onChange={handleChange} />
                </div>
              </div>

              <div className="row mb-4">
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

              <button type="submit" className="btn btn-primary w-100 py-3 fw-bold rounded-3 shadow-sm mb-3">
                <UserPlus size={18} className="me-2" /> Sign Up Now
              </button>

              <p className="text-center text-muted small mb-0">
                Already have an account? <Link to="/login" className="text-primary fw-bold text-decoration-none">Login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;