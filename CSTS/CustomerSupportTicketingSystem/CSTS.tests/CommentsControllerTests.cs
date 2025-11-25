using CustomerSupportTicketingSystem.Controllers;
using CustomerSupportTicketingSystem.DTOs;
using CustomerSupportTicketingSystem.Models;
using CustomerSupportTicketingSystem.Repositories;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CustomerSupportTicketingSystem.Tests
{
    [TestFixture]
    public class CommentsControllerTests
    {
        private Mock<ICommentRepository> _commentRepoMock;
        private CommentsController _controller;

        [SetUp]
        public void Setup()
        {
            _commentRepoMock = new Mock<ICommentRepository>();
            _controller = new CommentsController(_commentRepoMock.Object);
        }

        [Test]
        public async Task Add_ShouldReturnOk_WhenCommentIsAdded()
        {
            var dto = new CreateCommentDTO
            {
                TicketId = 1,
                UserId = 2,
                Message = "This is a test comment"
            };

            var createdComment = new Comment
            {
                CommentId = 1,
                TicketId = dto.TicketId,
                UserId = dto.UserId,
                Message = dto.Message,
                CreatedDate = DateTime.Now
            };

            _commentRepoMock
                .Setup(r => r.AddComment(It.IsAny<Comment>()))
                .ReturnsAsync(createdComment);

            var result = await _controller.Add(dto);

            Assert.That(result, Is.InstanceOf<OkObjectResult>());
            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult?.Value);
        }

        [Test]
        public async Task GetByTicket_ShouldReturnOk_WithCommentsList()
        {
            int ticketId = 1;
            var commentsList = new List<Comment>
            {
                new Comment { CommentId = 1, TicketId = ticketId, UserId = 2, Message = "First comment" },
                new Comment { CommentId = 2, TicketId = ticketId, UserId = 3, Message = "Second comment" }
            };

            _commentRepoMock
                .Setup(r => r.GetCommentsByTicket(ticketId))
                .ReturnsAsync(commentsList);

            var result = await _controller.GetByTicket(ticketId);

            Assert.That(result, Is.InstanceOf<OkObjectResult>());
            var okResult = result as OkObjectResult;
            Assert.IsInstanceOf<List<Comment>>(okResult?.Value);
        }
    }
}
