using System.Threading.Tasks;

namespace StoreApp.Services.Email
{
    public interface IEmailService
    {
        Task SendPasswordResetAsync(string toEmail, string newPassword, string userEmail);
    }
}
