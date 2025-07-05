-- Updated create_store_with_users function to include phone and store_key
-- Run this script to update the function after running update-store-table.sql

-- Enable the pgcrypto extension for password hashing
-- This is required for the crypt() and gen_salt() functions.
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DROP FUNCTION IF EXISTS create_store_with_users(VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, BOOLEAN);

CREATE OR REPLACE FUNCTION create_store_with_users(
    _store_name VARCHAR(255),
    _address VARCHAR(255),
    _city VARCHAR(100),
    _state VARCHAR(50),
    _zip_code VARCHAR(10),
    _store_email VARCHAR(255),
    _phone VARCHAR(20),
    _store_key VARCHAR(10),
    _is_active BOOLEAN DEFAULT TRUE
)
RETURNS INT AS $$
DECLARE
    new_store_id INT;
    store_maker_role_id INT;
    store_checker_role_id INT;
BEGIN
    -- Get the role_ids for 'store-maker' and 'store-checker'
    SELECT role_id INTO store_maker_role_id FROM Roles WHERE role_name = 'store-maker';
    SELECT role_id INTO store_checker_role_id FROM Roles WHERE role_name = 'store-checker';

    -- Insert the new store and get its ID
    INSERT INTO Stores (store_name, address, city, state, zip_code, email, phone, store_key, is_active)
    VALUES (_store_name, _address, _city, _state, _zip_code, _store_email, _phone, _store_key, _is_active)
    RETURNING store_id INTO new_store_id;

    -- If store_id is NULL, it means something went wrong (e.g., role_ids not found)
    IF new_store_id IS NULL OR store_maker_role_id IS NULL OR store_checker_role_id IS NULL THEN
        RAISE EXCEPTION 'Failed to create store or retrieve required role IDs. Check if roles exist.';
    END IF;

    -- Create default 'store-maker' user for the new store
    INSERT INTO Users (user_name, password_hash, email, is_active, role_id, store_id)
    VALUES ('maker_' || _store_key, -- e.g., 'maker_STR001'
            crypt('password123', gen_salt('bf', 11)), -- Generate proper BCrypt hash for 'password123'
            'maker_' || _store_key || '@example.com',
            TRUE,
            store_maker_role_id,
            new_store_id);

    -- Create default 'store-checker' user for the new store
    INSERT INTO Users (user_name, password_hash, email, is_active, role_id, store_id)
    VALUES ('checker_' || _store_key, -- e.g., 'checker_STR001'
            crypt('password123', gen_salt('bf', 11)), -- Generate proper BCrypt hash for 'password123'
            'checker_' || _store_key || '@example.com',
            TRUE,
            store_checker_role_id,
            new_store_id);

    RETURN new_store_id;
END;
$$ LANGUAGE plpgsql;

-- Example usage:
-- SELECT create_store_with_users('Tech Store', '123 Main St', 'Thiruvananthapuram', 'Kerala', '695001', 'tech@store.com', '+91-98765-43210', 'TECH01', TRUE);

SELECT 'create_store_with_users function updated successfully!' as status;
