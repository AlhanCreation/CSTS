import { useEffect, useState } from 'react';
import { apiFetch } from '../../services/api';
import { useNavigate } from 'react-router-dom';

function SearchTickets() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState('');
  const navigate = useNavigate();

  const fetchTickets = async () => {
    const all = await apiFetch('/tickets', 'GET', null, true);
    const userId = parseInt(localStorage.getItem('userId'));
    const others = all?.filter((t) => t.createdBy !== userId);
    setTickets(others || []);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filtered = tickets.filter((t) => {
    const matchesTitle = t.title.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = priority ? t.priority === priority : true;
    return matchesTitle && matchesPriority;
  });

  return (
    <div className="container mt-4">
      <h3>Search Tickets</h3>

      <div className="d-flex mb-3">
        <input
          type="text"
          placeholder="Search by title"
          className="form-control me-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="form-select"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div className="card border rounded-3 overflow-hidden mt-4">
        <div className="card-header bg-white border-bottom py-3">
          <h4 className="mb-0 fw-bold text-primary">Search Tickets</h4>
        </div>
        <div className="card-body p-0">
          {filtered.length === 0 ? (
            <div className="text-center py-5 text-muted">
              No tickets found.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-dark text-white">
                  <tr>
                    <th className="py-3 ps-4">Title</th>
                    <th className="py-3">Priority</th>
                    <th className="py-3">Status</th>
                    <th className="py-3">Created By</th>
                    <th className="py-3 text-end pe-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => (
                    <tr key={t.ticketId}>
                      <td className="fw-medium text-dark ps-4">{t.title}</td>
                      <td>
                        <span
                          className={`badge rounded-pill px-3 py-2 ${
                            t.priority === "High"
                              ? "bg-danger-subtle text-danger border border-danger"
                              : t.priority === "Medium"
                              ? "bg-warning-subtle text-warning-emphasis border border-warning"
                              : "bg-success-subtle text-success border border-success"
                          }`}
                        >
                          {t.priority}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge rounded-pill px-3 py-2 ${
                            t.status === "Resolved"
                              ? "bg-success-subtle text-success border border-success"
                              : t.status === "Open"
                              ? "bg-primary-subtle text-primary border border-primary"
                              : "bg-secondary-subtle text-secondary border border-secondary"
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td>
                        <span className="text-muted">User {t.createdBy}</span>
                      </td>
                      <td className="text-end pe-4">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => navigate(`/customer/tickets/${t.ticketId}/comments`)}
                        >
                          Comment
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

export default SearchTickets;
