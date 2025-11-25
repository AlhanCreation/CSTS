import { useEffect, useState } from 'react';
import { getAllAgents } from '../../services/api';
import { Link, useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAgents = async () => {
      const data = await getAllAgents();
      if (data && Array.isArray(data)) {
        setAgents(data);
      } else {
        console.error('Failed to fetch agents or invalid token.');
      }
      setLoading(false);
    };
    fetchAgents();
  }, []);

  if (loading) return <p>Loading agents...</p>;

  return (
    <div className="container mt-4">
      <div className="card border rounded-3 overflow-hidden">
        <div className="card-header bg-white border-bottom py-3">
          <h4 className="mb-0 fw-bold text-primary">Admin Dashboard</h4>
          <p className="text-muted mb-0 small">Agents List</p>
        </div>
        <div className="card-body p-0">
          {agents.length === 0 ? (
            <div className="text-center py-5 text-muted">
              No agents found.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-dark text-white">
                  <tr>
                    <th className="py-3 ps-4">Agent</th>
                    <th className="py-3">Email</th>
                    <th className="py-3">Status</th>
                    <th className="py-3 text-end pe-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {agents.map((a) => (
                    <tr key={a.userId}>
                      <td className="fw-medium text-dark ps-4">{a.name || '(No Name)'}</td>
                      <td>{a.email}</td>
                      <td>
                        <span
                          className={`badge rounded-pill px-3 py-2 ${
                            a.isActive
                              ? "bg-success-subtle text-success border border-success"
                              : "bg-secondary-subtle text-secondary border border-secondary"
                          }`}
                        >
                          {a.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="text-end pe-4">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => navigate(`/admin/assign/${a.userId}`)}
                        >
                          Assign Tickets
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
