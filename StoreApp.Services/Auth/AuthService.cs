using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using StoreApp.Data.Repositories;
using StoreApp.Model.Auth;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace StoreApp.Services.Auth;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;
    private readonly Dictionary<string, string> _refreshTokens = new(); // In production, use Redis or database

    public AuthService(IUserRepository userRepository, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _configuration = configuration;
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        Console.WriteLine($"[DEBUG] AuthService.LoginAsync called with username: {request.Username}, password: {request.Password}");
        
        var user = await _userRepository.ValidateUserCredentialsAsync(request.Username, request.Password);
        
        Console.WriteLine($"[DEBUG] ValidateUserCredentialsAsync returned: {(user == null ? "null" : "user object")}");
        
        if (user == null)
        {
            Console.WriteLine($"[DEBUG] Returning login failure - user validation failed");
            return new AuthResponse
            {
                Success = false,
                Message = "Invalid username or password"
            };
        }

        if (!user.IsActive)
        {
            Console.WriteLine($"[DEBUG] Returning login failure - user is inactive");
            return new AuthResponse
            {
                Success = false,
                Message = "User account is inactive"
            };
        }

        Console.WriteLine($"[DEBUG] User validation successful, generating tokens");
        var token = GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken();
        
        // Store refresh token (in production, use a more persistent storage)
        _refreshTokens[refreshToken] = user.UserId.ToString();

        Console.WriteLine($"[DEBUG] Returning successful login response");
        return new AuthResponse
        {
            Success = true,
            Token = token,
            RefreshToken = refreshToken,
            ExpiresIn = 3600, // 1 hour
            User = MapToUserDto(user),
            Message = "Login successful"
        };
    }

    public async Task<AuthResponse> RefreshTokenAsync(string refreshToken)
    {
        if (!_refreshTokens.TryGetValue(refreshToken, out var userIdString) ||
            !Guid.TryParse(userIdString, out var userId))
        {
            return new AuthResponse
            {
                Success = false,
                Message = "Invalid refresh token"
            };
        }

        var user = await _userRepository.GetUserByIdAsync(userId);
        if (user == null || !user.IsActive)
        {
            _refreshTokens.Remove(refreshToken); // Clean up invalid token
            return new AuthResponse
            {
                Success = false,
                Message = "User not found or inactive"
            };
        }

        var newToken = GenerateJwtToken(user);
        var newRefreshToken = GenerateRefreshToken();
        
        // Replace old refresh token with new one
        _refreshTokens.Remove(refreshToken);
        _refreshTokens[newRefreshToken] = user.UserId.ToString();

        return new AuthResponse
        {
            Success = true,
            Token = newToken,
            RefreshToken = newRefreshToken,
            ExpiresIn = 3600,
            User = MapToUserDto(user),
            Message = "Token refreshed successfully"
        };
    }

    public async Task<bool> LogoutAsync(string token)
    {
        // In production, implement token blacklisting
        // For now, just remove any associated refresh tokens
        var tokenHandler = new JwtSecurityTokenHandler();
        
        try
        {
            var jsonToken = tokenHandler.ReadJwtToken(token);
            var userIdClaim = jsonToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub);
            
            if (userIdClaim != null)
            {
                // Remove all refresh tokens for this user
                var keysToRemove = _refreshTokens.Where(kvp => kvp.Value == userIdClaim.Value).Select(kvp => kvp.Key).ToList();
                foreach (var key in keysToRemove)
                {
                    _refreshTokens.Remove(key);
                }
            }
            
            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> ChangePasswordAsync(Guid userId, ChangePasswordRequest request)
    {
        var user = await _userRepository.GetUserByIdAsync(userId);
        if (user == null || !user.IsActive)
            return false;

        // Verify current password
        if (!VerifyPassword(request.CurrentPassword, user.PasswordHash))
            return false;

        // Hash new password
        var newPasswordHash = GeneratePasswordHash(request.NewPassword);
        
        return await _userRepository.UpdatePasswordAsync(userId, newPasswordHash);
    }

    public async Task<bool> ResetPasswordAsync(ResetPasswordRequest request)
    {
        var user = await _userRepository.GetUserByIdAsync(request.UserId);
        if (user == null)
            return false;

        var newPasswordHash = GeneratePasswordHash(request.NewPassword);
        
        return await _userRepository.UpdatePasswordAsync(request.UserId, newPasswordHash);
    }

    public async Task<UserDto?> GetUserProfileAsync(Guid userId)
    {
        var user = await _userRepository.GetUserByIdAsync(userId);
        return user == null ? null : MapToUserDto(user);
    }

    public string GeneratePasswordHash(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    public bool VerifyPassword(string password, string hash)
    {
        return BCrypt.Net.BCrypt.Verify(password, hash);
    }

    private string GenerateJwtToken(User user)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var secretKey = jwtSettings["SecretKey"] ?? "your-super-secret-key-here-make-it-long-and-complex-for-production-use";
        var issuer = jwtSettings["Issuer"] ?? "StoreManagement";
        var audience = jwtSettings["Audience"] ?? "StoreManagement";

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.UserId.ToString()),
            new(JwtRegisteredClaimNames.UniqueName, user.UserName),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Role, user.Role?.RoleName ?? "user"),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        // Add store-specific claims if user is associated with a store
        if (user.StoreId.HasValue && user.Store != null)
        {
            claims.Add(new Claim("store_id", user.StoreId.Value.ToString()));
            claims.Add(new Claim("store_name", user.Store.StoreName));
        }

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private string GenerateRefreshToken()
    {
        return Guid.NewGuid().ToString();
    }

    private UserDto MapToUserDto(User user)
    {
        var names = ExtractFirstLastName(user.UserName);
        
        return new UserDto
        {
            Id = user.UserId.ToString(),
            Username = user.UserName,
            Email = user.Email,
            Role = user.Role?.RoleName ?? "user",
            FirstName = names.FirstName,
            LastName = names.LastName,
            Avatar = GenerateAvatarUrl(names.FirstName, names.LastName),
            Permissions = GetPermissionsForRole(user.Role?.RoleName ?? "user"),
            Department = GetDepartmentForRole(user.Role?.RoleName ?? "user"),
            StoreName = user.Store?.StoreName,
            StoreId = user.StoreId,
            IsActive = user.IsActive
        };
    }

    private (string FirstName, string LastName) ExtractFirstLastName(string username)
    {
        // Simple logic to extract names from username
        // In production, you might want to store first_name and last_name separately
        var parts = username.Split('_', '.', '-');
        
        return parts.Length >= 2 
            ? (char.ToUpper(parts[0][0]) + parts[0][1..], char.ToUpper(parts[1][0]) + parts[1][1..])
            : (char.ToUpper(username[0]) + username[1..], "");
    }

    private string GenerateAvatarUrl(string firstName, string lastName)
    {
        var name = $"{firstName}+{lastName}".Replace(" ", "+");
        var color = GetColorForRole();
        return $"https://ui-avatars.com/api/?name={name}&background={color}&color=fff";
    }

    private string GetColorForRole()
    {
        // Different colors for different roles
        return "673ab7"; // Default purple
    }

    private string[] GetPermissionsForRole(string roleName)
    {
        return roleName.ToLower() switch
        {
            "superadmin" => new[] { "users.read", "users.write", "stores.read", "stores.write", "products.read", "products.write", "reports.read", "settings.write" },
            "store-maker" => new[] { "products.read", "products.write", "inventory.read", "inventory.write" },
            "store-checker" => new[] { "products.read", "inventory.read", "reports.read" },
            "warehouse-maker" => new[] { "inventory.read", "inventory.write", "products.read" },
            "warehouse-checker" => new[] { "inventory.read", "products.read", "reports.read" },
            _ => new[] { "basic.read" }
        };
    }

    private string GetDepartmentForRole(string roleName)
    {
        return roleName.ToLower() switch
        {
            "superadmin" => "IT Administration",
            "store-maker" => "Store Operations",
            "store-checker" => "Store Operations",
            "warehouse-maker" => "Warehouse Operations", 
            "warehouse-checker" => "Warehouse Operations",
            _ => "General"
        };
    }
}
