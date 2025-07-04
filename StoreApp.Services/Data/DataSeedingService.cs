using Microsoft.Extensions.Logging;
using StoreApp.Data.Repositories;
using StoreApp.Model.Auth;
using StoreApp.Services.Auth;

namespace StoreApp.Services.Data;

public interface IDataSeedingService
{
    Task SeedDefaultUsersAsync();
}

public class DataSeedingService : IDataSeedingService
{
    private readonly IUserRepository _userRepository;
    private readonly IAuthService _authService;
    private readonly ILogger<DataSeedingService> _logger;

    public DataSeedingService(
        IUserRepository userRepository, 
        IAuthService authService,
        ILogger<DataSeedingService> logger)
    {
        _userRepository = userRepository;
        _authService = authService;
        _logger = logger;
    }

    public async Task SeedDefaultUsersAsync()
    {
        try
        {
            // Check if superadmin user already exists
            var existingAdmin = await _userRepository.GetUserByUsernameAsync("admin");
            if (existingAdmin != null)
            {
                _logger.LogInformation("Default users already exist, skipping seeding");
                return;
            }

            // Create default superadmin user
            var adminUser = new User
            {
                UserId = Guid.NewGuid(),
                UserName = "admin",
                Email = "admin@storemanagement.com",
                PasswordHash = _authService.GeneratePasswordHash("admin123"), // Default password
                IsActive = true,
                RoleId = 1, // Assuming superadmin role has ID 1
                StoreId = null, // Superadmin is not tied to a specific store
                CreatedAt = DateTime.UtcNow
            };

            await _userRepository.CreateUserAsync(adminUser);
            _logger.LogInformation("Created default superadmin user: admin");

            // Create a test store manager user
            var managerUser = new User
            {
                UserId = Guid.NewGuid(),
                UserName = "store_manager",
                Email = "manager@storemanagement.com",
                PasswordHash = _authService.GeneratePasswordHash("manager123"), // Default password
                IsActive = true,
                RoleId = 2, // Assuming store-maker role has ID 2
                StoreId = 1, // Assuming first store has ID 1
                CreatedAt = DateTime.UtcNow
            };

            await _userRepository.CreateUserAsync(managerUser);
            _logger.LogInformation("Created default store manager user: store_manager");

            _logger.LogInformation("Data seeding completed successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during data seeding");
            throw;
        }
    }
}
