using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CustomerSupportTicketingSystem.Models
{
    public enum TicketPriority
    {
        Low = 1,
        Medium = 2,
        High = 3
    }

    public enum TicketStatus
    {
        New = 1,
        Assigned = 2,
        InProgress = 3,
        Resolved = 4,
        Closed = 5
    }

    public class Ticket
    {
        [Key]
        public int TicketId { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public TicketPriority Priority  { get; set; }

        [Required]
        public TicketStatus Status { get; set; } = TicketStatus.New;

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public int CreatedBy { get; set; }
        [JsonIgnore]
        public User CreatedByUser { get; set; }

        public int? AssignedTo { get; set; }
        [JsonIgnore]
        public User AssignedToUser { get; set; }

        [JsonIgnore]
        public ICollection<Comment> Comments { get; set; } 
    }
}
