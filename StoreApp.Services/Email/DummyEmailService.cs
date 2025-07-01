using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace StoreApp.Services.Email
{
    public class DummyEmailService : IEmailService
    {
        private readonly string _fromEmail;
        private readonly ILogger<DummyEmailService> _logger;

        public DummyEmailService(IConfiguration configuration, ILogger<DummyEmailService> logger)
        {
            _fromEmail = configuration["EmailSettings:From"] ?? "dummy@localhost";
            _logger = logger;
        }

        public Task SendPasswordResetAsync(string toEmail, string newPassword, string userEmail)
        {
            // Log the email sending for demonstration
            _logger.LogInformation($"Sending password reset email from {_fromEmail} to {toEmail}. User email: {userEmail}, New password: {newPassword}");
            // In production, send the actual email here
            return Task.CompletedTask;
        }
    }
}
