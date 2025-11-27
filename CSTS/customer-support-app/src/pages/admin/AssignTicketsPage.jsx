
import { useEffect, useState } from "react";
import { toast } from 'react-hot-toast';
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

    try {
      const res = await assignTicket({ ticketId, assignedTo: parseInt(agentId) });
      if (res) {
        toast.success("Ticket assigned successfully!");
        setTickets((prev) =>
          prev.map((t) => (t.ticketId === ticketId ? res : t))
        );
      }
    } catch (err) {
      console.error("Assign error:", err);
      toast.error(err.message || "Failed to assign ticket");
    }
  };



  if (loading) return <p>Loading tickets...</p>;

  return (
    <div className="container mt-4">
      <div className="card border rounded-3 overflow-hidden">
        <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
          <h4 className="mb-0 fw-bold text-primary">
            Assign Tickets to <span className="text-dark">Agent {agentId}</span>
          </h4>
          <div className="d-flex">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
              Back
            </button>
          </div>
        </div>

        <div className="card-body p-0">
          {tickets.filter((t) => t.title.toLowerCase().includes(search.toLowerCase())).length === 0 ? (
            <div className="text-center py-5 text-muted">
              No tickets found matching "{search}"
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
                    <th className="py-3">Assigned To</th>
                    <th className="py-3 text-end pe-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.filter((t) => t.title.toLowerCase().includes(search.toLowerCase())).map((t) => (
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
                      <td>
                        {t.assignedToName ? (
                          <span className="fw-medium text-dark">{t.assignedToName}</span>
                        ) : (
                          <span className="text-muted fst-italic">Unassigned</span>
                        )}
                      </td>
                      <td className="text-end pe-4">
                        <button
                          className={`btn btn-sm ${
                            t.assignedTo === parseInt(agentId) || t.status === "Resolved"
                              ? "btn-secondary"
                              : "btn-success"
                          }`}
                          onClick={() => handleAssign(t.ticketId)}
                          disabled={
                            t.assignedTo === parseInt(agentId) || t.status === "Resolved"
                          }
                        >
                          {t.status === "Resolved"
                            ? "Resolved"
                            : t.assignedTo === parseInt(agentId)
                            ? "Assigned"
                            : t.assignedTo
                            ? "Reassign"
                            : "Assign"}
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

export default AssignTicketsPage;
