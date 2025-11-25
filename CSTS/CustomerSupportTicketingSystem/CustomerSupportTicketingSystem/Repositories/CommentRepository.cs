using CustomerSupportTicketingSystem.Models;
using CustomerTicketing.Data;
using Microsoft.EntityFrameworkCore;

namespace CustomerSupportTicketingSystem.Repositories
{
    public class CommentRepository : ICommentRepository
    {
        private readonly AppDbContext _context;
        public CommentRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Comment> AddComment(Comment comment)
        {
            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();
            return comment;
        }

        public async Task<IEnumerable<Comment>> GetCommentsByTicket(int ticketId)
        {
            return await _context.Comments
                .Where(c => c.TicketId == ticketId)
                .ToListAsync();
        }
    }
}
