-- Script to update Store table with missing columns: phone, store_key, city, state, zip_code
-- Run this script in your PostgreSQL database

-- Check current structure of Stores table
SELECT 'CURRENT STORE TABLE STRUCTURE:' as info;
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'stores' 
ORDER BY ordinal_position;

-- Add missing columns to Stores table (handle constraints safely)
DO $$ 
BEGIN
    -- Add columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stores' AND column_name = 'phone') THEN
        ALTER TABLE Stores ADD COLUMN phone VARCHAR(20);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stores' AND column_name = 'store_key') THEN
        ALTER TABLE Stores ADD COLUMN store_key VARCHAR(10);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stores' AND column_name = 'city') THEN
        ALTER TABLE Stores ADD COLUMN city VARCHAR(100);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stores' AND column_name = 'state') THEN
        ALTER TABLE Stores ADD COLUMN state VARCHAR(50);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stores' AND column_name = 'zip_code') THEN
        ALTER TABLE Stores ADD COLUMN zip_code VARCHAR(10);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stores' AND column_name = 'updated_at') THEN
        ALTER TABLE Stores ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
    
    -- Drop existing unique constraint on store_key if it exists
    BEGIN
        ALTER TABLE Stores DROP CONSTRAINT IF EXISTS stores_store_key_key;
        ALTER TABLE Stores DROP CONSTRAINT IF EXISTS unique_store_key;
        ALTER TABLE Stores DROP CONSTRAINT IF EXISTS stores_store_key_unique;
    EXCEPTION 
        WHEN OTHERS THEN NULL;
    END;
    
    -- Add unique constraint on store_key
    BEGIN
        ALTER TABLE Stores ADD CONSTRAINT unique_store_key UNIQUE (store_key);
    EXCEPTION 
        WHEN duplicate_object THEN NULL;
        WHEN duplicate_table THEN NULL;
    END;
    
EXCEPTION 
    WHEN OTHERS THEN NULL;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stores_store_key ON Stores(store_key);
CREATE INDEX IF NOT EXISTS idx_stores_state ON Stores(state);
CREATE INDEX IF NOT EXISTS idx_stores_city ON Stores(city);
CREATE INDEX IF NOT EXISTS idx_stores_zip_code ON Stores(zip_code);
CREATE INDEX IF NOT EXISTS idx_stores_updated_at ON Stores(updated_at);

-- Update existing stores with sample data
UPDATE Stores 
SET 
    phone = CASE 
        WHEN store_id = 1 THEN '+91-98765-43210'
        WHEN store_id = 2 THEN '+91-87654-32109'
        ELSE '+91-' || (60000 + store_id)::text || '-' || (10000 + store_id * 123)::text
    END,
    store_key = CASE 
        WHEN store_id = 1 THEN 'STORE1'
        WHEN store_id = 2 THEN 'STORE2'
        ELSE 'STR' || LPAD(store_id::text, 3, '0')
    END,
    city = CASE 
        WHEN store_id % 3 = 1 THEN 'Thiruvananthapuram'
        WHEN store_id % 3 = 2 THEN 'Chennai'
        ELSE 'Bengaluru'
    END,
    state = CASE 
        WHEN store_id % 3 = 1 THEN 'Kerala'
        WHEN store_id % 3 = 2 THEN 'Tamil Nadu'
        ELSE 'Karnataka'
    END,
    zip_code = CASE 
        WHEN store_id % 3 = 1 THEN '695001'
        WHEN store_id % 3 = 2 THEN '600001'
        ELSE '560001'
    END,
    updated_at = CURRENT_TIMESTAMP
WHERE phone IS NULL OR store_key IS NULL OR city IS NULL OR state IS NULL OR zip_code IS NULL;

-- Ensure all stores have unique store_keys
DO $$
DECLARE
    store_record RECORD;
    new_key VARCHAR(10);
    counter INTEGER := 1;
BEGIN
    FOR store_record IN 
        SELECT store_id, store_key 
        FROM Stores 
        WHERE store_key IS NULL OR store_key = ''
    LOOP
        LOOP
            new_key := 'STR' || LPAD(counter::text, 3, '0');
            
            -- Check if this key already exists
            IF NOT EXISTS (SELECT 1 FROM Stores WHERE store_key = new_key) THEN
                UPDATE Stores 
                SET store_key = new_key 
                WHERE store_id = store_record.store_id;
                EXIT;
            END IF;
            
            counter := counter + 1;
        END LOOP;
    END LOOP;
END $$;

-- Set initial updated_at values for any records that don't have them
UPDATE Stores 
SET updated_at = created_at 
WHERE updated_at IS NULL;

-- Verify the updates
SELECT 'UPDATED STORE TABLE STRUCTURE:' as info;
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'stores' 
ORDER BY ordinal_position;

-- Show sample data
SELECT 'SAMPLE STORE DATA:' as info;
SELECT store_id, store_name, city, state, zip_code, phone, store_key, is_active, created_at, updated_at
FROM Stores 
ORDER BY store_id 
LIMIT 10;

-- Create a function to generate unique store keys
CREATE OR REPLACE FUNCTION generate_store_key() 
RETURNS VARCHAR(10) AS $$
DECLARE
    new_key VARCHAR(10);
    counter INTEGER := 1;
BEGIN
    LOOP
        new_key := 'STR' || LPAD(counter::text, 3, '0');
        
        IF NOT EXISTS (SELECT 1 FROM Stores WHERE store_key = new_key) THEN
            RETURN new_key;
        END IF;
        
        counter := counter + 1;
    END LOOP;
END $$ LANGUAGE plpgsql;

-- Add constraints for data integrity (drop existing ones first to avoid conflicts)
DO $$ 
BEGIN
    -- Drop existing check constraints if they exist (try multiple possible names)
    BEGIN
        ALTER TABLE Stores DROP CONSTRAINT IF EXISTS chk_phone_format;
        ALTER TABLE Stores DROP CONSTRAINT IF EXISTS stores_phone_check;
        ALTER TABLE Stores DROP CONSTRAINT IF EXISTS phone_format_check;
    EXCEPTION 
        WHEN OTHERS THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE Stores DROP CONSTRAINT IF EXISTS chk_store_key_format;
        ALTER TABLE Stores DROP CONSTRAINT IF EXISTS stores_store_key_check;
        ALTER TABLE Stores DROP CONSTRAINT IF EXISTS store_key_format_check;
    EXCEPTION 
        WHEN OTHERS THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE Stores DROP CONSTRAINT IF EXISTS chk_zip_code_format;
        ALTER TABLE Stores DROP CONSTRAINT IF EXISTS stores_zip_code_check;
        ALTER TABLE Stores DROP CONSTRAINT IF EXISTS zip_code_format_check;
    EXCEPTION 
        WHEN OTHERS THEN NULL;
    END;
    
    -- Add the check constraints
    BEGIN
        ALTER TABLE Stores ADD CONSTRAINT chk_phone_format CHECK (phone ~ '^(\+91-?)?[6-9]\d{4}-?\d{5}$');
    EXCEPTION 
        WHEN duplicate_object THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE Stores ADD CONSTRAINT chk_store_key_format CHECK (store_key ~ '^[A-Z0-9]{3,10}$');
    EXCEPTION 
        WHEN duplicate_object THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE Stores ADD CONSTRAINT chk_zip_code_format CHECK (zip_code ~ '^\d{6}$');
    EXCEPTION 
        WHEN duplicate_object THEN NULL;
    END;
    
EXCEPTION 
    WHEN OTHERS THEN NULL;
END $$;

SELECT 'STORE TABLE UPDATE COMPLETED SUCCESSFULLY!' as status;
