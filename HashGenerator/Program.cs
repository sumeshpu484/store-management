using BCrypt.Net;

Console.WriteLine("=== BCRYPT HASH GENERATOR - STORE MANAGEMENT ===");
Console.WriteLine("🔧 Using the SAME logic that works for john_doe and testuser");
Console.WriteLine("🎯 Fixing jane_smith login issue");
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
    
    Console.WriteLine("=== SQL UPDATES FOR ALL USERS ===");
    Console.WriteLine("-- Fix jane_smith with working hash:");
    Console.WriteLine($"UPDATE Users SET password_hash = '{hash}' WHERE user_name = 'jane_smith';");
    Console.WriteLine();
    
    Console.WriteLine("-- Update john_doe (currently working):");
    Console.WriteLine($"UPDATE Users SET password_hash = '{hash}' WHERE user_name = 'john_doe';");
    Console.WriteLine();
    
    Console.WriteLine("-- Update testuser (currently working):");
    Console.WriteLine($"UPDATE Users SET password_hash = '{hash}' WHERE user_name = 'testuser';");
    Console.WriteLine();
    
    Console.WriteLine("-- Update all users at once:");
    Console.WriteLine($"UPDATE Users SET password_hash = '{hash}' WHERE user_name IN ('john_doe', 'jane_smith', 'testuser', 'admin', 'manager');");
    Console.WriteLine();
    
    Console.WriteLine("=== VERIFICATION QUERIES ===");
    Console.WriteLine("-- Check jane_smith after update:");
    Console.WriteLine("SELECT user_name, email, is_active, LEFT(password_hash, 15) || '...' as hash_preview FROM Users WHERE user_name = 'jane_smith';");
    Console.WriteLine();
    
    Console.WriteLine("-- Check all test users:");
    Console.WriteLine("SELECT user_name, email, is_active, LEFT(password_hash, 15) || '...' as hash_preview FROM Users WHERE user_name IN ('john_doe', 'jane_smith', 'testuser');");
}
else
{
    Console.WriteLine("❌ Hash verification failed!");
    Console.WriteLine("This shouldn't happen with the same logic that works for other users.");
}

Console.WriteLine("\nPress any key to exit...");
Console.ReadKey();
