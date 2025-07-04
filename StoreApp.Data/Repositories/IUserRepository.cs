using StoreApp.Model.Auth;

namespace StoreApp.Data.Repositories;

public interface IUserRepository
{
    Task<User?> GetUserByUsernameAsync(string username);
    Task<User?> GetUserByEmailAsync(string email);
    Task<User?> GetUserByIdAsync(Guid userId);
    Task<User?> ValidateUserCredentialsAsync(string username, string password);
    Task<bool> UpdatePasswordAsync(Guid userId, string newPasswordHash);
    Task<bool> UpdateUserStatusAsync(Guid userId, bool isActive);
    Task<IEnumerable<User>> GetUsersByStoreIdAsync(int storeId);
    Task<User> CreateUserAsync(User user);
    Task<bool> EmailExistsAsync(string email);
    Task<bool> UsernameExistsAsync(string username);
}
