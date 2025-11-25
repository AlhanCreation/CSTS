namespace CustomerSupportTicketingSystem.DTOs
{
    public class CommentDTO
    {
        public int CommentId { get; set; }
        public int TicketId { get; set; }
        public int UserId { get; set; }
        public string Message { get; set; }
    }
}
