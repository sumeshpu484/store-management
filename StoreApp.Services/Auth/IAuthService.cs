using StoreApp.Model.Auth;

namespace StoreApp.Services.Auth;

public interface IAuthService
{
    Task<AuthResponse?> LoginAsync(LoginRequest request);
    Task<bool> ValidateCredentialsAsync(string username, string password);
}