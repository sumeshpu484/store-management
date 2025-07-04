-- Debug Login Issue Script
-- Run this to diagnose why login is failing

-- =================================================================
-- 1. CHECK IF USERS EXIST IN DATABASE
-- =================================================================

SELECT 'Step 1: Check if users exist' as debug_step;
SELECT 
    user_name,
    email,
    is_active,
    role_id,
    LEFT(password_hash, 20) || '...' as password_hash_preview
FROM Users 
WHERE user_name IN ('john_doe', 'admin')
ORDER BY user_name;

-- =================================================================
-- 2. CHECK ROLES TABLE
-- =================================================================

SELECT 'Step 2: Check roles' as debug_step;
SELECT * FROM Roles ORDER BY role_id;

-- =================================================================
-- 3. CHECK USER-ROLE RELATIONSHIPS
-- =================================================================

SELECT 'Step 3: Check user-role relationships' as debug_step;
SELECT 
    u.user_name,
    u.email,
    u.is_active,
    r.role_name,
    r.is_active as role_active
FROM Users u
LEFT JOIN Roles r ON u.role_id = r.role_id
WHERE u.user_name IN ('john_doe', 'admin')
ORDER BY u.user_name;

-- =================================================================
-- 4. CHECK PASSWORD HASH FORMAT
-- =================================================================

SELECT 'Step 4: Check password hash format' as debug_step;
SELECT 
    user_name,
    CASE 
        WHEN password_hash LIKE '$2a$%' THEN 'Valid BCrypt Format'
        WHEN password_hash LIKE '$2b$%' THEN 'Valid BCrypt Format (2b)'
        WHEN password_hash LIKE 'hashedpassword%' THEN 'Invalid Placeholder'
        ELSE 'Unknown Format'
    END as hash_format,
    LENGTH(password_hash) as hash_length,
    LEFT(password_hash, 30) as hash_sample
FROM Users 
WHERE user_name IN ('john_doe', 'admin')
ORDER BY user_name;

-- =================================================================
-- 5. TEST SPECIFIC USER (john_doe)
-- =================================================================

SELECT 'Step 5: john_doe user details' as debug_step;
SELECT 
    user_id,
    user_name,
    email,
    password_hash,
    is_active,
    role_id,
    store_id,
    created_at
FROM Users 
WHERE user_name = 'john_doe';

-- =================================================================
-- 6. COUNT TOTAL USERS
-- =================================================================

SELECT 'Step 6: Total user count' as debug_step;
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_users,
    COUNT(CASE WHEN password_hash LIKE '$2a$%' THEN 1 END) as users_with_valid_hash
FROM Users;

-- =================================================================
-- 7. QUICK FIX SUGGESTION
-- =================================================================

SELECT 'Step 7: Quick fix commands' as debug_step;
SELECT 'Run this UPDATE if john_doe has wrong hash:' as suggestion
UNION ALL
SELECT 'UPDATE Users SET password_hash = ''$2a$11$vV5KqJhE.vQ8QZDWXhT7F.Kv9dXaE/9R5xzJWcpzJdL.bT.bDCOHO'' WHERE user_name = ''john_doe'';'
UNION ALL
SELECT 'Then try login with: username=john_doe, password=password123';
