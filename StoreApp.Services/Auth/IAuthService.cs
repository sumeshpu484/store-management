using StoreApp.Model.Auth;

namespace StoreApp.Services.Auth;

public interface IAuthService
{
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<AuthResponse> RefreshTokenAsync(string refreshToken);
    Task<bool> LogoutAsync(string token);
    Task<bool> ChangePasswordAsync(Guid userId, ChangePasswordRequest request);
    Task<bool> ResetPasswordAsync(ResetPasswordRequest request);
    Task<UserDto?> GetUserProfileAsync(Guid userId);
    string GeneratePasswordHash(string password);
    bool VerifyPassword(string password, string hash);
}
