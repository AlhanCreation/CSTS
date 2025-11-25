using System.ComponentModel.DataAnnotations;

namespace CustomerSupportTicketingSystem.Models
{
    public class Comment
    {
        [Key]
        public int CommentId { get; set; }

        [Required]
        public string Message { get; set; }

        public DateTime CreatedDate { get; set; }
        
        public int TicketId { get; set; }
        public Ticket Ticket { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }
    }
}
