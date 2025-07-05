using BCrypt.Net;
using Npgsql;
using Microsoft.Extensions.Configuration;

await Main();

async Task Main()
{
Console.WriteLine("=== BCRYPT HASH GENERATOR & DATABASE UPDATER ===");
Console.WriteLine("🔧 Using the SAME logic that works for john_doe and testuser");
Console.WriteLine("🎯 Automatically updating ALL users in database");
Console.WriteLine();

string password = "password123";

// Generate BCrypt hash using the SAME parameters that work for john_doe/testuser
// Cost factor 11, BCrypt.Net library with default settings
string hash = BCrypt.Net.BCrypt.HashPassword(password, 11);

Console.WriteLine($"Password: {password}");
Console.WriteLine($"Generated Hash: {hash}");
Console.WriteLine($"Hash Length: {hash.Length}");
Console.WriteLine($"Hash Format: {(hash.StartsWith("$2a$11$") ? "✅ Correct BCrypt Format" : "❌ Invalid Format")}");
Console.WriteLine();

// Verify the hash works using the SAME verification logic
bool isValid = BCrypt.Net.BCrypt.Verify(password, hash);
Console.WriteLine($"Verification Test: {isValid}");
Console.WriteLine();

if (isValid)
{
    Console.WriteLine("✅ HASH IS VALID - SAME AS WORKING USERS!");
    Console.WriteLine();
    
    // Get connection string (you may need to adjust this path)
    string connectionString = "Host=localhost;Database=storemanagement;Username=postgres;Password=your_password";
    
    // Try to read from appsettings.json if available
    try
    {
        var config = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("../StoreApp.Server/appsettings.json", optional: true)
            .Build();
        
        var configConnectionString = config.GetConnectionString("DefaultConnection");
        if (!string.IsNullOrEmpty(configConnectionString))
        {
            connectionString = configConnectionString;
            Console.WriteLine("✅ Using connection string from appsettings.json");
        }
        else
        {
            Console.WriteLine("⚠️ Using default connection string");
        }
    }
    catch
    {
        Console.WriteLine("⚠️ Could not read appsettings.json, using default connection string");
    }
    
    Console.WriteLine("🔄 Connecting to database to update users...");
    Console.WriteLine();
    
    try
    {
        using var connection = new NpgsqlConnection(connectionString);
        await connection.OpenAsync();
        
        Console.WriteLine("✅ Database connection successful!");
        
        // Check current users before update
        Console.WriteLine("\n=== BEFORE UPDATE - CHECKING USERS ===");
        string checkQuery = @"
            SELECT user_name, email, is_active, 
                   LEFT(password_hash, 15) || '...' as hash_preview,
                   LENGTH(password_hash) as hash_length
            FROM Users 
            WHERE user_name IN ('john_doe', 'jane_smith', 'testuser', 'admin', 'manager')
            ORDER BY user_name";
            
        using var checkCmd = new NpgsqlCommand(checkQuery, connection);
        using var reader = await checkCmd.ExecuteReaderAsync();
        
        Console.WriteLine("Current users:");
        while (await reader.ReadAsync())
        {
            Console.WriteLine($"  {reader["user_name"]}: {reader["email"]} | Active: {reader["is_active"]} | Hash: {reader["hash_preview"]} (Length: {reader["hash_length"]})");
        }
        reader.Close();
        
        // Update all users with the new hash
        Console.WriteLine("\n=== UPDATING ALL USERS ===");
        string updateQuery = @"
            UPDATE Users 
            SET password_hash = @hash, is_active = TRUE
            WHERE user_name IN ('john_doe', 'jane_smith', 'testuser', 'admin', 'manager')";
            
        using var updateCmd = new NpgsqlCommand(updateQuery, connection);
        updateCmd.Parameters.AddWithValue("hash", hash);
        
        int updatedRows = await updateCmd.ExecuteNonQueryAsync();
        Console.WriteLine($"✅ Updated {updatedRows} users with new hash");
        
        // Create missing users
        Console.WriteLine("\n=== CREATING MISSING USERS ===");
        var usersToCreate = new[]
        {
            ("jane_smith", "jane.smith@example.com"),
            ("admin", "admin@example.com"),
            ("manager", "manager@example.com")
        };
        
        foreach (var (username, email) in usersToCreate)
        {
            string insertQuery = @"
                INSERT INTO Users (user_id, user_name, password_hash, email, is_active, role_id, store_id, created_at)
                SELECT gen_random_uuid(), @username, @hash, @email, TRUE, 2, NULL, NOW()
                WHERE NOT EXISTS (SELECT 1 FROM Users WHERE user_name = @username)";
                
            using var insertCmd = new NpgsqlCommand(insertQuery, connection);
            insertCmd.Parameters.AddWithValue("username", username);
            insertCmd.Parameters.AddWithValue("hash", hash);
            insertCmd.Parameters.AddWithValue("email", email);
            
            int insertedRows = await insertCmd.ExecuteNonQueryAsync();
            if (insertedRows > 0)
            {
                Console.WriteLine($"✅ Created user: {username}");
            }
            else
            {
                Console.WriteLine($"ℹ️ User already exists: {username}");
            }
        }
        
        // Verify final state
        Console.WriteLine("\n=== AFTER UPDATE - VERIFICATION ===");
        using var finalCmd = new NpgsqlCommand(checkQuery, connection);
        using var finalReader = await finalCmd.ExecuteReaderAsync();
        
        Console.WriteLine("Final user status:");
        while (await finalReader.ReadAsync())
        {
            string status = finalReader["hash_preview"].ToString().StartsWith("$2a$11$") ? "✅ Ready" : "❌ Invalid";
            Console.WriteLine($"  {finalReader["user_name"]}: {finalReader["email"]} | Active: {finalReader["is_active"]} | Status: {status}");
        }
        
        Console.WriteLine("\n🎉 ALL USERS UPDATED SUCCESSFULLY!");
        Console.WriteLine($"🔑 All users can now login with password: {password}");
        
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Database error: {ex.Message}");
        Console.WriteLine("\n=== FALLBACK - SQL COMMANDS ===");
        Console.WriteLine("Run these SQL commands manually in your database:");
        Console.WriteLine($"UPDATE Users SET password_hash = '{hash}', is_active = TRUE WHERE user_name IN ('john_doe', 'jane_smith', 'testuser', 'admin', 'manager');");
    }
else
{
    Console.WriteLine("❌ Hash verification failed!");
    Console.WriteLine("This shouldn't happen with the same logic that works for other users.");
}

Console.WriteLine("\nPress any key to exit...");
Console.ReadKey();
}
