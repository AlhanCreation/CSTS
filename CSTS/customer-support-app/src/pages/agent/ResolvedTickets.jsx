import { useEffect, useState } from 'react';
import { apiFetch } from '../../services/api';

function ResolvedTickets() {
  const [tickets, setTickets] = useState([]);

  const fetchResolvedTickets = async () => {
    const allTickets = await apiFetch('/tickets', 'GET', null, true);
    const userId = parseInt(localStorage.getItem('userId'));

    const resolved = allTickets?.filter(
      (t) =>
        t.assignedTo === userId &&
        (t.status === 'Resolved' || t.status === 'Closed')
    );

    setTickets(resolved || []);
  };

  useEffect(() => {
    fetchResolvedTickets();
  }, []);

  return (
    <div className="container mt-4">
      <h3>Resolved / Closed Tickets</h3>
      {tickets.length === 0 ? (
        <p>No resolved tickets found.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.ticketId}>
                <td>{t.title}</td>
                <td>{t.description}</td>
                <td>{t.priority}</td>
                <td>{t.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ResolvedTickets;
