using StoreApp.Model.Auth;

namespace StoreApp.Data.Repositories;

public interface IUserRepository
{
    Task<User?> GetUserByUsernameAsync(string username);
    Task<User?> GetUserByEmailAsync(string email);
    Task<User?> GetUserByIdAsync(Guid userId);
    
    /// <summary>
    /// Validates user credentials using BCrypt password verification
    /// </summary>
    /// <param name="username">The username to validate</param>
    /// <param name="password">The plain text password to verify</param>
    /// <returns>User object if credentials are valid and user is active, null otherwise</returns>
    Task<User?> ValidateUserCredentialsAsync(string username, string password);
    
    /// <summary>
    /// Hashes a plain text password using BCrypt with cost factor 11
    /// </summary>
    /// <param name="password">Plain text password to hash</param>
    /// <returns>BCrypt hashed password compatible with database storage</returns>
    string HashPassword(string password);
    
    Task<bool> UpdatePasswordAsync(Guid userId, string newPasswordHash);
    Task<bool> UpdateUserStatusAsync(Guid userId, bool isActive);
    Task<IEnumerable<User>> GetUsersByStoreIdAsync(int storeId);
    Task<User> CreateUserAsync(User user);
    Task<bool> EmailExistsAsync(string email);
    Task<bool> UsernameExistsAsync(string username);
}
