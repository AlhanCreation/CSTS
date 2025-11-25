using CustomerSupportTicketingSystem.Controllers;
using CustomerSupportTicketingSystem.DTOs;
using CustomerSupportTicketingSystem.Models;
using CustomerSupportTicketingSystem.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace CustomerSupportTicketingSystem.Tests
{
    [TestFixture]
    public class TicketsControllerTests
    {
        private Mock<ITicketRepository> _ticketRepoMock;
        private Mock<IUserRepository> _userRepoMock;
        private TicketsController _controller;

        [SetUp]
        public void Setup()
        {
            _ticketRepoMock = new Mock<ITicketRepository>();
            _userRepoMock = new Mock<IUserRepository>();
            _controller = new TicketsController(_ticketRepoMock.Object, _userRepoMock.Object);

            var user = new ClaimsPrincipal(new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, "1"),
                new Claim(ClaimTypes.Role, "Customer")
            }, "mock"));

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext { User = user }
            };
        }

        [Test]
        public async Task Create_ShouldReturnOk_WhenValidTicket()
        {
            var dto = new CreateTicketDTO
            {
                Title = "Network Issue",
                Description = "Cannot connect to VPN",
                Priority = "High"
            };

            var createdTicket = new Ticket
            {
                TicketId = 1,
                Title = dto.Title,
                Priority = TicketPriority.High,
                Status = TicketStatus.New,
                CreatedBy = 1
            };

            _ticketRepoMock.Setup(r => r.CreateTicket(It.IsAny<Ticket>()))
                .ReturnsAsync(createdTicket);

            var result = await _controller.Create(dto);

            Assert.That(result, Is.InstanceOf<OkObjectResult>());
        }

        [Test]
        public async Task Create_ShouldReturnBadRequest_WhenInvalidPriority()
        {
            var dto = new CreateTicketDTO
            {
                Title = "Invalid",
                Description = "Bad Priority",
                Priority = "Extreme"
            };

            var result = await _controller.Create(dto);

            Assert.That(result, Is.InstanceOf<BadRequestObjectResult>());
        }

        [Test]
        public async Task GetAll_ShouldReturnOk_WithTicketsList()
        {
            var tickets = new List<Ticket>
            {
                new Ticket { TicketId = 1, Title = "Test 1", Priority = TicketPriority.Low },
                new Ticket { TicketId = 2, Title = "Test 2", Priority = TicketPriority.Medium }
            };

            _ticketRepoMock.Setup(r => r.GetAllTickets()).ReturnsAsync(tickets);

            var result = await _controller.GetAll();

            Assert.That(result, Is.InstanceOf<OkObjectResult>());
        }

        [Test]
        public async Task GetById_ShouldReturnNotFound_WhenTicketDoesNotExist()
        {
            _ticketRepoMock.Setup(r => r.GetTicketById(99)).ReturnsAsync((Ticket?)null);

            var result = await _controller.GetById(99);

            Assert.That(result, Is.InstanceOf<NotFoundObjectResult>());
        }

        [Test]
        public async Task GetById_ShouldReturnOk_WhenTicketExists()
        {
            var ticket = new Ticket { TicketId = 1, Title = "Sample" };
            _ticketRepoMock.Setup(r => r.GetTicketById(1)).ReturnsAsync(ticket);

            var result = await _controller.GetById(1);

            Assert.That(result, Is.InstanceOf<OkObjectResult>());
        }

        [Test]
        public async Task Assign_ShouldReturnOk_WhenAssignmentSucceeds()
        {
            var dto = new AssignTicketDTO { TicketId = 1, AssignedTo = 3 };
            _ticketRepoMock.Setup(r => r.AssignTicket(dto.TicketId, dto.AssignedTo)).Returns(Task.CompletedTask);

            var result = await _controller.Assign(dto);

            Assert.That(result, Is.InstanceOf<OkObjectResult>());
        }

        [Test]
        public async Task MarkInProgress_ShouldReturnOk_WhenAgentIsAssigned()
        {
            var user = new ClaimsPrincipal(new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, "2"),
                new Claim(ClaimTypes.Role, "Agent")
            }, "mock"));
            _controller.ControllerContext.HttpContext = new DefaultHttpContext { User = user };

            var ticket = new Ticket { TicketId = 1, AssignedTo = 2 };
            _ticketRepoMock.Setup(r => r.GetTicketById(1)).ReturnsAsync(ticket);

            var result = await _controller.MarkInProgress(1);

            Assert.That(result, Is.InstanceOf<OkObjectResult>());
        }

        [Test]
        public async Task MarkInProgress_ShouldReturnForbid_WhenAgentNotAssigned()
        {
            var user = new ClaimsPrincipal(new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, "2"),
                new Claim(ClaimTypes.Role, "Agent")
            }, "mock"));
            _controller.ControllerContext.HttpContext = new DefaultHttpContext { User = user };

            var ticket = new Ticket { TicketId = 1, AssignedTo = 99 };
            _ticketRepoMock.Setup(r => r.GetTicketById(1)).ReturnsAsync(ticket);

            var result = await _controller.MarkInProgress(1);

            Assert.That(result, Is.InstanceOf<ForbidResult>());
        }
    }
}
