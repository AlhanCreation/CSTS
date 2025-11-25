using System.ComponentModel.DataAnnotations;

namespace CustomerSupportTicketingSystem.Models
{
    public enum UserRole
    {
        Admin = 1,
        Agent = 2,
        Customer = 3
    }

    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required]
        public string Name { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        [Required]
        public UserRole Role { get; set; }

        public bool IsActive { get; set; } = true;

        public ICollection<Ticket> CreatedTickets { get; set; }
        public ICollection<Ticket> AssignedTickets { get; set; }
        public ICollection<Comment> Comments { get; set; } 
    }
}
