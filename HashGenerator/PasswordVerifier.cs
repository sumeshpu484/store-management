using BCrypt.Net;
using System;

class Program
{
    static void Main()
    {
        string password = "password123";
        
        // Generate a new hash with cost 11 (same as used in database)
        string newHash = BCrypt.HashPassword(password, 11);
        Console.WriteLine($"New hash: {newHash}");
        
        // Test the existing hash from database
        string existingHash = "$2a$11$vV5KqJhE.vQ8QZDWXhT7F.Kv9dXaE/9R5xzJWcpzJdL.bT.bDCOHO";
        bool verifyExisting = BCrypt.Verify(password, existingHash);
        Console.WriteLine($"Existing hash verification for 'password123': {verifyExisting}");
        
        // Test verification with new hash
        bool verifyNew = BCrypt.Verify(password, newHash);
        Console.WriteLine($"New hash verification for 'password123': {verifyNew}");
    }
}
