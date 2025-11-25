import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getComments, addComment } from '../../services/api';

function TicketCommentsPage() {
  const { ticketId } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const navigate = useNavigate();

  const fetchComments = async () => {
    const data = await getComments(ticketId);
    setComments(data || []);
  };

  useEffect(() => {
    fetchComments();
  }, [ticketId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return alert('Enter a comment.');

    const userId = parseInt(localStorage.getItem('userId'));
    const data = {
      ticketId: parseInt(ticketId),
      userId,
      message: newComment,
    };

    const res = await addComment(ticketId, data);
    if (res) {
      alert('Comment added!');
      setNewComment('');
      fetchComments();
    }
  };

  return (
    <div className="container mt-4">
      <h3>Comments for Ticket #{ticketId}</h3>

      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        Back
      </button>

      <form className="mb-4" onSubmit={handleAddComment}>
        <textarea
          className="form-control mb-2"
          rows="3"
          placeholder="Write your comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        ></textarea>
        <button className="btn btn-dark" type="submit">
          Add Comment
        </button>
      </form>

      <h5>Existing Comments</h5>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul className="list-group">
          {comments.map((c) => (
            <li key={c.commentId} className="list-group-item">
              <strong>Customer {c.userId}:</strong> {c.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TicketCommentsPage;
