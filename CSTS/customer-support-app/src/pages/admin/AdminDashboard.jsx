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
      <h3>Admin Dashboard</h3>
      <p className="text-muted mb-3">Agents List</p>

      {agents.length === 0 ? (
        <div className="alert alert-info">No agents found.</div>
      ) : (
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Agent</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((a) => (
              <tr key={a.userId}>
                <td>{a.name || '(No Name)'}</td>
                <td>{a.email}</td>
                <td>{a.isActive ? 'Active' : 'Inactive'}</td>
                <td>
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
      )}
    </div>
  );
}

export default AdminDashboard;
