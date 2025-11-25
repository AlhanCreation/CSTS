using CustomerSupportTicketingSystem.DTOs;
using CustomerSupportTicketingSystem.Models;
using CustomerSupportTicketingSystem.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CustomerSupportTicketingSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly ICommentRepository _commentRepo;

        public CommentsController(ICommentRepository commentRepo)
        {
            _commentRepo = commentRepo;
        }

        [Authorize(Roles = "Customer")]
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] CreateCommentDTO dto)
        {
            var comment = new Comment
            {
                TicketId = dto.TicketId,
                UserId = dto.UserId,
                Message = dto.Message,
                CreatedDate = DateTime.Now
            };

            var created = await _commentRepo.AddComment(comment);
            return Ok(created);
        }

        [HttpGet("{ticketId}")]
        public async Task<IActionResult> GetByTicket(int ticketId)
        {
            var comments = await _commentRepo.GetCommentsByTicket(ticketId);
            return Ok(comments);
        }
    }
}
