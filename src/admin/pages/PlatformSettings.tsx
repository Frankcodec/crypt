import React, { useEffect, useState } from "react";
import {
  Save,
  Shield,
  Percent,
  DollarSign,
  Mail,

} from "lucide-react";
import Swal from "sweetalert2";

const PlatformSettings: React.FC = () => {
  const [settings, setSettings] = useState<any>({
    min_withdrawal: "",
    withdrawal_fee_percent: "",
    referral_commission: "",
    maintenance_mode: "off",
    site_email: "",
    auto_approve_deposits: "off",
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
  try {
    const res = await fetch('https://mondayonsol.fun/crypto-backend/crypto-backend/admin/manage_settings.php');
    const data = await res.json();
    
    if (data.success && data.settings) {
      // We use data.settings because your raw response showed 
      // the settings were not nested inside another "data" key.
      setSettings(data.settings);
    } else {
      console.error("Backend reported failure:", data.message);
    }
  } catch (err) {
    console.error("Network or Parsing Error:", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch(
        "https://mondayonsol.fun/crypto-backend/crypto-backend/admin/manage_settings.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(settings),
        }
      );
      const data = await res.json();
      if (data.success) {
        Swal.fire({
          title: "Settings Saved",
          icon: "success",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    } catch (err) {
      Swal.fire("Error", "Update failed", "error");
    }
  };

  if (loading)
    return (
      <div className="p-5 text-center">
        <div className="spinner-border text-primary"></div>
      </div>
    );

  return (
    <div className="container-fluid p-4 bg-light min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Platform Settings</h2>
          <p className="text-muted small">
            Configure global business rules and system status.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="btn btn-primary px-4 py-2 rounded-3 d-flex align-items-center gap-2 shadow-sm"
        >
          <Save size={18} /> Save Configurations
        </button>
      </div>

      <div className="row g-4">
        {/* Financial Rules */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-success">
              <DollarSign size={20} /> Financial Thresholds
            </h5>
            <div className="mb-3">
              <label className="form-label small fw-bold">
                Minimum Withdrawal ($)
              </label>
              <input
                type="number"
                className="form-control"
                value={settings.min_withdrawal}
                onChange={(e) =>
                  setSettings({ ...settings, min_withdrawal: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-bold">
                Withdrawal Fee (%)
              </label>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  value={settings.withdrawal_fee_percent}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      withdrawal_fee_percent: e.target.value,
                    })
                  }
                />
                <span className="input-group-text">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Growth & Referrals */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2 text-primary">
              <Percent size={20} /> Referral Program
            </h5>
            <div className="mb-3">
              <label className="form-label small fw-bold">
                Direct Referral Commission (%)
              </label>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  value={settings.referral_commission}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      referral_commission: e.target.value,
                    })
                  }
                />
                <span className="input-group-text">%</span>
              </div>
              <p className="text-muted small mt-2">
                Percentage given to the upline when a downline makes a deposit.
              </p>
            </div>
          </div>
        </div>

        {/* System & Support */}
        <div className="col-12">
          <div className="card border-0 shadow-sm rounded-4 p-4 border-start border-4 border-danger">
            <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
              <Shield size={20} className="text-danger" /> System Governance
            </h5>
            <div className="row g-4">
              <div className="col-md-4">
                <label className="form-label small fw-bold">
                  Support Email
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-white">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    className="form-control border-start-0"
                    value={settings.site_email}
                    onChange={(e) =>
                      setSettings({ ...settings, site_email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="col-md-4 border-start border-light ps-md-4">
                <label className="form-label small fw-bold d-block">
                  Maintenance Mode
                </label>
                <div className="form-check form-switch mt-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    checked={settings.maintenance_mode === "on"}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        maintenance_mode: e.target.checked ? "on" : "off",
                      })
                    }
                  />
                  <label className="form-check-label small">
                    Lock all user dashboard access
                  </label>
                </div>
              </div>

              <div className="col-md-4 border-start border-light ps-md-4">
                <label className="form-label small fw-bold d-block">
                  Auto-Approve Deposits
                </label>
                <div className="form-check form-switch mt-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    checked={settings.auto_approve_deposits === "on"}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        auto_approve_deposits: e.target.checked ? "on" : "off",
                      })
                    }
                  />
                  <label className="form-check-label small text-muted">
                    Bypass manual verification (Risky)
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformSettings;
