-- User Status Check Script
-- Use this to check the current state of users and their password hashes

-- =================================================================
-- CHECK CURRENT USER STATUS
-- =================================================================

-- Display all users with their roles and login status
SELECT 
    '=== CURRENT USER STATUS ===' as info
UNION ALL
SELECT 
    'Username: ' || u.user_name || 
    ' | Email: ' || u.email || 
    ' | Role: ' || COALESCE(r.role_name, 'No Role') ||
    ' | Store: ' || COALESCE(s.store_name, 'No Store') ||
    ' | Active: ' || CASE WHEN u.is_active THEN 'Yes' ELSE 'No' END
FROM Users u
LEFT JOIN Roles r ON u.role_id = r.role_id
LEFT JOIN Stores s ON u.store_id = s.store_id
ORDER BY info;

-- =================================================================
-- CHECK PASSWORD HASH STATUS
-- =================================================================

SELECT 
    '=== PASSWORD HASH STATUS ===' as info
UNION ALL
SELECT 
    'User: ' || user_name || 
    ' | Hash Status: ' || 
    CASE 
        WHEN password_hash = '$2a$11$vV5KqJhE.vQ8QZDWXhT7F.Kv9dXaE/9R5xzJWcpzJdL.bT.bDCOHO' 
        THEN 'GOOD (password123)' 
        WHEN password_hash LIKE '$2a$%' 
        THEN 'VALID (Unknown Password)'
        WHEN password_hash LIKE 'hashedpassword%'
        THEN 'BAD (Invalid Placeholder)'
        ELSE 'UNKNOWN (Check Required)' 
    END
FROM Users
ORDER BY info;

-- =================================================================
-- CHECK USERS THAT NEED PASSWORD UPDATES
-- =================================================================

SELECT 
    '=== USERS NEEDING PASSWORD UPDATES ===' as info
UNION ALL
SELECT 
    'UPDATE NEEDED: ' || user_name || ' (Current hash: ' || 
    CASE 
        WHEN LENGTH(password_hash) > 20 THEN LEFT(password_hash, 20) || '...' 
        ELSE password_hash 
    END || ')'
FROM Users 
WHERE password_hash NOT LIKE '$2a$%' 
   OR password_hash LIKE 'hashedpassword%'
ORDER BY info;

-- =================================================================
-- QUICK LOGIN CREDENTIALS SUMMARY
-- =================================================================

SELECT 
    '=== READY-TO-USE LOGIN CREDENTIALS ===' as info
UNION ALL
SELECT 
    'Username: ' || user_name || 
    ' | Password: password123' ||
    ' | Role: ' || COALESCE(r.role_name, 'Unknown')
FROM Users u
LEFT JOIN Roles r ON u.role_id = r.role_id
WHERE u.is_active = true 
  AND u.password_hash = '$2a$11$vV5KqJhE.vQ8QZDWXhT7F.Kv9dXaE/9R5xzJWcpzJdL.bT.bDCOHO'
ORDER BY info;
