using CustomerSupportTicketingSystem.Models;

namespace CustomerSupportTicketingSystem.Repositories
{
    public interface ITicketRepository
    {
        Task<Ticket> CreateTicket(Ticket ticket);
        Task<IEnumerable<Ticket>> GetAllTickets();
        Task<Ticket> GetTicketById(int id);
        Task UpdateTicketStatus(int id, TicketStatus status);
        Task AssignTicket(int ticketId, int agentId);
        Task DeleteTicket(int id);
    }
}
