-- SQL Script to Create Product Request and Product Request Details Tables with Audit Log
-- AND Product Dispatch and Inventory Management (Assumes 'products' table exists externally)

-- Drop tables if they already exist to allow for easy re-creation during development.
-- Order matters due to foreign key constraints: drop child tables first.
DROP TABLE IF EXISTS request_audit_log CASCADE;
DROP TABLE IF EXISTS dispatch_items CASCADE;
DROP TABLE IF EXISTS dispatches CASCADE;
DROP TABLE IF EXISTS product_request_details CASCADE;
DROP TABLE IF EXISTS product_requests CASCADE;
-- Removed: DROP TABLE IF EXISTS products CASCADE;
-- Removed: DROP TABLE IF EXISTS categories CASCADE;

-- Optional: Drop functions and triggers before tables to avoid dependencies issues during re-creation
DROP FUNCTION IF EXISTS update_timestamp CASCADE;
DROP FUNCTION IF EXISTS create_product_request CASCADE;
DROP FUNCTION IF EXISTS approve_product_request CASCADE;
DROP FUNCTION IF EXISTS reject_product_request CASCADE;
DROP FUNCTION IF EXISTS delete_product_request CASCADE;
DROP FUNCTION IF EXISTS create_dispatch CASCADE;
DROP FUNCTION IF EXISTS approve_dispatch CASCADE;
DROP FUNCTION IF EXISTS reject_dispatch CASCADE;
-- Removed: DROP FUNCTION IF EXISTS update_categories_timestamp CASCADE;
-- Removed: DROP FUNCTION IF EXISTS update_products_timestamp CASCADE;


-- Removed: 0.1 Create the 'categories' table (Now assumed to exist externally)
-- Removed: 0.2 Create the 'products' table (Now assumed to exist externally)


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
    status VARCHAR(50) NOT NULL DEFAULT 'Pending Approval', -- Current status (e.g., 'Pending Approval', 'Approved', 'Rejected', 'Fulfilled', 'Cancelled')
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
    -- Removed: CONSTRAINT fk_product_request_details_product_sku FOREIGN KEY (product_sku) REFERENCES products(product_sku)
);

-- Add an index to the request_id for faster lookups of details by request
CREATE INDEX idx_product_request_details_request_id ON product_request_details (request_id);

-- Add an index to the product_sku for faster lookups by product
CREATE INDEX idx_product_request_details_product_sku ON product_request_details (product_sku);

-- 3. Create the 'dispatches' table (New)
-- This table stores the main information about each product dispatch.
CREATE TABLE dispatches (
    dispatch_id SERIAL PRIMARY KEY,     -- Unique identifier for each dispatch
    request_id INTEGER,                 -- Optional: Foreign Key linking to a product_request (can be NULL if not directly from a request)
    dispatch_maker_user_id VARCHAR(255) NOT NULL, -- ID of the user who created the dispatch
    dispatch_checker_user_id VARCHAR(255),      -- ID of the user who approved/checked the dispatch
    dispatch_date DATE NOT NULL DEFAULT CURRENT_DATE, -- Date the dispatch was created
    dispatch_to_location VARCHAR(255) NOT NULL, -- Where the products are being dispatched to
    status VARCHAR(50) NOT NULL DEFAULT 'Pending Dispatch', -- Current status (e.g., 'Pending Dispatch', 'Dispatched', 'Cancelled')
    cancellation_reason TEXT,           -- Reason if the dispatch was cancelled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_dispatch_request
        FOREIGN KEY (request_id)
        REFERENCES product_requests(request_id)
        ON DELETE RESTRICT -- IMPORTANT: Prevents deletion of a request if a dispatch references it
);

-- Add indexes for dispatches table
CREATE INDEX idx_dispatches_dispatch_date ON dispatches (dispatch_date);
CREATE INDEX idx_dispatches_status ON dispatches (status);
CREATE INDEX idx_dispatches_maker_user_id ON dispatches (dispatch_maker_user_id);
CREATE INDEX idx_dispatches_checker_user_id ON dispatches (dispatch_checker_user_id);


-- 4. Create the 'dispatch_items' table (New)
-- This table stores the individual product items included in each dispatch.
CREATE TABLE dispatch_items (
    dispatch_item_id SERIAL PRIMARY KEY, -- Unique identifier for each dispatch item
    dispatch_id INTEGER NOT NULL,       -- Foreign Key linking to the dispatches table
    product_sku VARCHAR(100) NOT NULL,  -- SKU of the dispatched product
    quantity_dispatched INTEGER NOT NULL CHECK (quantity_dispatched > 0), -- Number of units dispatched
    notes_for_item TEXT,                -- Specific notes for this item in the dispatch
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_dispatch_items_dispatch
        FOREIGN KEY (dispatch_id)
        REFERENCES dispatches(dispatch_id)
        ON DELETE CASCADE
    -- Removed: CONSTRAINT fk_dispatch_items_product_sku FOREIGN KEY (product_sku) REFERENCES products(product_sku)
);

-- Add indexes for dispatch_items table
CREATE INDEX idx_dispatch_items_dispatch_id ON dispatch_items (dispatch_id);
CREATE INDEX idx_dispatch_items_product_sku ON dispatch_items (product_sku);


-- 5. Create the 'request_audit_log' table
-- This table tracks all significant actions and status changes for product requests AND dispatches.
CREATE TABLE request_audit_log (
    log_id SERIAL PRIMARY KEY,          -- Unique identifier for each log entry
    request_id INTEGER,                 -- Foreign Key linking to product_requests (NULL if action is related to dispatch only)
    dispatch_id INTEGER,                -- Foreign Key linking to dispatches (NULL if action is related to request only)
    action_type VARCHAR(50) NOT NULL,   -- Type of action (e.g., 'Request Created', 'Request Approved', 'Dispatch Created', 'Dispatch Approved')
    action_by_user_id VARCHAR(255) NOT NULL, -- ID of the user who performed the action
    action_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- When the action occurred
    old_value TEXT,                     -- Previous state/value (e.g., old status)
    new_value TEXT,                     -- New state/value (e.g., new status, rejection reason)
    notes TEXT,                         -- Additional notes or context for the action

    -- Constraints to ensure at least one ID is present and valid
    CONSTRAINT chk_related_id CHECK (request_id IS NOT NULL OR dispatch_id IS NOT NULL),
    CONSTRAINT fk_audit_request
        FOREIGN KEY (request_id)
        REFERENCES product_requests(request_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_audit_dispatch
        FOREIGN KEY (dispatch_id)
        REFERENCES dispatches(dispatch_id)
        ON DELETE CASCADE
);

-- Add indexes for audit log table
CREATE INDEX idx_request_audit_log_request_id ON request_audit_log (request_id);
CREATE INDEX idx_request_audit_log_dispatch_id ON request_audit_log (dispatch_id);
CREATE INDEX idx_request_audit_log_action_by_user_id ON request_audit_log (action_by_user_id);
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

-- Removed: CREATE TRIGGER update_categories_timestamp
-- Removed: CREATE TRIGGER update_products_timestamp

CREATE TRIGGER update_product_requests_timestamp
BEFORE UPDATE ON product_requests
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_product_request_details_timestamp
BEFORE UPDATE ON product_request_details
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_dispatches_timestamp
BEFORE UPDATE ON dispatches
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_dispatch_items_timestamp
BEFORE UPDATE ON dispatch_items
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();


-- Function to create a new product request and its details
-- This function takes the main request details and a JSONB array of product items.
CREATE OR REPLACE FUNCTION create_product_request(
    p_requestor_name VARCHAR,
    p_maker_user_id VARCHAR,
    p_department VARCHAR,
    p_required_by_date DATE,
    p_purpose TEXT,
    p_delivery_location VARCHAR,
    p_special_instructions TEXT,
    p_product_items JSONB
)
RETURNS INTEGER AS $$
DECLARE
    v_request_id INTEGER;
    v_item JSONB;
BEGIN
    -- Insert the main product request
    INSERT INTO product_requests (
        requestor_name,
        maker_user_id,
        department,
        required_by_date,
        purpose,
        delivery_location,
        special_instructions,
        status
    ) VALUES (
        p_requestor_name,
        p_maker_user_id,
        p_department,
        p_required_by_date,
        p_purpose,
        p_delivery_location,
        p_special_instructions,
        'Pending Approval'
    )
    RETURNING request_id INTO v_request_id;

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
        'Request Created',
        p_maker_user_id,
        'Pending Approval',
        'New product request created'
    );

    RETURN v_request_id;
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
            rejection_reason = NULL
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
            'Request Approved',
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
    v_active_dispatch_count INTEGER;
BEGIN
    -- Check current status before rejecting
    SELECT status INTO v_current_status
    FROM product_requests
    WHERE request_id = p_request_id;

    -- Check for associated active dispatches
    SELECT COUNT(*)
    INTO v_active_dispatch_count
    FROM dispatches
    WHERE request_id = p_request_id
      AND status NOT IN ('Cancelled', 'Dispatched'); -- 'Dispatched' means it's already gone, 'Cancelled' means it was reverted

    IF v_active_dispatch_count > 0 THEN
        RAISE EXCEPTION 'Request % cannot be rejected because it has % active associated dispatches.', p_request_id, v_active_dispatch_count;
    END IF;

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
            'Request Rejected',
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

-- New Function: delete_product_request
-- This function handles the deletion of a product request, with checks for active dispatches.
CREATE OR REPLACE FUNCTION delete_product_request(
    p_request_id INTEGER,
    p_user_id VARCHAR -- User performing the deletion
)
RETURNS BOOLEAN AS $$
DECLARE
    v_active_dispatch_count INTEGER;
BEGIN
    -- Check for associated active dispatches
    SELECT COUNT(*)
    INTO v_active_dispatch_count
    FROM dispatches
    WHERE request_id = p_request_id
      AND status NOT IN ('Cancelled', 'Dispatched'); -- 'Dispatched' means it's already gone, 'Cancelled' means it was reverted

    IF v_active_dispatch_count > 0 THEN
        RAISE EXCEPTION 'Request % cannot be deleted because it has % active associated dispatches. Please cancel or complete dispatches first.', p_request_id, v_active_dispatch_count;
    END IF;

    -- Log the deletion attempt before actual deletion (if successful, this will be followed by actual deletion)
    INSERT INTO request_audit_log (
        request_id,
        action_type,
        action_by_user_id,
        old_value,
        new_value,
        notes
    ) VALUES (
        p_request_id,
        'Request Deletion Attempt',
        p_user_id,
        (SELECT status FROM product_requests WHERE request_id = p_request_id),
        'Deleted',
        'Attempted to delete product request'
    );

    -- Delete the request (ON DELETE CASCADE will handle details and audit log entries for this request_id)
    DELETE FROM product_requests
    WHERE request_id = p_request_id;

    IF FOUND THEN
        -- Log successful deletion
        INSERT INTO request_audit_log (
            request_id,
            action_type,
            action_by_user_id,
            old_value,
            new_value,
            notes
        ) VALUES (
            p_request_id,
            'Request Deleted',
            p_user_id,
            'N/A', -- Old value is not applicable as record is gone
            'Deleted',
            'Product request and its details successfully deleted'
        );
        RETURN TRUE;
    ELSE
        RAISE NOTICE 'Request % not found or could not be deleted.', p_request_id;
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql;


-- New Function: create_dispatch
-- This function creates a new dispatch record, its items, and assumes inventory deduction is handled externally.
CREATE OR REPLACE FUNCTION create_dispatch(
    p_dispatch_maker_user_id VARCHAR,
    p_dispatch_to_location VARCHAR,
    p_dispatch_items JSONB, -- Array of dispatch items (e.g., [{"product_sku": "P001", "quantity_dispatched": 5, "notes_for_item": "Fragile"}, ...])
    p_request_id INTEGER DEFAULT NULL -- Optional: Link to an existing product request
)
RETURNS INTEGER AS $$
DECLARE
    v_dispatch_id INTEGER;
    v_item JSONB;
    v_sku VARCHAR(100);
    v_qty INTEGER;
    -- Removed: v_current_stock INTEGER;
    -- Removed: v_product_name VARCHAR(255);
BEGIN
    -- Product existence and stock availability checks are now assumed to be handled externally
    -- before calling this function, or by a separate service/database.
    -- This function only records the dispatch.

    INSERT INTO dispatches (
        request_id,
        dispatch_maker_user_id,
        dispatch_to_location,
        status
    ) VALUES (
        p_request_id,
        p_dispatch_maker_user_id,
        p_dispatch_to_location,
        'Pending Dispatch' -- Initial status
    )
    RETURNING dispatch_id INTO v_dispatch_id;

    -- Insert dispatch items
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_dispatch_items)
    LOOP
        v_sku := (v_item->>'product_sku')::VARCHAR;
        v_qty := (v_item->>'quantity_dispatched')::INTEGER;

        INSERT INTO dispatch_items (
            dispatch_id,
            product_sku,
            quantity_dispatched,
            notes_for_item
        ) VALUES (
            v_dispatch_id,
            v_sku,
            v_qty,
            (v_item->>'notes_for_item')::TEXT
        );

        -- Inventory deduction is now assumed to be handled externally.
        -- Removed: UPDATE products SET current_stock = current_stock - v_qty, updated_at = CURRENT_TIMESTAMP WHERE product_sku = v_sku;
    END LOOP;

    -- Log the creation of the dispatch
    INSERT INTO request_audit_log (
        dispatch_id,
        action_type,
        action_by_user_id,
        new_value,
        notes
    ) VALUES (
        v_dispatch_id,
        'Dispatch Created',
        p_dispatch_maker_user_id,
        'Pending Dispatch',
        'New product dispatch created'
    );

    RETURN v_dispatch_id;
END;
$$ LANGUAGE plpgsql;

-- New Function: approve_dispatch
-- This function approves a dispatch and updates its status.
CREATE OR REPLACE FUNCTION approve_dispatch(
    p_dispatch_id INTEGER,
    p_checker_user_id VARCHAR
)
RETURNS BOOLEAN AS $$
DECLARE
    v_current_status VARCHAR(50);
BEGIN
    SELECT status INTO v_current_status
    FROM dispatches
    WHERE dispatch_id = p_dispatch_id;

    IF v_current_status = 'Pending Dispatch' THEN
        UPDATE dispatches
        SET
            status = 'Dispatched',
            dispatch_checker_user_id = p_checker_user_id,
            updated_at = CURRENT_TIMESTAMP
        WHERE dispatch_id = p_dispatch_id;

        -- Log the dispatch approval
        INSERT INTO request_audit_log (
            dispatch_id,
            action_type,
            action_by_user_id,
            old_value,
            new_value,
            notes
        ) VALUES (
            p_dispatch_id,
            'Dispatch Approved',
            p_checker_user_id,
            v_current_status,
            'Dispatched',
            'Product dispatch approved by checker'
        );
        RETURN TRUE;
    ELSE
        RAISE NOTICE 'Dispatch % cannot be approved. Current status is %.', p_dispatch_id, v_current_status;
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- New Function: reject_dispatch
-- This function rejects/cancels a dispatch and assumes inventory reversion is handled externally.
CREATE OR REPLACE FUNCTION reject_dispatch(
    p_dispatch_id INTEGER,
    p_checker_user_id VARCHAR,
    p_cancellation_reason TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    v_current_status VARCHAR(50);
    -- Removed: v_item RECORD;
BEGIN
    SELECT status INTO v_current_status
    FROM dispatches
    WHERE dispatch_id = p_dispatch_id;

    IF v_current_status = 'Pending Dispatch' THEN
        -- Inventory reversion is now assumed to be handled externally.
        -- Removed: FOR v_item IN SELECT product_sku, quantity_dispatched FROM dispatch_items WHERE dispatch_id = p_dispatch_id LOOP
        -- Removed:     UPDATE products SET current_stock = current_stock + v_item.quantity_dispatched, updated_at = CURRENT_TIMESTAMP WHERE product_sku = v_item.product_sku;
        -- Removed: END LOOP;

        UPDATE dispatches
        SET
            status = 'Cancelled',
            dispatch_checker_user_id = p_checker_user_id,
            cancellation_reason = p_cancellation_reason,
            updated_at = CURRENT_TIMESTAMP
        WHERE dispatch_id = p_dispatch_id;

        -- Log the dispatch rejection/cancellation
        INSERT INTO request_audit_log (
            dispatch_id,
            action_type,
            action_by_user_id,
            old_value,
            new_value,
            notes
        ) VALUES (
            p_dispatch_id,
            'Dispatch Cancelled',
            p_checker_user_id,
            v_current_status,
            'Cancelled',
            'Product dispatch cancelled. Reason: ' || p_cancellation_reason || '. Inventory reversion assumed external.'
        );
        RETURN TRUE;
    ELSE
        RAISE NOTICE 'Dispatch % cannot be cancelled. Current status is %.', p_dispatch_id, v_current_status;
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql;


-- --- Example Usage ---
-- Note: These examples will now require the 'products' and 'categories' tables to exist
-- in your database and be populated with data, as this script no longer creates them.

-- 1. Example: Create a product request
SELECT create_product_request(
    'Alice Smith',
    'user_alice_123',
    'Operations',
    '2025-07-20',
    'Routine stock replenishment',
    'Warehouse Receiving',
    'Deliver during morning hours only',
    '[
        {"product_sku": "PROD-A-001", "product_name": "Widget Alpha", "quantity_requested": 50, "notes_for_item": null},
        {"product_sku": "PROD-B-002", "product_name": "Gadget Beta", "quantity_requested": 10, "notes_for_item": "High adhesion required"}
    ]'::JSONB
);
-- This should return request_id = 1

-- 2. Example: Approve the request
SELECT approve_product_request(
    1,
    'user_bob_456'
);

-- 3. Example: Create a dispatch linked to the approved request
-- IMPORTANT: For this to work, 'PROD-A-001' and 'PROD-B-002' must exist in your external 'products' table,
-- and their 'current_stock' must be sufficient. This script no longer manages that.
SELECT create_dispatch(
    'user_frank_111',
    'Shipping Bay 2',
    '[
        {"product_sku": "PROD-A-001", "product_name": "Widget Alpha", "quantity_dispatched": 20, "notes_for_item": "For customer X"},
        {"product_sku": "PROD-B-002", "product_name": "Gadget Beta", "quantity_dispatched": 5, "notes_for_item": null}
    ]'::JSONB,
    1
);
-- This should return dispatch_id = 1

-- 4. Example: TRY to reject the request (request_id 1) now that it has an active dispatch
-- This call should FAIL with an exception because dispatch_id 1 is 'Pending Dispatch'
SELECT reject_product_request(
    1,
    'user_diana_007',
    'Cannot reject request with active dispatches.'
);

-- 5. Example: TRY to delete the request (request_id 1) now that it has an active dispatch
-- This call should FAIL with an exception because dispatch_id 1 is 'Pending Dispatch'
SELECT delete_product_request(
    1,
    'user_admin_999'
);

-- 6. Example: Approve the dispatch
SELECT approve_dispatch(
    1,
    'user_grace_222'
);

-- 7. Example: Now that dispatch 1 is 'Dispatched', try to reject request 1 again
-- This should still FAIL, as 'Dispatched' is also considered an active state for this rule
SELECT reject_product_request(
    1,
    'user_diana_007',
    'Cannot reject request with completed dispatches.'
);

-- 8. Example: Create another request and reject it immediately (no dispatches yet)
SELECT create_product_request(
    'Eve Green',
    'user_eve_555',
    'Marketing',
    '2025-07-28',
    'Brochure printing materials',
    'Marketing Office',
    'Leave at reception',
    '[{"product_sku": "PROD-C-003", "product_name": "Tool Gamma", "quantity_requested": 5, "notes_for_item": null}]'::JSONB
);
-- This should return request_id = 2

SELECT reject_product_request(
    2,
    'user_frank_111',
    'Budget limits exceeded for this quarter.'
);
-- This should SUCCEED as there are no dispatches linked to request 2.

-- 9. Example: Create another request, then a dispatch, then cancel the dispatch, then try to delete the request
SELECT create_product_request(
    'George White',
    'user_george_666',
    'R&D',
    '2025-08-01',
    'New experiment components',
    'R&D Lab',
    'Deliver to secure cage',
    '[{"product_sku": "PROD-A-001", "product_name": "Widget Alpha", "quantity_requested": 5, "notes_for_item": "Special grade"}]'::JSONB
);
-- This should return request_id = 3

SELECT create_dispatch(
    'user_helen_333',
    'R&D Lab Receiving',
    '[{"product_sku": "PROD-A-001", "product_name": "Widget Alpha", "quantity_dispatched": 5, "notes_for_item": "Special grade"}]'::JSONB,
    3
);
-- This should return dispatch_id = 2

-- Now, cancel the dispatch
SELECT reject_dispatch(
    2,
    'user_ivan_444',
    'Project cancelled, components no longer needed.'
);

-- Now, try to delete request 3 (its associated dispatch is now 'Cancelled')
-- This should SUCCEED
SELECT delete_product_request(
    3,
    'user_admin_999'
);


-- To view all audit log entries:
-- SELECT * FROM request_audit_log ORDER BY action_timestamp ASC;

-- You can now execute this script in your PostgreSQL client (e.g., psql, pgAdmin)
-- to create the tables, functions, and test the functionality in your database.
