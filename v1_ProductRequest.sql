-- SQL Script to Create Product Request and Product Request Details Tables with Audit Log

-- Drop tables if they already exist to allow for easy re-creation during development.
-- Order matters due to foreign key constraints: drop child tables first.
DROP TABLE IF EXISTS request_audit_log CASCADE;
DROP TABLE IF EXISTS product_request_details CASCADE;
DROP TABLE IF EXISTS product_requests CASCADE;

-- 1. Create the 'product_requests' table
-- This table stores the main information about each product request.
CREATE TABLE product_requests (
    request_id SERIAL PRIMARY KEY, -- Unique identifier for each request, auto-increments
    requestor_name VARCHAR(255) NOT NULL, -- Name of the person making the request (could be the maker's display name)
    maker_user_id VARCHAR(255) NOT NULL, -- ID of the user who created/made the request
    checker_user_id VARCHAR(255),       -- ID of the user who approved/checked the request (NULL until approved/rejected)
    department VARCHAR(100),            -- Department or team of the requestor
    request_date DATE NOT NULL DEFAULT CURRENT_DATE, -- Date the request was made, defaults to today
    required_by_date DATE NOT NULL,     -- Date by which the products are needed
    purpose TEXT NOT NULL,              -- Detailed reason or purpose for the request
    delivery_location VARCHAR(255) NOT NULL, -- Specific location for delivery (e.g., "Assembly Line 3", "Shipping Bay 1")
    special_instructions TEXT,          -- Any additional notes or instructions for delivery
    status VARCHAR(50) NOT NULL DEFAULT 'Pending Approval', -- Current status of the request (e.g., 'Pending Approval', 'Approved', 'Rejected', 'Fulfilled')
    rejection_reason TEXT,              -- Reason if the request was rejected (NULL if not rejected)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the record was created
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP  -- Timestamp for last update
);

-- Add an index to the request_date for faster queries on dates
CREATE INDEX idx_product_requests_request_date ON product_requests (request_date);

-- Add an index to the status for faster filtering by status
CREATE INDEX idx_product_requests_status ON product_requests (status);

-- Add indexes for maker and checker user IDs
CREATE INDEX idx_product_requests_maker_user_id ON product_requests (maker_user_id);
CREATE INDEX idx_product_requests_checker_user_id ON product_requests (checker_user_id);


-- 2. Create the 'product_request_details' table
-- This table stores the individual product line items for each request.
-- It has a foreign key relationship with the 'product_requests' table.
CREATE TABLE product_request_details (
    detail_id SERIAL PRIMARY KEY,       -- Unique identifier for each detail line item, auto-increments
    request_id INTEGER NOT NULL,        -- Foreign Key linking to the product_requests table
    product_sku VARCHAR(100) NOT NULL,  -- Stock Keeping Unit (SKU) of the requested product
    product_name VARCHAR(255) NOT NULL, -- Name of the product (can be auto-populated from a product catalog)
    quantity_requested INTEGER NOT NULL CHECK (quantity_requested > 0), -- Number of units requested, must be positive
    notes_for_item TEXT,                -- Specific notes for this particular product item
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the record was created
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,  -- Timestamp for last update
    -- Define the foreign key constraint
    CONSTRAINT fk_request
        FOREIGN KEY (request_id)
        REFERENCES product_requests(request_id)
        ON DELETE CASCADE -- If a request is deleted, all its details are also deleted
);

-- Add a comma here to separate the last column definition from the constraint definition
-- This was the cause of the "syntax error at or near "FOREIGN""

-- Add an index to the request_id for faster lookups of details by request
CREATE INDEX idx_product_request_details_request_id ON product_request_details (request_id);

-- Add an index to the product_sku for faster lookups by product
CREATE INDEX idx_product_request_details_product_sku ON product_request_details (product_sku);

-- 3. Create the 'request_audit_log' table
-- This table tracks all significant actions and status changes for product requests.
CREATE TABLE request_audit_log (
    log_id SERIAL PRIMARY KEY,          -- Unique identifier for each log entry
    request_id INTEGER NOT NULL,        -- Foreign Key linking to the product_requests table
    action_type VARCHAR(50) NOT NULL,   -- Type of action (e.g., 'Created', 'Approved', 'Rejected', 'Status Change')
    action_by_user_id VARCHAR(255) NOT NULL, -- ID of the user who performed the action
    action_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- When the action occurred
    old_value TEXT,                     -- Previous state/value (e.g., old status)
    new_value TEXT,                     -- New state/value (e.g., new status, rejection reason)
    notes TEXT,                         -- Additional notes or context for the action

    -- Define the foreign key constraint
    CONSTRAINT fk_audit_request
        FOREIGN KEY (request_id)
        REFERENCES product_requests(request_id)
        ON DELETE CASCADE -- If a request is deleted, its audit trail is also deleted
);

-- Add an index for faster lookups by request_id in the audit log
CREATE INDEX idx_request_audit_log_request_id ON request_audit_log (request_id);

-- Add an index for faster lookups by action_by_user_id in the audit log
CREATE INDEX idx_request_audit_log_action_by_user_id ON request_audit_log (action_by_user_id);

-- Add an index for faster lookups by action_type in the audit log
CREATE INDEX idx_request_audit_log_action_type ON request_audit_log (action_type);


-- Optional: Add a function and trigger to automatically update 'updated_at' column
-- This is a common practice in PostgreSQL to manage timestamps.
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_requests_timestamp
BEFORE UPDATE ON product_requests
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_product_request_details_timestamp
BEFORE UPDATE ON product_request_details
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Function to create a new product request and its details
-- This function takes the main request details and a JSONB array of product items.
CREATE OR REPLACE FUNCTION create_product_request(
    p_requestor_name VARCHAR,
    p_maker_user_id VARCHAR,            -- New parameter for the maker's user ID
    p_department VARCHAR,
    p_required_by_date DATE,
    p_purpose TEXT,
    p_delivery_location VARCHAR,
    p_special_instructions TEXT,
    p_product_items JSONB -- Array of product details (e.g., [{"product_sku": "P001", "product_name": "Widget A", "quantity_requested": 10, "notes_for_item": "Urgent"}, ...])
)
RETURNS INTEGER AS $$
DECLARE
    v_request_id INTEGER;
    v_item JSONB;
BEGIN
    -- Insert the main product request
    INSERT INTO product_requests (
        requestor_name,
        maker_user_id,              -- Insert maker_user_id
        department,
        required_by_date,
        purpose,
        delivery_location,
        special_instructions,
        status                      -- Status defaults to 'Pending Approval'
    ) VALUES (
        p_requestor_name,
        p_maker_user_id,
        p_department,
        p_required_by_date,
        p_purpose,
        p_delivery_location,
        p_special_instructions,
        'Pending Approval'          -- Set initial status
    )
    RETURNING request_id INTO v_request_id; -- Get the newly generated request_id

    -- Loop through the product items JSONB array and insert each detail
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_product_items)
    LOOP
        INSERT INTO product_request_details (
            request_id,
            product_sku,
            product_name,
            quantity_requested,
            notes_for_item
        ) VALUES (
            v_request_id,
            (v_item->>'product_sku')::VARCHAR,
            (v_item->>'product_name')::VARCHAR,
            (v_item->>'quantity_requested')::INTEGER,
            (v_item->>'notes_for_item')::TEXT
        );
    END LOOP;

    -- Log the creation of the request
    INSERT INTO request_audit_log (
        request_id,
        action_type,
        action_by_user_id,
        new_value,
        notes
    ) VALUES (
        v_request_id,
        'Created',
        p_maker_user_id,
        'Pending Approval',
        'New product request created'
    );

    RETURN v_request_id; -- Return the ID of the created request
END;
$$ LANGUAGE plpgsql;

-- Function to approve a product request
CREATE OR REPLACE FUNCTION approve_product_request(
    p_request_id INTEGER,
    p_checker_user_id VARCHAR
)
RETURNS BOOLEAN AS $$
DECLARE
    v_current_status VARCHAR(50);
BEGIN
    -- Check current status before approving
    SELECT status INTO v_current_status
    FROM product_requests
    WHERE request_id = p_request_id;

    IF v_current_status = 'Pending Approval' THEN
        UPDATE product_requests
        SET
            status = 'Approved',
            checker_user_id = p_checker_user_id,
            updated_at = CURRENT_TIMESTAMP,
            rejection_reason = NULL -- Clear any previous rejection reason if it was re-submitted
        WHERE request_id = p_request_id;

        -- Log the approval
        INSERT INTO request_audit_log (
            request_id,
            action_type,
            action_by_user_id,
            old_value,
            new_value,
            notes
        ) VALUES (
            p_request_id,
            'Approved',
            p_checker_user_id,
            v_current_status,
            'Approved',
            'Product request approved by checker'
        );
        RETURN TRUE;
    ELSE
        RAISE NOTICE 'Request % cannot be approved. Current status is %.', p_request_id, v_current_status;
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to reject a product request
CREATE OR REPLACE FUNCTION reject_product_request(
    p_request_id INTEGER,
    p_checker_user_id VARCHAR,
    p_rejection_reason TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    v_current_status VARCHAR(50);
BEGIN
    -- Check current status before rejecting
    SELECT status INTO v_current_status
    FROM product_requests
    WHERE request_id = p_request_id;

    IF v_current_status = 'Pending Approval' THEN
        UPDATE product_requests
        SET
            status = 'Rejected',
            checker_user_id = p_checker_user_id,
            rejection_reason = p_rejection_reason,
            updated_at = CURRENT_TIMESTAMP
        WHERE request_id = p_request_id;

        -- Log the rejection
        INSERT INTO request_audit_log (
            request_id,
            action_type,
            action_by_user_id,
            old_value,
            new_value,
            notes
        ) VALUES (
            p_request_id,
            'Rejected',
            p_checker_user_id,
            v_current_status,
            'Rejected',
            'Product request rejected. Reason: ' || p_rejection_reason
        );
        RETURN TRUE;
    ELSE
        RAISE NOTICE 'Request % cannot be rejected. Current status is %.', p_request_id, v_current_status;
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql;


-- Example of how to call the create_product_request function
-- This will insert a new product request with a maker and set its status to 'Pending Approval'.
SELECT create_product_request(
    'Alice Smith',                               -- requestor_name
    'user_alice_123',                            -- maker_user_id
    'Operations',                                -- department
    '2025-07-20',                                -- required_by_date
    'Routine stock replenishment',               -- purpose
    'Warehouse Receiving',                       -- delivery_location
    'Deliver during morning hours only',         -- special_instructions
    '[
        {"product_sku": "PACK-BOX-LG", "product_name": "Large Packing Box", "quantity_requested": 50, "notes_for_item": null},
        {"product_sku": "TAPE-CLR", "product_name": "Clear Packing Tape", "quantity_requested": 10, "notes_for_item": "High adhesion required"}
    ]'::JSONB                                    -- p_product_items (JSONB array)
);

-- Example of how to call the approve_product_request function
-- Assuming the request_id returned from the above call was 1
SELECT approve_product_request(
    1,                                           -- request_id (replace with actual ID)
    'user_bob_456'                               -- checker_user_id
);

-- Example of how to call the reject_product_request function
-- Let's create another request first to demonstrate rejection
SELECT create_product_request(
    'Charlie Brown',                             -- requestor_name
    'user_charlie_789',                          -- maker_user_id
    'Sales',                                     -- department
    '2025-07-25',                                -- required_by_date
    'Sample request for client demo',            -- purpose
    'Front Office',                              -- delivery_location
    'Leave with receptionist',                   -- special_instructions
    '[
        {"product_sku": "SAMPLE-KIT-A", "product_name": "Demo Kit A", "quantity_requested": 1, "notes_for_item": "Must be pristine condition"}
    ]'::JSONB
);

-- Assuming the request_id returned from the above call was 2
SELECT reject_product_request(
    2,                                           -- request_id (replace with actual ID)
    'user_diana_007',                            -- checker_user_id
    'Insufficient stock for SAMPLE-KIT-A, please re-submit with alternative.' -- rejection_reason
);

-- To view the audit log entries:
-- SELECT * FROM request_audit_log ORDER BY action_timestamp ASC;

-- You can now execute this script in your PostgreSQL client (e.g., psql, pgAdmin)
-- to create the tables, functions, and test the functionality in your database.
