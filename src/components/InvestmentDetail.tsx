import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, TrendingUp, Award, Calendar, ShieldCheck, CheckCircle } from 'lucide-react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

ChartJS.register(ArcElement, Tooltip, Legend);
const MySwal = withReactContent(Swal);

const InvestmentDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inv, setInv] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState('');
  const [isMatured, setIsMatured] = useState(false);

  // 1. Fetch Investment Data
  const fetchInvestment = async () => {
    try {
      const res = await fetch(`https://api.nutcoinonsol.com/crypto-backend/get_investment_by_id.php?id=${id}`);
      const data = await res.json();
      if (data.success) {
        setInv(data.data);
      } else {
        MySwal.fire('Error', 'Investment not found', 'error');
        navigate('/invest');
      }
    } catch (err) {
      console.error("Failed to fetch investment details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestment();
  }, [id]);

  // 2. Countdown Timer Logic
  useEffect(() => {
    if (!inv || inv.status !== 'active') return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(inv.end_date).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("MATURED");
        setIsMatured(true);
        clearInterval(timer);
      } else {
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${h}h ${m}m ${s}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [inv]);

  // 3. Claim Payout Logic
  const handleClaim = async () => {
    MySwal.fire({
      title: 'Claiming Payout...',
      didOpen: () => { Swal.showLoading(); }
    });

    try {
      const res = await fetch('https://api.nutcoinonsol.com/crypto-backend/claim_payout.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ investment_id: inv.id, user_id: inv.user_id })
      });
      const result = await res.json();
      
      if (result.success) {
        MySwal.fire('Success!', result.message, 'success');
        fetchInvestment(); // Refresh to show completed status
      } else {
        MySwal.fire('Failed', result.message, 'error');
      }
    } catch (err) {
      MySwal.fire('Error', 'Server communication error', 'error');
    }
  };

  if (loading) return <div className="p-5 text-center text-primary">Loading analytical data...</div>;
  if (!inv) return null;

  // Pie Chart Data Configuration
  const chartData = {
    labels: ['Capital', 'Net Profit'],
    datasets: [{
      data: [inv.amount_invested, inv.expected_return - inv.amount_invested],
      backgroundColor: ['#0d6efd', '#20c997'],
      hoverOffset: 15,
      borderWidth: 0
    }]
  };

  return (
    <div className="container py-5">
      <button onClick={() => navigate(-1)} className="btn btn-link text-decoration-none text-muted mb-4 p-0 d-flex align-items-center gap-2">
        <ArrowLeft size={18} /> Back to My Portfolio
      </button>

      <div className="row g-4">
        {/* Left Side: Summary Card */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="card-header bg-dark p-4 border-0">
              <div className="d-flex justify-content-between align-items-center">
                <div className="text-white">
                  <h2 className="fw-bold mb-0">{inv.plan_name}</h2>
                  <p className="small opacity-50 mb-0">Contract Hash: #{inv.id}882x{inv.user_id}</p>
                </div>
                <div className="badge bg-warning text-dark px-3 py-2 rounded-pill shadow-sm">
                  <Award size={16} className="me-1" /> {inv.rank} Investor
                </div>
              </div>
            </div>

            <div className="card-body p-5">
              <div className="row align-items-center">
                <div className="col-md-5 text-center mb-4 mb-md-0 border-end">
                   <div style={{ maxWidth: '240px', margin: '0 auto' }}>
                      <Pie data={chartData} options={{ plugins: { legend: { position: 'bottom' } } }} />
                   </div>
                </div>
                <div className="col-md-7 ps-md-5">
                  <div className="row g-4 mb-5">
                    <div className="col-6">
                      <label className="small text-muted text-uppercase fw-bold d-block mb-1">Total Invested</label>
                      <h3 className="fw-bold text-dark">${Number(inv.amount_invested).toLocaleString()}</h3>
                    </div>
                    <div className="col-6">
                      <label className="small text-muted text-uppercase fw-bold d-block mb-1">Net Expected</label>
                      <h3 className="fw-bold text-success">${Number(inv.expected_return).toLocaleString()}</h3>
                    </div>
                  </div>

                  <div className={`p-4 rounded-4 text-center ${isMatured ? 'bg-success bg-opacity-10' : 'bg-light'}`}>
                    <p className="small text-muted text-uppercase fw-bold mb-2">
                      <Clock size={16} className="me-2 text-primary" /> 
                      {inv.status === 'completed' ? 'Contract Finalized' : 'Maturity Countdown'}
                    </p>
                    <h1 className={`display-4 fw-bold font-monospace mb-0 ${isMatured ? 'text-success' : 'text-primary'}`}>
                      {inv.status === 'completed' ? 'PAID' : timeLeft}
                    </h1>
                  </div>
                </div>
              </div>
            </div>

            {/* Claim Section */}
            {isMatured && inv.status === 'active' && (
              <div className="card-footer bg-white border-top-0 p-4 pt-0">
                <button onClick={handleClaim} className="btn btn-success w-100 py-3 fw-bold rounded-3 shadow">
                   CLAIM ASSETS & PROFITS
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Quick Stats */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Audit Trail</h5>
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="bg-primary bg-opacity-10 p-2 rounded text-primary">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="small text-muted mb-0">Initiated On</p>
                  <p className="fw-bold mb-0">{new Date(inv.start_date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="bg-success bg-opacity-10 p-2 rounded text-success">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <p className="small text-muted mb-0">Projected Growth</p>
                  <p className="fw-bold mb-0">+{((inv.expected_return / inv.amount_invested) * 100 - 100).toFixed(0)}% Profit</p>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="bg-info bg-opacity-10 p-2 rounded text-info">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="small text-muted mb-0">Protection</p>
                  <p className="fw-bold mb-0">Principal Insured</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="alert alert-secondary border-0 rounded-4 p-4">
             <div className="d-flex gap-2 mb-2">
               <CheckCircle size={18} className="text-success"/>
               <h6 className="fw-bold mb-0 small">Security Verified</h6>
             </div>
             <p className="small text-muted mb-0">
               This investment is locked in a smart contract. Funds are released automatically once the duration is reached.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentDetail;