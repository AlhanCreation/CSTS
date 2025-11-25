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
      <h3>Assigned Tickets</h3>
      {tickets.length === 0 ? (
        <p>No active tickets assigned.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.ticketId}>
                <td>{t.title}</td>
                <td>{t.description}</td>
                <td>{t.priority}</td>
                <td>{t.status}</td>
                <td>
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
      )}
    </div>
  );
}

export default AgentDashboard;
