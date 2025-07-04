using BCrypt.Net;

string password = "password123";

// Generate a new BCrypt hash for "password123"
string hash = BCrypt.Net.BCrypt.HashPassword(password, 11);

Console.WriteLine("=== BCRYPT HASH GENERATOR ===");
Console.WriteLine($"Password: {password}");
Console.WriteLine($"Generated Hash: {hash}");
Console.WriteLine();

// Verify the hash works
bool isValid = BCrypt.Net.BCrypt.Verify(password, hash);
Console.WriteLine($"Verification Test: {isValid}");

if (isValid)
{
    Console.WriteLine("✅ HASH IS VALID!");
    Console.WriteLine();
    Console.WriteLine("SQL to update john_doe:");
    Console.WriteLine($"UPDATE Users SET password_hash = '{hash}' WHERE user_name = 'john_doe';");
    Console.WriteLine();
    Console.WriteLine("SQL to update testuser:");
    Console.WriteLine($"UPDATE Users SET password_hash = '{hash}' WHERE user_name = 'testuser';");
    Console.WriteLine();
    Console.WriteLine("SQL to create new test user:");
    Console.WriteLine($"INSERT INTO Users (user_name, password_hash, email, is_active, role_id, store_id)");
    Console.WriteLine($"VALUES ('newtest', '{hash}', 'newtest@example.com', TRUE, 1, NULL);");
}
else
{
    Console.WriteLine("❌ Hash verification failed!");
}

Console.WriteLine("\nPress any key to exit...");
Console.ReadKey();
