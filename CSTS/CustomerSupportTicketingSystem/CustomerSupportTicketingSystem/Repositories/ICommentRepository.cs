using CustomerSupportTicketingSystem.Models;

namespace CustomerSupportTicketingSystem.Repositories
{
    public interface ICommentRepository
    {
        Task<Comment> AddComment(Comment comment);
        Task<IEnumerable<Comment>> GetCommentsByTicket(int ticketId);
    }
}
