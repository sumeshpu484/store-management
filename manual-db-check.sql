-- MANUAL DATABASE CHECK AND FIX
-- Copy and paste these queries one by one into your PostgreSQL client

-- 1. Check if the database and table exist
SELECT 'Checking if Users table exists...' as step;
SELECT COUNT(*) as user_count FROM Users;

-- 2. Check specific users
SELECT 'Checking john_doe user...' as step;
SELECT 
    user_name,
    email,
    is_active,
    role_id,
    LENGTH(password_hash) as hash_length,
    LEFT(password_hash, 20) as hash_preview
FROM Users 
WHERE user_name = 'john_doe';

-- 3. If john_doe doesn't exist, check what users DO exist
SELECT 'All existing users...' as step;
SELECT user_name, email, is_active FROM Users ORDER BY user_name;

-- 4. QUICK FIX: Create john_doe user if it doesn't exist
-- (Only run this if the user doesn't exist from step 2)
/*
INSERT INTO Users (user_name, password_hash, email, is_active, role_id, store_id)
VALUES ('john_doe', 
        '$2a$11$vV5KqJhE.vQ8QZDWXhT7F.Kv9dXaE/9R5xzJWcpzJdL.bT.bDCOHO', 
        'john.doe@example.com', 
        TRUE, 
        (SELECT role_id FROM Roles WHERE role_name = 'superadmin'),
        NULL);
*/

-- 5. ALTERNATIVE FIX: Update existing john_doe password
-- (Only run this if the user exists but has wrong password hash)
/*
UPDATE Users 
SET password_hash = '$2a$11$vV5KqJhE.vQ8QZDWXhT7F.Kv9dXaE/9R5xzJWcpzJdL.bT.bDCOHO'
WHERE user_name = 'john_doe';
*/

-- 6. Verify the fix
SELECT 'Verification after fix...' as step;
SELECT 
    user_name,
    email,
    is_active,
    CASE 
        WHEN password_hash = '$2a$11$vV5KqJhE.vQ8QZDWXhT7F.Kv9dXaE/9R5xzJWcpzJdL.bT.bDCOHO' 
        THEN 'Correct (password123)' 
        ELSE 'Wrong hash' 
    END as password_status
FROM Users 
WHERE user_name = 'john_doe';
