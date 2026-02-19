import React, { useEffect, useState } from 'react';
import { 
  MoreVertical, 
  Eye, 
  PlusCircle, 
  Trash2, 
  Search, 
  User as UserIcon, 
  DollarSign, 
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

interface UserData {
  id: number;
  full_name: string;
  email: string;
  total_balance: string | number;
  active_investments: string | number;
  created_at: string;
  role: string;
}

const AdminUserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await fetch('https://api.nutcoinonsol.com/crypto-backend/admin/get_all_users.php');
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        console.error("API Error:", data.message);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddBalance = (user: UserData) => {
    MySwal.fire({
      title: `Adjust Balance`,
      text: `Managing balance for ${user.full_name}`,
      input: 'number',
      inputAttributes: { step: '0.01' },
      inputPlaceholder: 'Enter amount (use negative to deduct)',
      showCancelButton: true,
      confirmButtonText: 'Update Balance',
      confirmButtonColor: '#0d6efd',
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          const res = await fetch('https://api.nutcoinonsol.com/crypto-backend/admin/update_user_balance.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: user.id, amount: result.value })
          });
          const data = await res.json();
          if (data.success) {
            MySwal.fire('Updated!', 'The user balance has been adjusted.', 'success');
            fetchUsers();
          }
        } catch (err) {
          MySwal.fire('Error', 'Failed to update balance', 'error');
        }
      }
    });
  };

  const handleDeleteUser = (user: UserData) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: `This will permanently delete ${user.full_name} and all their data!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Yes, delete user'
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Logic for delete_user.php would go here
        MySwal.fire('Deleted!', 'User has been removed.', 'success');
      }
    });
  };

  const filteredUsers = users.filter(u => 
    u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );

  return (
    <div className="container-fluid p-4">
      {/* Header Section */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1">User Management</h2>
          <p className="text-muted mb-0">Monitor and manage all registered platform investors.</p>
        </div>
        
        <div className="position-relative" style={{ minWidth: '300px' }}>
          <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={18} />
          <input 
            type="text" 
            className="form-control ps-5 py-2 border-0 shadow-sm rounded-3" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table Card */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table align-middle mb-0 table-hover">
            <thead className="bg-light">
              <tr className="small text-muted text-uppercase fw-bold">
                <th className="ps-4 py-3">User Profile</th>
                <th className="py-3">Wallet Balance</th>
                <th className="py-3">Active Stakes</th>
                <th className="py-3">Joined Date</th>
                <th className="text-end pe-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center">
                        <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '42px', height: '42px' }}>
                          <UserIcon size={20} />
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{u.full_name}</div>
                          <div className="small text-muted">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center text-dark fw-semibold">
                        <DollarSign size={14} className="text-success me-1" />
                        {Number(u.total_balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center text-primary fw-semibold">
                        <TrendingUp size={14} className="me-1" />
                        ${Number(u.active_investments).toLocaleString()}
                      </div>
                    </td>
                    <td>
                      <span className="text-muted small">
                        {new Date(u.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <div className="dropdown">
                        <button 
                          className="btn btn-link text-muted p-0 border-0" 
                          type="button" 
                          data-bs-toggle="dropdown" 
                          aria-expanded="false"
                        >
                          <MoreVertical size={20} />
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-3 p-2">
                          <li>
                            <button 
                              className="dropdown-item rounded-2 d-flex align-items-center py-2" 
                              onClick={() => navigate(`/admin/user/${u.id}`)}
                            >
                              <Eye size={16} className="me-2 text-primary" /> View Full Profile
                            </button>
                          </li>
                          <li>
                            <button 
                              className="dropdown-item rounded-2 d-flex align-items-center py-2" 
                              onClick={() => handleAddBalance(u)}
                            >
                              <PlusCircle size={16} className="me-2 text-success" /> Adjust Balance
                            </button>
                          </li>
                          <li><hr className="dropdown-divider" /></li>
                          <li>
                            <button 
                              className="dropdown-item rounded-2 d-flex align-items-center py-2 text-danger"
                              onClick={() => handleDeleteUser(u)}
                            >
                              <Trash2 size={16} className="me-2" /> Delete Account
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-5">
                    <div className="text-muted">No users found matching your search.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;