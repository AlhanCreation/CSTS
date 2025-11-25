using CustomerSupportTicketingSystem.Models;
using CustomerTicketing.Data;
using Microsoft.EntityFrameworkCore;

namespace CustomerSupportTicketingSystem.Repositories
{
    public class TicketRepository : ITicketRepository
    {
        private readonly AppDbContext _context;
        public TicketRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Ticket> CreateTicket(Ticket ticket)
        {
            ticket.Status = TicketStatus.New; 
            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();
            return ticket;
        }

        public async Task<IEnumerable<Ticket>> GetAllTickets()
        {
            return await _context.Tickets
                .Include(t => t.CreatedByUser)
                .Include(t => t.AssignedToUser)
                .Include(t => t.Comments)
                .ToListAsync();
        }

        public async Task<Ticket> GetTicketById(int id)
        {
            return await _context.Tickets
                .Include(t => t.CreatedByUser)
                .Include(t => t.AssignedToUser)
                .Include(t => t.Comments)
                .FirstOrDefaultAsync(t => t.TicketId == id);
        }

        public async Task UpdateTicketStatus(int id, TicketStatus status)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket != null)
            {
                ticket.Status = status;
                await _context.SaveChangesAsync();
            }
        }

        public async Task AssignTicket(int ticketId, int agentId)
        {
            var ticket = await _context.Tickets.FindAsync(ticketId);
            if (ticket == null)
                throw new Exception("Ticket not found");

            var agent = await _context.Users.FirstOrDefaultAsync(u => u.UserId == agentId);
            if (agent == null || agent.Role.ToString() != "Agent")
                throw new Exception("Cannot assign — user is not an Agent");

            ticket.AssignedTo = agentId;
            ticket.Status = TicketStatus.Assigned; 
            await _context.SaveChangesAsync();
        }

        public async Task DeleteTicket(int id)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket != null)
            {
                _context.Tickets.Remove(ticket);
                await _context.SaveChangesAsync();
            }
        }
    }
}
