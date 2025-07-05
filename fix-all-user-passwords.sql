-- Fix all users using the SAME BCrypt logic that works for john_doe and testuser
-- Password: password123
-- Using BCrypt.Net with cost factor 11 - SAME as working users

-- Check current status of all users
SELECT 'BEFORE UPDATE - USER STATUS:' as debug_step;
SELECT 
    user_name, 
    email, 
    is_active,
    LEFT(password_hash, 15) || '...' as hash_preview,
    LENGTH(password_hash) as hash_length,
    CASE 
        WHEN password_hash LIKE '$2a$11$%' THEN '✅ Valid BCrypt'
        WHEN password_hash LIKE '$2b$11$%' THEN '✅ Valid BCrypt (2b)'
        ELSE '❌ Invalid Format'
    END as hash_format_status
FROM Users 
WHERE user_name IN ('john_doe', 'jane_smith', 'testuser', 'admin', 'manager')
ORDER BY user_name;

-- Generate a fresh hash using the SAME logic (run HashGenerator first to get this value)
-- Using the verified working hash: $2a$11$.ndNFwUJLmj6MGpxJRjtveo192M0iUsZRrX0m5N9ayvOUUJzNOA7i

-- Update ALL users with the same working hash for consistency
UPDATE Users 
SET password_hash = '$2a$11$.ndNFwUJLmj6MGpxJRjtveo192M0iUsZRrX0m5N9ayvOUUJzNOA7i'
WHERE user_name IN ('john_doe', 'jane_smith', 'testuser', 'admin', 'manager');

-- Ensure ALL users are active
UPDATE Users 
SET is_active = TRUE 
WHERE user_name IN ('john_doe', 'jane_smith', 'testuser', 'admin', 'manager');

-- Create any missing users with the same hash
INSERT INTO Users (user_id, user_name, password_hash, email, is_active, role_id, store_id, created_at)
SELECT 
    gen_random_uuid(),
    missing_user.user_name,
    '$2a$11$.ndNFwUJLmj6MGpxJRjtveo192M0iUsZRrX0m5N9ayvOUUJzNOA7i',
    missing_user.email,
    TRUE,
    2, -- Default role_id
    NULL,
    NOW()
FROM (
    VALUES 
        ('jane_smith', 'jane.smith@example.com'),
        ('admin', 'admin@example.com'),
        ('manager', 'manager@example.com')
) AS missing_user(user_name, email)
WHERE NOT EXISTS (SELECT 1 FROM Users WHERE Users.user_name = missing_user.user_name);

-- Verify the updates
SELECT 'AFTER UPDATE - VERIFICATION:' as debug_step;
SELECT 
    user_name, 
    email, 
    is_active,
    LEFT(password_hash, 15) || '...' as hash_preview,
    LENGTH(password_hash) as hash_length,
    CASE 
        WHEN password_hash LIKE '$2a$11$%' THEN '✅ Ready for Login'
        WHEN password_hash LIKE '$2b$11$%' THEN '✅ Ready for Login (2b)'
        ELSE '❌ Still Invalid'
    END as login_ready_status
FROM Users 
WHERE user_name IN ('john_doe', 'jane_smith', 'testuser', 'admin', 'manager')
ORDER BY user_name;

-- Instructions for use:
-- 1. ✅ HashGenerator program has been run
-- 2. ✅ Generated hash: $2a$11$.ndNFwUJLmj6MGpxJRjtveo192M0iUsZRrX0m5N9ayvOUUJzNOA7i
-- 3. ✅ Hash has been applied to ALL users in this script
-- 4. 🔧 Run this SQL script in your PostgreSQL database
-- 5. 🧪 Test login with ANY username and password: password123
-- 6. 🎯 ALL users (john_doe, jane_smith, testuser, admin, manager) will have the SAME working hash