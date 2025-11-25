import { useEffect, useState } from 'react';
import { apiFetch } from '../../services/api';

function AgentDashboard() {
  const [tickets, setTickets] = useState([]);

  const fetchTickets = async () => {
    const allTickets = await apiFetch('/tickets', 'GET', null, true);
    const userId = parseInt(localStorage.getItem('userId'));

    const activeTickets = allTickets?.filter(
      (t) =>
        t.assignedTo === userId &&
        t.status !== 'Resolved' &&
        t.status !== 'Closed'
    );

    setTickets(activeTickets || []);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleResolve = async (ticketId) => {
    await apiFetch(`/tickets/${ticketId}/resolve`, 'PUT', null, true);
    alert('✅ Ticket marked as Resolved!');
    fetchTickets();
  };

  return (
    <div className="container mt-4">
      <div className="card border rounded-3 overflow-hidden">
        <div className="card-header bg-white border-bottom py-3">
          <h4 className="mb-0 fw-bold text-primary">Assigned Tickets</h4>
        </div>
        <div className="card-body p-0">
          {tickets.length === 0 ? (
            <div className="text-center py-5 text-muted">
              No active tickets assigned.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-dark text-white">
                  <tr>
                    <th className="py-3 ps-4">Title</th>
                    <th className="py-3">Description</th>
                    <th className="py-3">Priority</th>
                    <th className="py-3">Status</th>
                    <th className="py-3 text-end pe-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t) => (
                    <tr key={t.ticketId}>
                      <td className="fw-medium text-dark ps-4">{t.title}</td>
                      <td className="text-muted small text-truncate" style={{ maxWidth: "200px" }}>
                        {t.description}
                      </td>
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
                      <td className="text-end pe-4">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleResolve(t.ticketId)}
                        >
                          Resolve
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

export default AgentDashboard;
