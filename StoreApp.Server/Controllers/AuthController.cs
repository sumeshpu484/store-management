using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StoreApp.Model.Auth;
using StoreApp.Services.Auth;
using System.Security.Claims;

namespace StoreApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                _logger.LogInformation("Login attempt for user: {Username}", request.Username);

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var response = await _authService.LoginAsync(request);

                if (!response.Success)
                {
                    _logger.LogWarning("Failed login attempt for user: {Username} - {Message}", request.Username, response.Message);
                    return BadRequest(new { message = response.Message });
                }

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
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var response = await _authService.RefreshTokenAsync(request.RefreshToken);

                if (!response.Success)
                {
                    return BadRequest(new { message = response.Message });
                }

                return Ok(response);
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
                var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

                await _authService.LogoutAsync(token);

                _logger.LogInformation("User logged out successfully");
                return Ok(new { message = "Logged out successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during logout");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!Guid.TryParse(userIdClaim, out var userId))
                {
                    return BadRequest(new { message = "Invalid user ID" });
                }

                var success = await _authService.ChangePasswordAsync(userId, request);

                if (!success)
                {
                    return BadRequest(new { message = "Failed to change password. Please check your current password." });
                }

                _logger.LogInformation("Password changed successfully for user: {UserId}", userId);
                return Ok(new { message = "Password changed successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during password change");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPost("reset-password")]
        [Authorize] // In production, this might require admin role
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var success = await _authService.ResetPasswordAsync(request);

                if (!success)
                {
                    return BadRequest(new { message = "Failed to reset password. User not found." });
                }

                _logger.LogInformation("Password reset successfully for user: {UserId}", request.UserId);
                return Ok(new { message = "Password reset successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during password reset");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!Guid.TryParse(userIdClaim, out var userId))
                {
                    return BadRequest(new { message = "Invalid user ID" });
                }

                var userProfile = await _authService.GetUserProfileAsync(userId);

                if (userProfile == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                return Ok(userProfile);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user profile");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("validate")]
        [Authorize]
        public IActionResult ValidateToken()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var usernameClaim = User.FindFirst(ClaimTypes.Name)?.Value;
                var emailClaim = User.FindFirst(ClaimTypes.Email)?.Value;
                var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;

                return Ok(new
                {
                    valid = true,
                    userId = userIdClaim,
                    username = usernameClaim,
                    email = emailClaim,
                    role = roleClaim
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating token");
                return Unauthorized(new { message = "Invalid token" });
            }
        }
    }
}
