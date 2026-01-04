import React, { useState, useEffect } from 'react';

interface InvestmentPlan {
  id: number;
  name: string;
  min_deposit: string | number;
  max_deposit: string | number;
  roi_percentage: string | number;
  duration_hours: number; // Duration comes from DB in hours
  status: string;
}

const PricingSection: React.FC = () => {
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [loading, setLoading] = useState(true);

  // --- THE "TRICK" FUNCTION ---
  const formatDuration = (hours: number) => {
    if (hours < 24) {
      return `${hours} ${hours === 1 ? 'Hour' : 'Hours'}`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days} ${days === 1 ? 'Day' : 'Days'}`;
    }
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('https://mondayonsol.fun/crypto-backend/get_plans.php');
        const data = await response.json();
        if (data.success) {
          setPlans(data.plans);
        } else {
        //   setError(data.message);
        }
      } catch (err) {
        // setError("Could not connect to the server.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  if (loading) return <div className="py-5 text-center text-white">Loading...</div>;

  return (
    <section id='plans' className="pricing-section py-5" style={{ backgroundColor: '#0b0e11', minHeight: '80vh' }}>
      <div className="container">
        <div className="row mb-5">
          <div className="col-12 text-center text-white">
            <h2 className="display-4 fw-bold">Investment Tiers</h2>
            <p className="text-muted">Start earning passive income today</p>
          </div>
        </div>

        <div className="row g-4 justify-content-center">
          {plans.map((plan, index) => {
            const isFeatured = index === 1;

            return (
              <div className="col-lg-4" key={plan.id}>
                <div className={`card h-100 border-0 rounded-4 shadow ${isFeatured ? 'bg-primary text-white scale-up' : 'bg-dark text-white border border-secondary'}`}>
                  <div className="card-body p-4">
                    <h4 className="fw-bold mb-3">{plan.name}</h4>
                    
                    <div className="mb-4">
                      <span className="display-5 fw-bold">{plan.roi_percentage}%</span>
                      <span className={isFeatured ? 'text-white-50' : 'text-muted'}> Net Profit</span>
                    </div>

                    <ul className="list-unstyled mb-4">
                      <li className="mb-2">
                        <span className="opacity-75">Min:</span> <strong>${Number(plan.min_deposit).toLocaleString()}</strong>
                      </li>
                      <li className="mb-2">
                        <span className="opacity-75">Max:</span> <strong>${Number(plan.max_deposit).toLocaleString()}</strong>
                      </li>
                      <li className="mb-2">
                        {/* USING THE DURATION TRICK HERE */}
                        <span className="opacity-75">Duration:</span> <strong>{formatDuration(Number(plan.duration_hours))}</strong>
                      </li>
                      <li className="mb-2">
                        <span className="opacity-75">Principal:</span> <strong>Included</strong>
                      </li>
                    </ul>

                    <button className={`btn w-100 py-3 fw-bold rounded-pill ${isFeatured ? 'btn-light text-primary' : 'btn-outline-light'}`}>
                      Select {plan.name}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <style>{`
        .scale-up { transform: scale(1.05); z-index: 10; }
        @media (max-width: 991px) { .scale-up { transform: scale(1); } }
      `}</style>
    </section>
  );
};

export default PricingSection;