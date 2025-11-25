import { useEffect, useState } from 'react';
import { createTicket, getAllTickets, apiFetch } from '../../services/api';

function CustomerDashboard() {
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'Low'
  });

  const fetchTickets = async () => {
    const all = await getAllTickets();
    const userId = parseInt(localStorage.getItem('userId'));
    const myTickets = all?.filter((t) => t.createdBy === userId);
    setTickets(myTickets || []);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!newTicket.title.trim() || !newTicket.description.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const res = await createTicket(newTicket);
    if (res) {
      alert('Ticket created successfully!');
      setNewTicket({ title: '', description: '', priority: 'Low' });
      fetchTickets();
    }
  };

  const closeTicket = async (ticketId) => {
    const confirmClose = window.confirm('Are you sure you want to close this ticket?');
    if (!confirmClose) return;

    await apiFetch(`/tickets/${ticketId}/close`, 'PUT', null, true);
    alert('✅ Ticket closed successfully!');
    fetchTickets();
  };

  return (
    <div className="container mt-4">
      <h3>Create New Ticket</h3>

      <form className="mb-4" onSubmit={handleCreate}>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Title"
          value={newTicket.title}
          onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
        />
        <textarea
          className="form-control mb-2"
          placeholder="Description"
          rows="3"
          value={newTicket.description}
          onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
        ></textarea>
        <select
          className="form-select mb-3"
          value={newTicket.priority}
          onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button className="btn btn-dark w-100" type="submit">
          Create Ticket
        </button>
      </form>

      <hr />

      <div className="card border rounded-3 overflow-hidden mt-4">
        <div className="card-header bg-white border-bottom py-3">
          <h4 className="mb-0 fw-bold text-primary">My Tickets</h4>
        </div>
        <div className="card-body p-0">
          {tickets.length === 0 ? (
            <div className="text-center py-5 text-muted">
              No tickets created yet.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-dark text-white">
                  <tr>
                    <th className="py-3 ps-4">Title</th>
                    <th className="py-3">Priority</th>
                    <th className="py-3">Status</th>
                    <th className="py-3">Assigned To</th>
                    <th className="py-3 text-end pe-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t) => {
                    const isResolved =
                      typeof t.status === 'string' &&
                      t.status.toLowerCase() === 'resolved';
                    return (
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
                          {t.assignedTo ? (
                            <span className="fw-medium text-dark">Agent {t.assignedTo}</span>
                          ) : (
                            <span className="text-muted fst-italic">Unassigned</span>
                          )}
                        </td>
                        <td className="text-end pe-4">
                          {isResolved ? (
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => closeTicket(t.ticketId)}
                            >
                              Close
                            </button>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;
