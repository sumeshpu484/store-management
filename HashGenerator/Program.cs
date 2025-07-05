using BCrypt.Net;
using Npgsql;
using Microsoft.Extensions.Configuration;

await Main();

async Task Main()
{
Console.WriteLine("=== GENERATING CORRECT PASSWORD HASH ===");

string password = "password123";

// Generate a correct BCrypt hash 
string correctHash = BCrypt.Net.BCrypt.HashPassword(password, 11);
Console.WriteLine($"Password: {password}");
Console.WriteLine($"Correct Hash: {correctHash}");
Console.WriteLine();

// Verify it works
bool isValid = BCrypt.Net.BCrypt.Verify(password, correctHash);
Console.WriteLine($"✅ Verification: {isValid}");
Console.WriteLine();

if (isValid)
{
    Console.WriteLine("✅ GENERATED CORRECT HASH!");
    Console.WriteLine("This hash should replace the incorrect one in database scripts.");
    Console.WriteLine();
    Console.WriteLine("SQL Commands to fix existing users:");
    Console.WriteLine($"UPDATE Users SET password_hash = '{correctHash}' WHERE password_hash = '$2a$11$vV5KqJhE.vQ8QZDWXhT7F.Kv9dXaE/9R5xzJWcpzJdL.bT.bDCOHO';");
}

Console.WriteLine("\nPress any key to exit...");
Console.ReadKey();
}
