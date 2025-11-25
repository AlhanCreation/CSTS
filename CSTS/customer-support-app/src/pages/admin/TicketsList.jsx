import { useEffect, useState } from 'react';
import { apiFetch } from '../../services/api';

function TicketsList() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      const data = await apiFetch('tickets');
      setTickets(data || []);
    })();
  }, []);

  const filteredTickets = tickets.filter((t) => {
    const term = search.toLowerCase();
    return (
      t.title.toLowerCase().includes(term) ||
      t.priority.toLowerCase().includes(term) ||
      t.status.toLowerCase().includes(term) ||
      (t.assignedToName && t.assignedToName.toLowerCase().includes(term))
    );
  });

  return (
    <div className="container mt-4">
      <div className="card border rounded-3 overflow-hidden">
        <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
          <h4 className="mb-0 fw-bold text-primary">All Tickets</h4>
          <input
            type="text"
            className="form-control w-25"
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-dark text-white">
                <tr>
                  <th className="py-3 ps-4">Title</th>
                  <th className="py-3">Priority</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Assigned To</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((t) => (
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
                        {t.assignedToName ? (
                          <div className="d-flex align-items-center">
                            <div
                              className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-2"
                              style={{ width: "30px", height: "30px", fontSize: "0.8rem" }}
                            >
                              {t.assignedToName.charAt(0).toUpperCase()}
                            </div>
                            <span className="fw-medium">{t.assignedToName}</span>
                          </div>
                        ) : (
                          <span className="text-muted fst-italic">Unassigned</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-5 text-muted">
                      No tickets found matching "{search}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
export default TicketsList;
