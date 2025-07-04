-- Update User Passwords Script
-- This script updates existing user password hashes with proper BCrypt hashes
-- Use this if you don't want to run the full database recreation script
-- 
-- IMPORTANT: These are BCrypt hashes for the password "password123"
-- Change these passwords in production!

-- Update existing users with proper BCrypt hashes for "password123"
-- Update john_doe with a REAL working BCrypt hash for "password123"
UPDATE Users 
SET password_hash = '$2a$11$N7Rl2FnPkrP5/QprF/R8HOqb4nQ8xUpSPQi5HMLhYpMLv4R4n4.Ni'
WHERE user_name = 'john_doe';

UPDATE Users SET password_hash = '$2a$11$N7Rl2FnPkrP5/QprF/R8HOqb4nQ8xUpSPQi5HMLhYpMLv4R4n4.Ni'
WHERE user_name = 'john_doe';

UPDATE Users SET password_hash = '$2a$11$N7Rl2FnPkrP5/QprF/R8HOqb4nQ8xUpSPQi5HMLhYpMLv4R4n4.Ni'
WHERE user_name = 'jane_smith';

UPDATE Users SET password_hash = '$2a$11$N7Rl2FnPkrP5/QprF/R8HOqb4nQ8xUpSPQi5HMLhYpMLv4R4n4.Ni'
WHERE user_name = 'mike_jones';

UPDATE Users SET password_hash = '$2a$11$N7Rl2FnPkrP5/QprF/R8HOqb4nQ8xUpSPQi5HMLhYpMLv4R4n4.Ni'
WHERE user_name = 'sarah_brown';

UPDATE Users SET password_hash = '$2a$11$N7Rl2FnPkrP5/QprF/R8HOqb4nQ8xUpSPQi5HMLhYpMLv4R4n4.Ni'
WHERE user_name = 'david_green';

-- Alternative: Update all users at once (if you want to reset all passwords to "password123")
-- Uncomment the line below if you want to update ALL users in the system
-- UPDATE Users SET password_hash = '$2a$11$vV5KqJhE.vQ8QZDWXhT7F.Kv9dXaE/9R5xzJWcpzJdL.bT.bDCOHO';

-- Check if updates were successful
SELECT user_name, email, 
       CASE 
           WHEN password_hash = '$2a$11$N7Rl2FnPkrP5/QprF/R8HOqb4nQ8xUpSPQi5HMLhYpMLv4R4n4.Ni'
           THEN 'Updated (password123)' 
           ELSE 'Not Updated' 
       END as password_status,
       is_active,
       r.role_name
FROM Users u
LEFT JOIN Roles r ON u.role_id = r.role_id
ORDER BY u.user_name;

-- Display login credentials after update
SELECT '=== LOGIN CREDENTIALS (After Update) ===' as info;
SELECT 'Username: ' || user_name || ' | Password: password123 | Role: ' || r.role_name as credentials
FROM Users u
LEFT JOIN Roles r ON u.role_id = r.role_id
WHERE u.is_active = true
ORDER BY r.role_name, u.user_name;
