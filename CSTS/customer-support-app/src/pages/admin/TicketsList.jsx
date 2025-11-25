import { useEffect, useState } from 'react';
import { apiFetch } from '../../services/api';

function TicketsList() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await apiFetch('tickets');
      setTickets(data || []);
    })();
  }, []);

  return (
    <div>
      <h3>All Tickets</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Assigned To</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(t => (
            <tr key={t.ticketId}>
              <td>{t.title}</td>
              <td>{t.priority}</td>
              <td>{t.status}</td>
              <td>{t.assignedTo || 'Unassigned'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default TicketsList;
