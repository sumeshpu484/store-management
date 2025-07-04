// Test Login Diagnostic Code
// Add this temporary method to your AuthController for debugging

[HttpPost("debug-login")]
public async Task<IActionResult> DebugLogin([FromBody] LoginRequest request)
{
    try
    {
        _logger.LogInformation("Debug login attempt for user: {Username}", request.Username);

        // Step 1: Check if user exists
        var user = await _userRepository.GetUserByUsernameAsync(request.Username);
        if (user == null)
        {
            return Ok(new { 
                success = false, 
                step = "1", 
                message = "User not found in database",
                username = request.Username 
            });
        }

        // Step 2: Check if user is active
        if (!user.IsActive)
        {
            return Ok(new { 
                success = false, 
                step = "2", 
                message = "User exists but is inactive",
                username = request.Username,
                userId = user.UserId
            });
        }

        // Step 3: Check password hash format
        var hashInfo = new {
            length = user.PasswordHash?.Length ?? 0,
            startsWithBCrypt = user.PasswordHash?.StartsWith("$2a$") ?? false,
            preview = user.PasswordHash?.Substring(0, Math.Min(20, user.PasswordHash.Length ?? 0))
        };

        // Step 4: Test BCrypt verification
        bool passwordMatches = false;
        string bcryptError = null;
        try
        {
            passwordMatches = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
        }
        catch (Exception ex)
        {
            bcryptError = ex.Message;
        }

        // Step 5: Return diagnostic info
        return Ok(new {
            success = passwordMatches,
            step = "5",
            message = passwordMatches ? "Login should work" : "Password verification failed",
            diagnostics = new {
                userFound = true,
                userActive = user.IsActive,
                roleId = user.RoleId,
                roleName = user.Role?.RoleName,
                hashInfo = hashInfo,
                passwordMatches = passwordMatches,
                bcryptError = bcryptError,
                providedPassword = request.Password, // Remove this in production!
                expectedPasswordForTest = "password123"
            }
        });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error during debug login for user: {Username}", request.Username);
        return Ok(new { 
            success = false, 
            step = "error", 
            message = ex.Message,
            stackTrace = ex.StackTrace 
        });
    }
}
