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

      <h3>My Tickets</h3>
      {tickets.length === 0 ? (
        <p>No tickets created yet.</p>
      ) : (
        <table className="table table-hover mt-3">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => {
              const isResolved =
                typeof t.status === 'string' &&
                t.status.toLowerCase() === 'resolved';
              return (
                <tr key={t.ticketId}>
                  <td>{t.title}</td>
                  <td>{t.priority}</td>
                  <td>{t.status}</td>
                  <td>{t.assignedTo || 'Unassigned'}</td>
                  <td>
                    {isResolved ? (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => closeTicket(t.ticketId)}
                      >
                        Close
                      </button>
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CustomerDashboard;
