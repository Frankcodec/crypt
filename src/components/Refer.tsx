import React, { useState, useEffect } from 'react';
import { Copy, Users, DollarSign } from 'lucide-react';
import Swal from 'sweetalert2';

const ReferralStats: React.FC<{ userId: number }> = ({ userId }) => {
    const [stats, setStats] = useState({
        total_referrals: 0,
        referral_earnings: 0,
        referral_list: [] as any[]
    });
    const [loading, setLoading] = useState(true);

    const refLink = `${window.location.origin}/signup?ref=${userId}`;

    useEffect(() => {
        const fetchReferralData = async () => {
            // Safety check: ensure userId is a valid number
            if (!userId || userId === 0) return;

            try {
                const response = await fetch(`http://localhost/crypto-backend/get_referral_stats.php?user_id=${userId}`);
                const result = await response.json();


                if (result.success) {
                    // This line handles both cases: 
                    // 1. If stats are in result.data
                    // 2. If stats are in the top level of result
                    const source = result.data ? result.data : result;

                    setStats({
                        total_referrals: parseInt(source.total_referrals) || 0,
                        referral_earnings: parseFloat(source.referral_earnings) || 0,
                        referral_list: Array.isArray(source.referral_list) ? source.referral_list : []
                    });
                }
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReferralData();
    }, [userId]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(refLink);
        Swal.fire({ title: 'Link Copied!', icon: 'success', timer: 1500, showConfirmButton: false });
    };

    return (
        <div className="card border-0 shadow-sm rounded-4 mb-4">
            <h6 className="text-uppercase text-muted small fw-bold mt-3 ms-4">Referral Statistics</h6>

            <div className="card-body p-4 row g-3 gy-4">

                <div className='col-md-6'>
                    <div className="row g-0 border rounded-3 overflow-hidden mb-4">
                        <div className="col-6 p-3 bg-light border-end text-center">
                            <div className="text-muted small mb-1"><Users size={14} /> Invited</div>
                            <h4 className="fw-bold mb-0 text-dark">
                                {loading ? "..." : stats.total_referrals}
                            </h4>
                        </div>
                        <div className="col-6 p-3 bg-light text-center">
                            <div className="text-muted small mb-1"><DollarSign size={14} /> Earnings</div>
                            <h4 className="fw-bold mb-0 text-success">
                                ${loading ? "..." : stats.referral_earnings}
                            </h4>
                        </div>
                    </div>

                    <div className="input-group border rounded-pill p-1 ps-3">
                        <input
                            type="text"
                            className="form-control border-0 bg-transparent p-0 small"
                            value={refLink}
                            readOnly
                        />
                        <button className="btn btn-primary rounded-pill px-3 py-1" onClick={copyToClipboard}>
                            <Copy size={14} className="me-1" /> Copy
                        </button>
                    </div>
                </div>

                {/* Referral List Table */}
                <div className="col-md-6">
                    <h6 className="fw-bold small text-muted mb-3">Recent Referrals</h6>
                    {stats.referral_list && stats.referral_list.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-sm align-middle">
                                <thead className="text-muted" style={{ fontSize: '0.75rem' }}>
                                    <tr>
                                        <th>Name</th>
                                        <th>Rank</th>
                                        <th className="text-end">Joined</th>
                                    </tr>
                                </thead>
                                <tbody style={{ fontSize: '0.8rem' }}>
                                    {stats.referral_list.map((ref: any, index: number) => (
                                        <tr key={index}>
                                            <td className="fw-bold">{ref.full_name}</td>
                                            <td><span className="badge bg-light text-dark border">{ref.rank}</span></td>
                                            <td className="text-end text-muted">{new Date(ref.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-3 bg-light rounded-3">
                            <p className="small text-muted mb-0">No referrals yet. Start sharing!</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default ReferralStats;