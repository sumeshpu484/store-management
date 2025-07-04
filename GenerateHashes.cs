using System;
using BCrypt.Net;

Console.WriteLine("Generating BCrypt hashes for default passwords:");
Console.WriteLine();

string[] passwords = { "password123", "admin123", "manager123", "maker123", "checker123" };

foreach (var password in passwords)
{
    var hash = BCrypt.Net.BCrypt.HashPassword(password);
    Console.WriteLine($"Password: {password}");
    Console.WriteLine($"Hash: {hash}");
    Console.WriteLine($"Verify: {BCrypt.Net.BCrypt.Verify(password, hash)}");
    Console.WriteLine();
}
