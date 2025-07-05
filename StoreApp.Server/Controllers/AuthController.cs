using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StoreApp.Model.Auth;
using StoreApp.Services.Auth;
using System.Security.Claims;

namespace StoreApp.Server.Controllers
{
    /// <summary>
    /// Authentication controller for user login, logout, and token management
    /// </summary>
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

        /// <summary>
        /// Authenticate user and return JWT token
        /// </summary>
        /// <param name="request">Login credentials</param>
        /// <returns>Authentication response with JWT token if successful</returns>
        /// <remarks>
        /// **Default Test Credentials (Development Only):**
        /// 
        /// - **Username**: john_doe, **Password**: password123 (Super Admin)
        /// - **Username**: jane_smith, **Password**: password123 (Store Maker)
        /// - **Username**: mike_jones, **Password**: password123 (Store Checker)
        /// 
        /// **Newly Created Store Users:**
        /// When creating a new store, default users are automatically created:
        /// - **Username**: maker_[StoreKey], **Password**: password123 (e.g., maker_STR001)
        /// - **Username**: checker_[StoreKey], **Password**: password123 (e.g., checker_STR001)
        /// 
        /// **Note**: All passwords are securely hashed using BCrypt. Change default passwords in production!
        /// </remarks>
        /// <response code="200">Login successful - returns JWT token and user information</response>
        /// <response code="400">Invalid credentials or validation errors</response>
        /// <response code="500">Internal server error</response>
        [HttpPost("login")]
        [ProducesResponseType(typeof(AuthResponse), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
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

        /// <summary>
        /// Refresh JWT token using a valid refresh token
        /// </summary>
        /// <param name="request">Refresh token request</param>
        /// <returns>New JWT token and refresh token if successful</returns>
        /// <response code="200">Token refresh successful - returns new JWT token and refresh token</response>
        /// <response code="400">Invalid refresh token or validation errors</response>
        /// <response code="500">Internal server error</response>
        [HttpPost("refresh")]
        [ProducesResponseType(typeof(AuthResponse), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
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

        /// <summary>
        /// Logout user and invalidate the token
        /// </summary>
        /// <response code="200">Logout successful</response>
        /// <response code="500">Internal server error</response>
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

        /// <summary>
        /// Change user password
        /// </summary>
        /// <param name="request">Password change request</param>
        /// <returns>Success message if password changed successfully</returns>
        /// <response code="200">Password change successful</response>
        /// <response code="400">Invalid request or current password incorrect</response>
        /// <response code="500">Internal server error</response>
        [HttpPost("change-password")]
        [Authorize]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
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

        /// <summary>
        /// Reset user password (Admin only)
        /// </summary>
        /// <param name="request">Password reset request</param>
        /// <returns>Success message if password reset successfully</returns>
        /// <remarks>
        /// This endpoint allows administrators to reset any user's password.
        /// The new password will be securely hashed using BCrypt before storing.
        /// </remarks>
        /// <response code="200">Password reset successful</response>
        /// <response code="400">Invalid request or user not found</response>
        /// <response code="403">Insufficient permissions</response>
        /// <response code="500">Internal server error</response>
        [HttpPost("reset-password")]
        [Authorize]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(403)]
        [ProducesResponseType(500)]
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

        /// <summary>
        /// Get user profile information
        /// </summary>
        /// <response code="200">User profile retrieved successfully</response>
        /// <response code="401">Unauthorized - invalid token</response>
        /// <response code="404">User not found</response>
        /// <response code="500">Internal server error</response>
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

        /// <summary>
        /// Validate JWT token
        /// </summary>
        /// <response code="200">Token is valid</response>
        /// <response code="401">Unauthorized - invalid token</response>
        /// <response code="500">Internal server error</response>
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
