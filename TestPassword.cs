using BCrypt.Net;
using System;

class PasswordTest
{
    static void Main()
    {
        Console.WriteLine("=== PASSWORD HASH VERIFICATION TEST ===");
        
        // The exact hash from our database
        string databaseHash = "$2a$11$vV5KqJhE.vQ8QZDWXhT7F.Kv9dXaE/9R5xzJWcpzJdL.bT.bDCOHO";
        string password = "password123";
        
        Console.WriteLine($"Testing password: '{password}'");
        Console.WriteLine($"Against database hash: {databaseHash}");
        Console.WriteLine();
        
        // Test the verification
        bool isValid = BCrypt.Verify(password, databaseHash);
        Console.WriteLine($"✅ Verification result: {isValid}");
        
        if (isValid)
        {
            Console.WriteLine("✅ SUCCESS: The database hash is CORRECT for 'password123'");
            Console.WriteLine("The issue must be elsewhere in the authentication flow.");
        }
        else
        {
            Console.WriteLine("❌ FAILURE: The database hash does NOT match 'password123'");
            Console.WriteLine("We need to update the database with a correct hash.");
            
            // Generate a correct hash
            string correctHash = BCrypt.HashPassword(password, 11);
            Console.WriteLine($"Correct hash should be: {correctHash}");
        }
        
        Console.WriteLine("\nPress any key to exit...");
        Console.ReadKey();
    }
}
