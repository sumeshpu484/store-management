using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace StoreApp.Services.Email
{
    public class GmailEmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<GmailEmailService> _logger;
        private readonly string _fromEmail;
        private readonly string _smtpHost;
        private readonly int _smtpPort;
        private readonly string _smtpUser;
        private readonly string _smtpPass;

        public GmailEmailService(IConfiguration configuration, ILogger<GmailEmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
            _fromEmail = configuration["EmailSettings:From"] ?? "yourgmail@gmail.com";
            _smtpHost = configuration["EmailSettings:SmtpHost"] ?? "smtp.gmail.com";
            _smtpPort = int.TryParse(configuration["EmailSettings:SmtpPort"], out var port) ? port : 587;
            _smtpUser = configuration["EmailSettings:SmtpUser"] ?? _fromEmail;
            _smtpPass = configuration["EmailSettings:SmtpPass"] ?? string.Empty;
        }

        public async Task SendPasswordResetAsync(string toEmail, string newPassword, string userEmail)
        {
            var subject = "StoreApp Password Reset";
            var body = $"Hello,\n\nYour password has been reset.\nUser Email: {userEmail}\nNew Password: {newPassword}\n\nPlease change your password after logging in.";
            var message = new MailMessage(_fromEmail, toEmail, subject, body);
            using var client = new SmtpClient(_smtpHost, _smtpPort)
            {
                Credentials = new NetworkCredential(_smtpUser, _smtpPass),
                EnableSsl = true
            };
            try
            {
                await client.SendMailAsync(message);
                _logger.LogInformation($"Password reset email sent to {toEmail} from {_fromEmail}");
            }
            catch (SmtpException ex)
            {
                _logger.LogError(ex, $"Failed to send password reset email to {toEmail}");
                throw;
            }
        }
    }
}
