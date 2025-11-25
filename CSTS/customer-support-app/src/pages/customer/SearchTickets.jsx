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

      {filtered.length === 0 ? (
        <p>No tickets found.</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Created By</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.ticketId}>
                <td>{t.title}</td>
                <td>{t.priority}</td>
                <td>{t.status}</td>
                <td>{t.createdBy}</td>
                <td>
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
      )}
    </div>
  );
}

export default SearchTickets;
