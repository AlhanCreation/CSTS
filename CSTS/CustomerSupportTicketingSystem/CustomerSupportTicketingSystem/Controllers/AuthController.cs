using CustomerSupportTicketingSystem.DTOs;
using CustomerSupportTicketingSystem.Models;
using CustomerSupportTicketingSystem.Repositories;
using CustomerSupportTicketingSystem.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace CustomerSupportTicketingSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepo;
        private readonly JwtService _jwtService;

        public AuthController(IUserRepository userRepo, JwtService jwtService)
        {
            _userRepo = userRepo;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingUser = await _userRepo.GetByEmail(dto.Email);
            if (existingUser != null)
                return Conflict("Email already registered");

            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                PasswordHash = dto.PasswordHash, 
                Role = Enum.TryParse<UserRole>(dto.Role, true, out var parsedRole) ? parsedRole : UserRole.Customer
            };

            var created = await _userRepo.Register(user);
            return Ok(new { message = "User registered successfully", user = created });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userRepo.Login(dto.Email, dto.PasswordHash);
            if (user == null)
                return Unauthorized(new { message = "Invalid credentials" });

            var token = _jwtService.GenerateToken(user);

            return Ok(new
            {
                token,
                user = new
                {
                    user.UserId,
                    user.Name,
                    user.Email,
                    Role = user.Role.ToString()
                }
            });
        }
    }
}
