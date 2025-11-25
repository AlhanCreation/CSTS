using CustomerSupportTicketingSystem.Controllers;
using CustomerSupportTicketingSystem.DTOs;
using CustomerSupportTicketingSystem.Helpers;
using CustomerSupportTicketingSystem.Models;
using CustomerSupportTicketingSystem.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Moq;
using NUnit.Framework;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CustomerSupportTicketingSystem.Tests
{
    [TestFixture]
    public class AuthControllerTests
    {
        private Mock<IUserRepository> _userRepoMock;
        private JwtService _jwtService;
        private AuthController _controller;

        [SetUp]
        public void Setup()
        {
            _userRepoMock = new Mock<IUserRepository>();

            // Create a fake config for JwtService
            var inMemorySettings = new Dictionary<string, string>
            {
                { "Jwt:Key", "xYu9Nq4!sVr@j7KzLd8#Wh2pBmA&EfQz" },
                { "Jwt:Issuer", "TestIssuer" },
                { "Jwt:Audience", "TestAudience" }
            };

            IConfiguration config = new ConfigurationBuilder()
                .AddInMemoryCollection(inMemorySettings)
                .Build();

            _jwtService = new JwtService(config);
            _controller = new AuthController(_userRepoMock.Object, _jwtService);
        }

        [Test]
        public async Task Register_ShouldReturnOk_WhenUserIsNew()
        {
            var dto = new RegisterDTO
            {
                Name = "kunal",
                Email = "test@email.com",
                PasswordHash = "user@123",
                Role = "Customer"
            };

            _userRepoMock.Setup(r => r.GetByEmail(dto.Email)).ReturnsAsync((User?)null);
            _userRepoMock.Setup(r => r.Register(It.IsAny<User>())).ReturnsAsync(new User { UserId = 1, Email = dto.Email });

            var result = await _controller.Register(dto);

            Assert.That(result, Is.InstanceOf<OkObjectResult>());
        }

        [Test]
        public async Task Register_ShouldReturnConflict_WhenEmailAlreadyExists()
        {
            var dto = new RegisterDTO
            {
                Name = "Existing",
                Email = "exist@email.com",
                PasswordHash = "pass",
                Role = "Customer"
            };

            _userRepoMock.Setup(r => r.GetByEmail(dto.Email)).ReturnsAsync(new User { Email = dto.Email });

            var result = await _controller.Register(dto);

            Assert.That(result, Is.InstanceOf<ConflictObjectResult>());
        }

        [Test]
        public async Task Login_ShouldReturnOk_WithValidCredentials()
        {
            var dto = new LoginDTO { Email = "test@email.com", PasswordHash = "user@123" };

            var user = new User
            {
                UserId = 1,
                Name = "kunal",
                Email = dto.Email,
                PasswordHash =  dto.PasswordHash,
                Role = UserRole.Customer
            };

            _userRepoMock.Setup(r => r.Login(dto.Email, dto.PasswordHash)).ReturnsAsync(user);

            var result = await _controller.Login(dto);

            Assert.That(result, Is.InstanceOf<OkObjectResult>());
        }

        [Test]
        public async Task Login_ShouldReturnUnauthorized_WhenInvalidCredentials()
        {
            var dto = new LoginDTO { Email = "wrong@email.com", PasswordHash = "wrong" };

            _userRepoMock.Setup(r => r.Login(dto.Email, dto.PasswordHash)).ReturnsAsync((User?)null);

            var result = await _controller.Login(dto);

            Assert.That(result, Is.InstanceOf<UnauthorizedObjectResult>());
        }
    }
}
