using Dapper;
using Microsoft.Extensions.Configuration;
using Npgsql;
using StoreApp.Model.Auth;

namespace StoreApp.Data.Repositories;

public class UserRepository : IUserRepository
{
    private readonly string _connectionString;

    public UserRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection") 
            ?? throw new ArgumentException("Connection string 'DefaultConnection' not found.");
    }

    public async Task<User?> GetUserByUsernameAsync(string username)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        
        const string sql = @"
            SELECT u.user_id as UserId, u.user_name as UserName, u.password_hash as PasswordHash, 
                   u.email as Email, u.is_active as IsActive, u.role_id as RoleId, 
                   u.store_id as StoreId, u.created_at as CreatedAt,
                   r.role_id as RoleId, r.role_name as RoleName, r.is_active as IsActive,
                   s.store_id as StoreId, s.store_name as StoreName, s.address as Address,
                   s.city as City, s.state as State, s.zip_code as ZipCode, s.email as Email,
                   s.is_active as IsActive, s.created_at as CreatedAt
            FROM Users u
            LEFT JOIN Roles r ON u.role_id = r.role_id
            LEFT JOIN Stores s ON u.store_id = s.store_id
            WHERE u.user_name = @Username AND u.is_active = true";

        var userDictionary = new Dictionary<Guid, User>();

        var users = await connection.QueryAsync<User, Role?, Store?, User>(
            sql,
            (user, role, store) =>
            {
                if (!userDictionary.TryGetValue(user.UserId, out var userEntry))
                {
                    userEntry = user;
                    userEntry.Role = role;
                    userEntry.Store = store;
                    userDictionary.Add(userEntry.UserId, userEntry);
                }
                return userEntry;
            },
            new { Username = username },
            splitOn: "RoleId,StoreId"
        );

        return users.FirstOrDefault();
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        
        const string sql = @"
            SELECT u.user_id as UserId, u.user_name as UserName, u.password_hash as PasswordHash, 
                   u.email as Email, u.is_active as IsActive, u.role_id as RoleId, 
                   u.store_id as StoreId, u.created_at as CreatedAt,
                   r.role_id as RoleId, r.role_name as RoleName, r.is_active as IsActive,
                   s.store_id as StoreId, s.store_name as StoreName, s.address as Address,
                   s.city as City, s.state as State, s.zip_code as ZipCode, s.email as Email,
                   s.is_active as IsActive, s.created_at as CreatedAt
            FROM Users u
            LEFT JOIN Roles r ON u.role_id = r.role_id
            LEFT JOIN Stores s ON u.store_id = s.store_id
            WHERE u.email = @Email AND u.is_active = true";

        var userDictionary = new Dictionary<Guid, User>();

        var users = await connection.QueryAsync<User, Role?, Store?, User>(
            sql,
            (user, role, store) =>
            {
                if (!userDictionary.TryGetValue(user.UserId, out var userEntry))
                {
                    userEntry = user;
                    userEntry.Role = role;
                    userEntry.Store = store;
                    userDictionary.Add(userEntry.UserId, userEntry);
                }
                return userEntry;
            },
            new { Email = email },
            splitOn: "RoleId,StoreId"
        );

        return users.FirstOrDefault();
    }

    public async Task<User?> GetUserByIdAsync(Guid userId)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        
        const string sql = @"
            SELECT u.user_id as UserId, u.user_name as UserName, u.password_hash as PasswordHash, 
                   u.email as Email, u.is_active as IsActive, u.role_id as RoleId, 
                   u.store_id as StoreId, u.created_at as CreatedAt,
                   r.role_id as RoleId, r.role_name as RoleName, r.is_active as IsActive,
                   s.store_id as StoreId, s.store_name as StoreName, s.address as Address,
                   s.city as City, s.state as State, s.zip_code as ZipCode, s.email as Email,
                   s.is_active as IsActive, s.created_at as CreatedAt
            FROM Users u
            LEFT JOIN Roles r ON u.role_id = r.role_id
            LEFT JOIN Stores s ON u.store_id = s.store_id
            WHERE u.user_id = @UserId";

        var userDictionary = new Dictionary<Guid, User>();

        var users = await connection.QueryAsync<User, Role?, Store?, User>(
            sql,
            (user, role, store) =>
            {
                if (!userDictionary.TryGetValue(user.UserId, out var userEntry))
                {
                    userEntry = user;
                    userEntry.Role = role;
                    userEntry.Store = store;
                    userDictionary.Add(userEntry.UserId, userEntry);
                }
                return userEntry;
            },
            new { UserId = userId },
            splitOn: "RoleId,StoreId"
        );

        return users.FirstOrDefault();
    }

    public async Task<User?> ValidateUserCredentialsAsync(string username, string password)
    {
        var user = await GetUserByUsernameAsync(username);
        if (user == null)
        {
            Console.WriteLine($"[DEBUG] ValidateUserCredentials: User '{username}' not found");
            return null;
        }
        
        if (!user.IsActive)
        {
            Console.WriteLine($"[DEBUG] ValidateUserCredentials: User '{username}' is inactive");
            return null;
        }
        
        try
        {
            Console.WriteLine($"[DEBUG] ValidateUserCredentials: Attempting to verify password for user '{username}'");
            Console.WriteLine($"[DEBUG] Password hash starts with: {user.PasswordHash.Substring(0, Math.Min(15, user.PasswordHash.Length))}...");
            
            // Try BCrypt.Net verification first (handles both .NET generated and PostgreSQL crypt generated BCrypt hashes)
            var passwordVerified = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
            
            if (!passwordVerified)
            {
                Console.WriteLine($"[DEBUG] ValidateUserCredentials: Password verification failed for user '{username}'");
                return null; // Return null when password is WRONG
            }
            
            Console.WriteLine($"[DEBUG] ValidateUserCredentials: Password verification successful for user '{username}'");
            return user; // Return user when password is CORRECT
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[ERROR] ValidateUserCredentials: Exception during password verification for user '{username}': {ex.Message}");
            return null;
        }
    }

    public async Task<bool> UpdatePasswordAsync(Guid userId, string newPasswordHash)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        
        const string sql = @"
            UPDATE Users 
            SET password_hash = @PasswordHash 
            WHERE user_id = @UserId";

        var rowsAffected = await connection.ExecuteAsync(sql, new 
        { 
            PasswordHash = newPasswordHash, 
            UserId = userId 
        });

        return rowsAffected > 0;
    }

    public async Task<bool> UpdateUserStatusAsync(Guid userId, bool isActive)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        
        const string sql = @"
            UPDATE Users 
            SET is_active = @IsActive 
            WHERE user_id = @UserId";

        var rowsAffected = await connection.ExecuteAsync(sql, new 
        { 
            IsActive = isActive, 
            UserId = userId 
        });

        return rowsAffected > 0;
    }

    public async Task<IEnumerable<User>> GetUsersByStoreIdAsync(int storeId)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        
        const string sql = @"
            SELECT u.user_id as UserId, u.user_name as UserName, u.password_hash as PasswordHash, 
                   u.email as Email, u.is_active as IsActive, u.role_id as RoleId, 
                   u.store_id as StoreId, u.created_at as CreatedAt,
                   r.role_id as RoleId, r.role_name as RoleName, r.is_active as IsActive,
                   s.store_id as StoreId, s.store_name as StoreName, s.address as Address,
                   s.city as City, s.state as State, s.zip_code as ZipCode, s.email as Email,
                   s.is_active as IsActive, s.created_at as CreatedAt
            FROM Users u
            LEFT JOIN Roles r ON u.role_id = r.role_id
            LEFT JOIN Stores s ON u.store_id = s.store_id
            WHERE u.store_id = @StoreId
            ORDER BY u.user_name";

        var userDictionary = new Dictionary<Guid, User>();

        var users = await connection.QueryAsync<User, Role?, Store?, User>(
            sql,
            (user, role, store) =>
            {
                if (!userDictionary.TryGetValue(user.UserId, out var userEntry))
                {
                    userEntry = user;
                    userEntry.Role = role;
                    userEntry.Store = store;
                    userDictionary.Add(userEntry.UserId, userEntry);
                }
                return userEntry;
            },
            new { StoreId = storeId },
            splitOn: "RoleId,StoreId"
        );

        return users.Distinct();
    }

    /// <summary>
    /// Hashes a plain text password using BCrypt
    /// </summary>
    /// <param name="password">Plain text password</param>
    /// <returns>BCrypt hashed password</returns>
    public string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password, 11);
    }

    public async Task<User> CreateUserAsync(User user)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        
        const string sql = @"
            INSERT INTO Users (user_id, user_name, password_hash, email, is_active, role_id, store_id, created_at)
            VALUES (@UserId, @UserName, @PasswordHash, @Email, @IsActive, @RoleId, @StoreId, @CreatedAt)
            RETURNING user_id as UserId, user_name as UserName, password_hash as PasswordHash, 
                      email as Email, is_active as IsActive, role_id as RoleId, 
                      store_id as StoreId, created_at as CreatedAt";

        // Generate new GUID if not provided
        if (user.UserId == Guid.Empty)
            user.UserId = Guid.NewGuid();

        if (user.CreatedAt == DateTime.MinValue)
            user.CreatedAt = DateTime.UtcNow;

        var createdUser = await connection.QuerySingleAsync<User>(sql, user);
        return createdUser;
    }

    public async Task<bool> EmailExistsAsync(string email)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        
        const string sql = "SELECT COUNT(1) FROM Users WHERE email = @Email";
        
        var count = await connection.ExecuteScalarAsync<int>(sql, new { Email = email });
        return count > 0;
    }

    public async Task<bool> UsernameExistsAsync(string username)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        
        const string sql = "SELECT COUNT(1) FROM Users WHERE user_name = @Username";
        
        var count = await connection.ExecuteScalarAsync<int>(sql, new { Username = username });
        return count > 0;
    }
}
