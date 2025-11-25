using CustomerSupportTicketingSystem.DTOs;
using CustomerSupportTicketingSystem.Models;
using CustomerSupportTicketingSystem.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CustomerSupportTicketingSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketsController : ControllerBase
    {
        private readonly ITicketRepository _ticketRepo;
        private readonly IUserRepository _userRepo;

        public TicketsController(ITicketRepository ticketRepo, IUserRepository userRepo)
        {
            _ticketRepo = ticketRepo;
            _userRepo = userRepo;
        }

        [Authorize(Roles = "Customer")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTicketDTO dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

            if (!Enum.TryParse<TicketPriority>(dto.Priority, true, out var parsedPriority))
                return BadRequest("Invalid priority value. Allowed: Low, Medium, High");

            var ticket = new Ticket
            {
                Title = dto.Title,
                Description = dto.Description,
                Priority = parsedPriority,
                Status = TicketStatus.New,
                CreatedBy = userId
            };

            var created = await _ticketRepo.CreateTicket(ticket);

            return Ok(new
            {
                Message = "Ticket created successfully",
                created.TicketId,
                created.Title,
                created.Priority,
                created.Status,
                created.CreatedBy
            });
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var tickets = await _ticketRepo.GetAllTickets();
            var result = tickets.Select(t => new TicketResponseDTO
            {
                TicketId = t.TicketId,
                Title = t.Title,
                Description = t.Description,
                Priority = t.Priority.ToString(),
                Status = t.Status.ToString(),
                CreatedBy = t.CreatedBy,
                AssignedTo = t.AssignedTo,
                CreatedDate = t.CreatedDate
            });
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var ticket = await _ticketRepo.GetTicketById(id);
            if (ticket == null)
                return NotFound("Ticket not found");

            return Ok(ticket);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("assign")]
        public async Task<IActionResult> Assign([FromBody] AssignTicketDTO dto)
        {
            await _ticketRepo.AssignTicket(dto.TicketId, dto.AssignedTo);
            return Ok("Ticket assigned successfully to agent");
        }

        [Authorize(Roles = "Agent")]
        [HttpPut("{id}/progress")]
        public async Task<IActionResult> MarkInProgress(int id)
        {
            var agentId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

            var ticket = await _ticketRepo.GetTicketById(id);
            if (ticket == null)
                return NotFound("Ticket not found");

            if (ticket.AssignedTo != agentId)
                return Forbid("You are not assigned to this ticket.");

            await _ticketRepo.UpdateTicketStatus(id, TicketStatus.InProgress);
            return Ok("Ticket status updated to In Progress");
        }

        [Authorize(Roles = "Agent")]
        [HttpPut("{id}/resolve")]
        public async Task<IActionResult> MarkResolved(int id)
        {
            var agentId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

            var ticket = await _ticketRepo.GetTicketById(id);
            if (ticket == null)
                return NotFound("Ticket not found");

            if (ticket.AssignedTo != agentId)
                return Forbid("You are not assigned to this ticket.");

            await _ticketRepo.UpdateTicketStatus(id, TicketStatus.Resolved);
            return Ok("Ticket status updated to Resolved");
        }

        [Authorize(Roles = "Customer")]
        [HttpPut("{id}/close")]
        public async Task<IActionResult> CloseTicket(int id)
        {
            var customerId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

            var ticket = await _ticketRepo.GetTicketById(id);
            if (ticket == null)
                return NotFound("Ticket not found");

            if (ticket.CreatedBy != customerId)
                return Forbid("You can only close tickets that you created.");

            if (ticket.Status != TicketStatus.Resolved)
                return BadRequest("Ticket must be resolved before it can be closed.");

            await _ticketRepo.UpdateTicketStatus(id, TicketStatus.Closed);
            return Ok("Ticket closed successfully");
        }

        [Authorize(Roles = "Customer")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var customerId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

            var ticket = await _ticketRepo.GetTicketById(id);
            if (ticket == null)
                return NotFound("Ticket not found");

            if (ticket.CreatedBy != customerId)
                return Forbid("You can only delete tickets that you created.");

            await _ticketRepo.DeleteTicket(id);
            return Ok("Ticket deleted successfully");
        }
    }
}
