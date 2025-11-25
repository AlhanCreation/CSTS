using CustomerSupportTicketingSystem.Models;

namespace CustomerSupportTicketingSystem.Repositories
{
    public interface IUserRepository
    {
        Task<User> Register(User user);
        Task<User?> Login(string email, string password);
        Task<User?> GetByEmail(string email);
        Task<IEnumerable<User>> GetUsersByRole(string role);
        Task<User?> GetUserById(int id);
        Task Logout(int userId);
    }
}
