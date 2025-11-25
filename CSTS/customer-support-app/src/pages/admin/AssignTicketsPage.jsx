import { useEffect, useState } from "react";
import { getAllTickets, assignTicket } from "../../services/api";
import { useParams, useNavigate } from "react-router-dom";

function AssignTicketsPage() {
  const { agentId } = useParams();
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      const all = await getAllTickets();
      setTickets(all || []);
      setLoading(false);
    };
    fetchTickets();
  }, []);

  const handleAssign = async (ticketId) => {
    const confirm = window.confirm("Are you sure you want to assign this ticket?");
    if (!confirm) return;

    const res = await assignTicket({ ticketId, assignedTo: parseInt(agentId) });
    if (res) {
      alert("✅ Ticket assigned successfully!");
      const all = await getAllTickets();
      setTickets(all || []);
    }
  };

  const filtered = tickets.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p>Loading tickets...</p>;

  return (
    <div className="container mt-4">
      <h3>Assign Tickets to Agent (ID: {agentId})</h3>

      <div className="d-flex mb-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Search tickets by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="alert alert-info">No tickets found.</div>
      ) : (
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.ticketId}>
                <td>{t.title}</td>
                <td>{t.description}</td>
                <td>{t.priority}</td>
                <td>{t.status}</td>
                <td>{t.assignedTo || "Unassigned"}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleAssign(t.ticketId)}
                  >
                    Assign
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

export default AssignTicketsPage;
