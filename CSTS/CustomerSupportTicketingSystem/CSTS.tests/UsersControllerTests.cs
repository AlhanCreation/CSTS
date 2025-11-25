using CustomerSupportTicketingSystem.Controllers;
using CustomerSupportTicketingSystem.Models;
using CustomerSupportTicketingSystem.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace CustomerSupportTicketingSystem.Tests
{
    [TestFixture]
    public class UsersControllerTests
    {
        private UsersController _controller;
        private Mock<IUserRepository> _userRepoMock;

        [SetUp]
        public void Setup()
        {
            _userRepoMock = new Mock<IUserRepository>();
            _controller = new UsersController(_userRepoMock.Object);
        }

        [Test]
        public async Task GetAllAgents_ShouldReturnOkWithAgentsList()
        {
            var agents = new List<User>
            {
                new User { UserId = 1, Name = "Agent One", Email = "agent1@test.com", Role = UserRole.Agent },
                new User { UserId = 2, Name = "Agent Two", Email = "agent2@test.com", Role = UserRole.Agent }
            };

            _userRepoMock
                .Setup(r => r.GetUsersByRole("Agent"))
                .ReturnsAsync(agents);

            var result = await _controller.GetAllAgents();

            var okResult = result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);
            Assert.That(okResult.Value, Is.EqualTo(agents));
        }

        [Test]
        public async Task Logout_ShouldReturnOk_WhenUserExistsInToken()
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, "1")
            };

            var identity = new ClaimsIdentity(claims, "mock");
            var user = new ClaimsPrincipal(identity);

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };

            _userRepoMock
                .Setup(r => r.Logout(1))
                .Returns(Task.CompletedTask);

            var result = await _controller.Logout();

            var okResult = result as OkObjectResult;
            Assert.That(okResult, Is.Not.Null);
            Assert.That(okResult.Value, Is.EqualTo("Logged out successfully and user set to inactive."));
        }

        [Test]
        public async Task Logout_ShouldReturnUnauthorized_WhenNoUserClaimFound()
        {
            var identity = new ClaimsIdentity(); 
            var user = new ClaimsPrincipal(identity);

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };

            var result = await _controller.Logout();

            var objectResult = result as ObjectResult;
            Assert.That(objectResult, Is.Not.Null);
            Assert.That(objectResult.StatusCode, Is.EqualTo(401));
            Assert.That(objectResult.Value, Is.EqualTo("User not found in token."));
        }
    }
}
