import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Clock, 
  DollarSign, Loader2, Info, Trash2 
} from 'lucide-react';
import Swal from 'sweetalert2';

const AdminPlans: React.FC = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPlan, setNewPlan] = useState({ 
    name: '', min: '', max: '', roi: '', duration: '', unit: 'hours' 
  });

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://mondayonsol.fun/crypto-backend/crypto-backend/admin/get_plans.php');
      const data = await res.json();
      if (data.success) setPlans(data.data);
    } catch (err) { 
      console.error("Fetch error:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchPlans(); }, []);

  const handleAddPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert input value to total hours based on dropdown selection
    const inputValue = parseInt(newPlan.duration);
    const totalHours = newPlan.unit === 'days' ? inputValue * 24 : inputValue;

    if (totalHours <= 0) {
      return Swal.fire('Error', 'Please enter a valid duration', 'error');
    }

    try {
      const res = await fetch('https://mondayonsol.fun/crypto-backend/crypto-backend/admin/add_plan.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newPlan.name,
          min: parseFloat(newPlan.min),
          max: parseFloat(newPlan.max),
          roi: parseFloat(newPlan.roi),
          duration_hours: totalHours
        })
      });
      
      const data = await res.json();
      if (data.success) {
        Swal.fire({
          title: 'Plan Created!',
          text: `${newPlan.name} is now active for ${totalHours} hours.`,
          icon: 'success',
          confirmButtonColor: '#0d6efd'
        });
        setNewPlan({ name: '', min: '', max: '', roi: '', duration: '', unit: 'hours' });
        fetchPlans();
      } else {
        Swal.fire('Error', data.message, 'error');
      }
    } catch (err) { 
      Swal.fire('Error', 'Server communication failed', 'error'); 
    }
  };

  const handleHidePlan = async (id: number) => {
    const confirm = await Swal.fire({
      title: 'Hide this plan?',
      text: "Existing investments will continue, but new users won't see this plan.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6c757d',
      confirmButtonText: 'Yes, hide it'
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch('https://mondayonsol.fun/crypto-backend/crypto-backend/admin/delete_plan.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        const data = await res.json();
        if (data.success) {
          Swal.fire('Hidden', 'Plan is no longer visible to users.', 'success');
          fetchPlans();
        }
      } catch (err) {
        Swal.fire('Error', 'Could not update status', 'error');
      }
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row g-4">
        {/* LEFT: CREATE PLAN FORM */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '20px', zIndex: 10 }}>
            <div className="d-flex align-items-center gap-2 mb-4">
              
              <h5 className="fw-bold mb-0">Create New Plan</h5>
            </div>
            
            <form onSubmit={handleAddPlan}>
              <div className="mb-3">
                <label className="small fw-bold text-muted mb-1">PLAN NAME</label>
                <input type="text" className="form-control rounded-3 py-2" placeholder="e.g. Gold Tier" 
                  value={newPlan.name} onChange={e => setNewPlan({...newPlan, name: e.target.value})} required />
              </div>

              <div className="row mb-3">
                <div className="col">
                  <label className="small fw-bold text-muted mb-1">MIN ($)</label>
                  <input type="number" className="form-control rounded-3 py-2" value={newPlan.min} 
                    onChange={e => setNewPlan({...newPlan, min: e.target.value})} required />
                </div>
                <div className="col">
                  <label className="small fw-bold text-muted mb-1">MAX ($)</label>
                  <input type="number" className="form-control rounded-3 py-2" value={newPlan.max} 
                    onChange={e => setNewPlan({...newPlan, max: e.target.value})} required />
                </div>
              </div>

              <div className="mb-3">
                <label className="small fw-bold text-muted mb-1">ROI PERCENTAGE (%)</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 rounded-start-3"><TrendingUp size={16}/></span>
                  <input type="number" step="0.01" className="form-control border-start-0 rounded-end-3 py-2" placeholder="10.5" 
                    value={newPlan.roi} onChange={e => setNewPlan({...newPlan, roi: e.target.value})} required />
                </div>
              </div>

              <div className="mb-4">
                <label className="small fw-bold text-muted mb-1">DURATION</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 rounded-start-3"><Clock size={16}/></span>
                  <input type="number" className="form-control border-start-0 py-2" placeholder="Value" 
                    value={newPlan.duration} onChange={e => setNewPlan({...newPlan, duration: e.target.value})} required />
                  <select className="form-select rounded-end-3" style={{ maxWidth: '110px' }}
                    value={newPlan.unit} onChange={e => setNewPlan({...newPlan, unit: e.target.value})}>
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                  </select>
                </div>
              </div>

              <button className="btn btn-primary w-100 py-2 rounded-pill fw-semi-bold shadow-sm d-flex align-items-center justify-content-center gap-2">
                Activate Plan
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT: PLANS LIST */}
        <div className="col-lg-8">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="fw-bold mb-0">Active & Hidden Plans</h5>
            <span className="badge bg-light text-dark rounded-pill px-3 border">{plans.length} Total</span>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <Loader2 className="animate-spin text-primary mx-auto" size={40}/>
              <p className="text-muted mt-2">Loading plans...</p>
            </div>
          ) : (
            <div className="row g-3">
              {plans.length > 0 ? plans.map(plan => (
                <div className="col-md-6" key={plan.id}>
                  <div className={`card border-0 shadow-sm rounded-4 p-4 transition-all ${plan.status === 'hidden' ? 'bg-light opacity-75' : 'bg-white'}`} style={{ borderLeft: `4px solid ${plan.status === 'hidden' ? '#6c757d' : '#0d6efd'}` }}>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h6 className="fw-bold mb-1 text-dark">{plan.name}</h6>
                        <span className={`badge rounded-pill px-2 py-1 x-small ${plan.status === 'active' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
                          {plan.status.toUpperCase()}
                        </span>
                      </div>
                      {plan.status === 'active' && (
                        <button onClick={() => handleHidePlan(plan.id)} className="btn btn-outline-secondary border-0 btn-sm rounded-circle" title="Hide Plan">
                          <Trash2 className='text-danger' size={18}/>
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="d-flex justify-content-between small py-1 border-bottom border-light">
                        <span className="text-muted"><DollarSign size={14} className="me-1"/> Limits:</span>
                        <span className="fw-bold text-dark">${Number(plan.min_deposit).toLocaleString()} - ${Number(plan.max_deposit).toLocaleString()}</span>
                      </div>
                      <div className="d-flex justify-content-between small py-1 border-bottom border-light">
                        <span className="text-muted"><TrendingUp size={14} className="me-1"/> ROI:</span>
                        <span className="text-primary fw-bold">{plan.roi_percentage}%</span>
                      </div>
                      <div className="d-flex justify-content-between small py-1">
                        <span className="text-muted"><Clock size={14} className="me-1"/> Duration:</span>
                        <span className="text-dark fw-bold">
                          {plan.duration_hours >= 24 && plan.duration_hours % 24 === 0 
                            ? `${plan.duration_hours / 24} Days` 
                            : `${plan.duration_hours} Hours`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-12 text-center py-5 bg-white rounded-4 shadow-sm">
                  <Info className="text-muted mb-2" size={30}/>
                  <p className="text-muted mb-0">No investment plans found. Create one to get started.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPlans;