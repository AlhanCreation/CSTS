namespace CustomerSupportTicketingSystem.DTOs
{
    public class TicketResponseDTO
    {
        public int TicketId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Priority { get; set; }
        public string Status { get; set; }
        public int CreatedBy { get; set; }
        public int? AssignedTo { get; set; }
        public string AssignedToName { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
