using System;
using BCrypt.Net;

class Program
{
    static void Main()
    {
        string password = "password123";
        
        // Generate a new BCrypt hash for "password123"
        string hash = BCrypt.HashPassword(password, 11);
        
        Console.WriteLine("=== BCRYPT HASH GENERATOR ===");
        Console.WriteLine($"Password: {password}");
        Console.WriteLine($"Generated Hash: {hash}");
        Console.WriteLine();
        
        // Verify the hash works
        bool isValid = BCrypt.Verify(password, hash);
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
        }
        else
        {
            Console.WriteLine("❌ Hash verification failed!");
        }
        
        Console.WriteLine("\nPress any key to exit...");
        Console.ReadKey();
    }
}
