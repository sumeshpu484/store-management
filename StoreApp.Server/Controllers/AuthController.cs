using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace StoreApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IConfiguration configuration, ILogger<AuthController> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                _logger.LogInformation("Login attempt for user: {Username}", request.Username);

                // TODO: Replace with actual user validation from database
                var user = await ValidateUserCredentials(request.Username, request.Password);
                
                if (user == null)
                {
                    _logger.LogWarning("Invalid login attempt for user: {Username}", request.Username);
                    return BadRequest(new { message = "Invalid credentials" });
                }

                var token = GenerateJwtToken(user);
                var refreshToken = GenerateRefreshToken();

                var response = new AuthResponse
                {
                    Success = true,
                    Token = token,
                    RefreshToken = refreshToken,
                    ExpiresIn = 3600, // 1 hour
                    User = user,
                    Message = "Login successful"
                };

                _logger.LogInformation("User {Username} logged in successfully", request.Username);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login for user: {Username}", request.Username);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPost("refresh")]
        [Authorize]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            try
            {
                // TODO: Implement refresh token validation logic
                var newToken = GenerateJwtToken(GetUserFromToken());
                
                return Ok(new { token = newToken });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during token refresh");
                return BadRequest(new { message = "Invalid refresh token" });
            }
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            try
            {
                // TODO: Implement token blacklisting or invalidation
                _logger.LogInformation("User logged out successfully");
                return Ok(new { message = "Logged out successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during logout");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        private async Task<User?> ValidateUserCredentials(string username, string password)
        {
            // TODO: Replace with actual database validation
            // This is mock data for development
            var mockUsers = new Dictionary<string, User>
            {
                ["admin"] = new User
                {
                    Id = "1",
                    Username = "admin",
                    Email = "admin@storemanagement.com",
                    Role = "admin",
                    FirstName = "System",
                    LastName = "Administrator",
                    Avatar = "https://ui-avatars.com/api/?name=System+Administrator&background=673ab7&color=fff",
                    Permissions = new[] { "users.read", "users.write", "products.read", "products.write", "orders.read", "orders.write", "reports.read", "settings.write" },
                    Department = "IT Administration"
                },
                ["manager"] = new User
                {
                    Id = "2",
                    Username = "manager",
                    Email = "manager@storemanagement.com",
                    Role = "manager",
                    FirstName = "Store",
                    LastName = "Manager",
                    Avatar = "https://ui-avatars.com/api/?name=Store+Manager&background=2196f3&color=fff",
                    Permissions = new[] { "products.read", "products.write", "orders.read", "orders.write", "reports.read" },
                    Department = "Store Operations"
                }
            };

            if (mockUsers.TryGetValue(username.ToLower(), out var user))
            {
                // In production, use proper password hashing (BCrypt, Argon2, etc.)
                var validPasswords = new Dictionary<string, string>
                {
                    ["admin"] = "admin",
                    ["manager"] = "manager"
                };

                if (validPasswords.TryGetValue(username.ToLower(), out var validPassword) && 
                    password == validPassword)
                {
                    return user;
                }
            }

            return null;
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"] ?? "your-super-secret-key-here-make-it-long-and-complex";
            var issuer = jwtSettings["Issuer"] ?? "StoreManagement";
            var audience = jwtSettings["Audience"] ?? "StoreManagement";

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("firstName", user.FirstName),
                new Claim("lastName", user.LastName),
                new Claim("department", user.Department),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

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

        private User GetUserFromToken()
        {
            // TODO: Extract user information from the current token
            return new User
            {
                Id = "1",
                Username = "admin",
                Email = "admin@storemanagement.com",
                Role = "admin",
                FirstName = "System",
                LastName = "Administrator",
                Avatar = "https://ui-avatars.com/api/?name=System+Administrator&background=673ab7&color=fff",
                Permissions = new[] { "users.read", "users.write", "products.read", "products.write", "orders.read", "orders.write", "reports.read", "settings.write" },
                Department = "IT Administration"
            };
        }
    }

    // DTOs for API communication
    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public bool RememberMe { get; set; }
    }

    public class RefreshTokenRequest
    {
        public string RefreshToken { get; set; } = string.Empty;
    }

    public class AuthResponse
    {
        public bool Success { get; set; }
        public string Token { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public int ExpiresIn { get; set; }
        public User User { get; set; } = new();
        public string Message { get; set; } = string.Empty;
    }

    public class User
    {
        public string Id { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Avatar { get; set; } = string.Empty;
        public string[] Permissions { get; set; } = Array.Empty<string>();
        public string Department { get; set; } = string.Empty;
    }
}
