-- Advanced User Password Update Script
-- This script provides more flexible options for updating user passwords

-- =================================================================
-- OPTION 1: Update specific user with a new password
-- =================================================================

-- Function to generate BCrypt hash (you'll need to replace with actual hash)
-- In a real scenario, you'd generate this using your application or a BCrypt tool

-- Example: Update john_doe with a custom password
-- Replace the hash below with the actual BCrypt hash for your desired password
-- UPDATE Users SET password_hash = 'YOUR_BCRYPT_HASH_HERE' WHERE user_name = 'john_doe';

-- =================================================================
-- OPTION 2: Update multiple users with same password (password123)
-- =================================================================

-- Update specific users by username
UPDATE Users 
SET password_hash = '$2a$11$vV5KqJhE.vQ8QZDWXhT7F.Kv9dXaE/9R5xzJWcpzJdL.bT.bDCOHO',
    updated_at = CURRENT_TIMESTAMP  -- Track when password was changed
WHERE user_name IN ('john_doe', 'jane_smith', 'mike_jones', 'sarah_brown', 'david_green');

-- =================================================================
-- OPTION 3: Update users by role
-- =================================================================

-- Update all superadmin users
-- UPDATE Users 
-- SET password_hash = '$2a$11$vV5KqJhE.vQ8QZDWXhT7F.Kv9dXaE/9R5xzJWcpzJdL.bT.bDCOHO'
-- WHERE role_id = (SELECT role_id FROM Roles WHERE role_name = 'superadmin');

-- Update all store-maker users
-- UPDATE Users 
-- SET password_hash = '$2a$11$vV5KqJhE.vQ8QZDWXhT7F.Kv9dXaE/9R5xzJWcpzJdL.bT.bDCOHO'
-- WHERE role_id = (SELECT role_id FROM Roles WHERE role_name = 'store-maker');

-- =================================================================
-- OPTION 4: Update users by store
-- =================================================================

-- Update all users for a specific store
-- UPDATE Users 
-- SET password_hash = '$2a$11$vV5KqJhE.vQ8QZDWXhT7F.Kv9dXaE/9R5xzJWcpzJdL.bT.bDCOHO'
-- WHERE store_id = (SELECT store_id FROM Stores WHERE store_name = 'Main Street Store');

-- =================================================================
-- OPTION 5: Add a new user with proper BCrypt hash
-- =================================================================

-- Insert a new user with proper password hash
-- INSERT INTO Users (user_name, password_hash, email, is_active, role_id, store_id)
-- VALUES ('new_user', 
--         '$2a$11$vV5KqJhE.vQ8QZDWXhT7F.Kv9dXaE/9R5xzJWcpzJdL.bT.bDCOHO', 
--         'newuser@example.com', 
--         TRUE, 
--         (SELECT role_id FROM Roles WHERE role_name = 'store-checker'),
--         (SELECT store_id FROM Stores WHERE store_name = 'Main Street Store'));

-- =================================================================
-- VERIFICATION QUERIES
-- =================================================================

-- Check all users and their password status
SELECT 
    u.user_name,
    u.email,
    r.role_name,
    s.store_name,
    CASE 
        WHEN u.password_hash = '$2a$11$vV5KqJhE.vQ8QZDWXhT7F.Kv9dXaE/9R5xzJWcpzJdL.bT.bDCOHO' 
        THEN 'password123' 
        WHEN u.password_hash LIKE '$2a$%' 
        THEN 'Valid BCrypt Hash (Unknown Password)'
        ELSE 'Invalid Hash (Needs Update)' 
    END as password_status,
    u.is_active,
    u.created_at,
    u.updated_at
FROM Users u
LEFT JOIN Roles r ON u.role_id = r.role_id
LEFT JOIN Stores s ON u.store_id = s.store_id
ORDER BY r.role_name, u.user_name;

-- Count users by password status
SELECT 
    CASE 
        WHEN password_hash = '$2a$11$vV5KqJhE.vQ8QZDWXhT7F.Kv9dXaE/9R5xzJWcpzJdL.bT.bDCOHO' 
        THEN 'password123' 
        WHEN password_hash LIKE '$2a$%' 
        THEN 'Other Valid BCrypt'
        ELSE 'Invalid Hash' 
    END as password_type,
    COUNT(*) as user_count
FROM Users
GROUP BY password_type
ORDER BY user_count DESC;
