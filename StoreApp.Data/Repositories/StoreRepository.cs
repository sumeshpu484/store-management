using Dapper;
using Microsoft.Extensions.Configuration;
using Npgsql;
using StoreApp.Model.Store;

namespace StoreApp.Data.Repositories;

public class StoreRepository : IStoreRepository
{
    private readonly string _connectionString;

    public StoreRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection") 
            ?? throw new ArgumentNullException("DefaultConnection string is missing in configuration");
    }

    public async Task<CreateStoreResponse> CreateStoreAsync(CreateStoreRequest request)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();

        var sql = @"
            SELECT * FROM create_store_with_users(
                @StoreName, 
                @Address, 
                @City, 
                @State, 
                @ZipCode, 
                @StoreEmail,
                @Phone,
                @StoreKey
            );
            
            SELECT role_id FROM roles WHERE role_name = 'store-maker';
            SELECT role_id FROM roles WHERE role_name = 'store-checker';";

        using var multi = await connection.QueryMultipleAsync(sql, new
        {
            request.StoreName,
            request.Address,
            request.City,
            request.State,
            request.ZipCode,
            request.StoreEmail,
            request.Phone,
            request.StoreKey
        });

        var storeId = await multi.ReadFirstAsync<int>();
        var storeMakerRoleId = await multi.ReadFirstAsync<int>();
        var storeCheckerRoleId = await multi.ReadFirstAsync<int>();

        return new CreateStoreResponse
        {
            StoreId = storeId,
            StoreMakerRoleId = storeMakerRoleId,
            StoreCheckerRoleId = storeCheckerRoleId,
            StoreName = request.StoreName,
            StoreMakerEmail = $"{request.StoreName.ToLower().Replace(" ", "")}_maker@example.com",
            StoreCheckerEmail = $"{request.StoreName.ToLower().Replace(" ", "")}_checker@example.com",
            Message = $"Store '{request.StoreName}' created successfully with ID {storeId}"
        };
    }

    public async Task<IEnumerable<StoreListItem>> GetAllStoresAsync()
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();
        var sql = @"
            SELECT 
                store_id AS StoreId, 
                store_name AS StoreName, 
                address AS Address, 
                city AS City, 
                state AS State, 
                zip_code AS ZipCode, 
                email AS StoreEmail, 
                phone AS Phone, 
                store_key AS StoreKey, 
                is_active AS IsActive, 
                created_at AS CreatedAt, 
                updated_at AS UpdatedAt 
            FROM stores 
            ORDER BY store_id;";
        var stores = await connection.QueryAsync<StoreListItem>(sql);
        return stores;
    }

    public async Task<StoreListItem?> GetStoreByIdAsync(int storeId)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();
        var sql = @"
            SELECT 
                store_id AS StoreId, 
                store_name AS StoreName, 
                address AS Address, 
                city AS City, 
                state AS State, 
                zip_code AS ZipCode, 
                email AS StoreEmail, 
                phone AS Phone, 
                store_key AS StoreKey, 
                is_active AS IsActive, 
                created_at AS CreatedAt, 
                updated_at AS UpdatedAt 
            FROM stores 
            WHERE store_id = @StoreId;";
        var store = await connection.QueryFirstOrDefaultAsync<StoreListItem>(sql, new { StoreId = storeId });
        return store;
    }

    public async Task<StoreListItem?> UpdateStoreAsync(int storeId, UpdateStoreRequest request)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();
        
        var updateSql = @"
            UPDATE stores 
            SET store_name = @StoreName,
                address = @Address,
                city = @City,
                state = @State,
                zip_code = @ZipCode,
                email = @StoreEmail,
                phone = @Phone,
                store_key = @StoreKey,
                is_active = @IsActive,
                updated_at = CURRENT_TIMESTAMP
            WHERE store_id = @StoreId;";

        var rowsAffected = await connection.ExecuteAsync(updateSql, new
        {
            StoreId = storeId,
            request.StoreName,
            request.Address,
            request.City,
            request.State,
            request.ZipCode,
            request.StoreEmail,
            request.Phone,
            request.StoreKey,
            request.IsActive
        });

        if (rowsAffected == 0)
            return null; // Store not found

        // Return the updated store
        return await GetStoreByIdAsync(storeId);
    }

    public async Task<CreateStoreUserResponse> CreateStoreUserAsync(CreateStoreUserRequest request)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();
        var sql = @"INSERT INTO users (user_id, user_name, password_hash, email, is_active, role_id, store_id, created_at)
                    VALUES (gen_random_uuid(), @UserName, @PasswordHash, @Email, @IsActive, @RoleId, @StoreId, CURRENT_TIMESTAMP)
                    RETURNING user_id, user_name, email, is_active, role_id, store_id, created_at;";
        var result = await connection.QuerySingleAsync<CreateStoreUserResponse>(sql, new
        {
            request.UserName,
            request.PasswordHash,
            request.Email,
            request.IsActive,
            request.RoleId,
            request.StoreId
        });
        result.Message = $"User '{result.UserName}' created successfully.";
        return result;
    }

    public async Task<IEnumerable<StoreUserListItem>> GetAllUsersAsync()
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();
        var sql = @"
            SELECT 
                u.user_id AS UserId, 
                u.user_name AS UserName, 
                u.email, 
                u.is_active AS IsActive, 
                u.role_id AS RoleId,
                r.role_name AS RoleName, 
                u.store_id AS StoreId,
                s.store_name AS StoreName, 
                u.created_at AS CreatedAt 
            FROM users u
            LEFT JOIN roles r ON u.role_id = r.role_id
            LEFT JOIN stores s ON u.store_id = s.store_id
            ORDER BY u.created_at DESC;";
        var users = await connection.QueryAsync<StoreUserListItem>(sql);
        return users;
    }

    public async Task<IEnumerable<StoreUserListItem>> GetUsersByStoreIdAsync(int storeId)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();
        var sql = @"SELECT u.user_id AS UserId, u.user_name AS UserName, u.email, u.is_active AS IsActive, u.role_id AS RoleId, u.store_id AS StoreId, u.created_at AS CreatedAt,
                        r.role_name AS RoleName, s.store_name AS StoreName
                    FROM users u
                    LEFT JOIN roles r ON u.role_id = r.role_id
                    LEFT JOIN stores s ON u.store_id = s.store_id
                    WHERE u.store_id = @StoreId
                    ORDER BY u.created_at DESC;";
        var users = await connection.QueryAsync<StoreUserListItem>(sql, new { StoreId = storeId });
        return users;
    }

    public async Task<BlockUserResponse> BlockUserAsync(BlockUserRequest request)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();
        var sql = @"UPDATE users SET is_active = FALSE WHERE user_id = @UserId RETURNING user_id;";
        var userId = await connection.ExecuteScalarAsync<Guid?>(sql, new { request.UserId });
        if (userId.HasValue)
        {
            return new BlockUserResponse
            {
                UserId = userId.Value,
                Success = true,
                Message = $"User {userId.Value} has been blocked."
            };
        }
        else
        {
            return new BlockUserResponse
            {
                UserId = request.UserId,
                Success = false,
                Message = "User not found or already blocked."
            };
        }
    }

    public async Task<BlockStoreResponse> BlockStoreAsync(BlockStoreRequest request)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();
        var sql = @"UPDATE stores SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE store_id = @StoreId RETURNING store_id;";
        var storeId = await connection.ExecuteScalarAsync<int?>(sql, new { request.StoreId });
        if (storeId.HasValue)
        {
            return new BlockStoreResponse
            {
                StoreId = storeId.Value,
                Success = true,
                Message = $"Store {storeId.Value} has been blocked."
            };
        }
        else
        {
            return new BlockStoreResponse
            {
                StoreId = request.StoreId,
                Success = false,
                Message = "Store not found or already blocked."
            };
        }
    }

    public async Task<PasswordResetResponse> PasswordResetAsync(PasswordResetRequest request)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();
        // Generate a new random password (for demo, 8 chars alphanumeric)
        var newPassword = Guid.NewGuid().ToString("N").Substring(0, 8);
        var newPasswordHash = newPassword; // TODO: Hash the password in production
        // Update the password in the database and get user/store info
        var sql = @"
            UPDATE users SET password_hash = @NewPasswordHash WHERE user_id = @UserId RETURNING user_id, email, store_id;
        ";
        var user = await connection.QueryFirstOrDefaultAsync<(Guid UserId, string Email, int? StoreId)>(sql, new { UserId = request.UserId, NewPasswordHash = newPasswordHash });
        if (user.UserId == Guid.Empty)
        {
            return new PasswordResetResponse
            {
                UserId = request.UserId,
                Success = false,
                Message = "User not found."
            };
        }
        // Get the store email
        string storeEmail = string.Empty;
        if (user.StoreId.HasValue)
        {
            storeEmail = await connection.ExecuteScalarAsync<string>("SELECT email FROM stores WHERE store_id = @StoreId", new { StoreId = user.StoreId });
        }
        return new PasswordResetResponse
        {
            UserId = user.UserId,
            Email = user.Email,
            StoreEmail = storeEmail,
            NewPassword = newPassword,
            Success = true,
            Message = "Password reset successfully."
        };
    }

    public async Task<UnblockUserResponse> UnblockUserAsync(UnblockUserRequest request)
    {
        using var connection = new NpgsqlConnection(_connectionString);
        await connection.OpenAsync();
        var sql = @"UPDATE users SET is_active = TRUE WHERE user_id = @UserId RETURNING user_id;";
        var userId = await connection.ExecuteScalarAsync<Guid?>(sql, new { request.UserId });
        if (userId.HasValue)
        {
            return new UnblockUserResponse
            {
                UserId = userId.Value,
                Success = true,
                Message = $"User {userId.Value} has been unblocked."
            };
        }
        else
        {
            return new UnblockUserResponse
            {
                UserId = request.UserId,
                Success = false,
                Message = "User not found or already unblocked."
            };
        }
    }
}