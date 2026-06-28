-- Kusum Imitation Jewellery - Database Architecture Schema
-- Illustrates the separation of Write Model database schemas and Read Model Cache tables.

-- ==========================================
-- 1. WRITE MODEL DATABASE SCHEMA (PostgreSQL)
-- Optimized for: High normalization (3NF), ACID transactions, data integrity
-- ==========================================

CREATE TABLE IF NOT EXISTS designs (
    design_code VARCHAR(30) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    base_weight_grams NUMERIC(6,2) NOT NULL,
    base_metal_type VARCHAR(20) NOT NULL CHECK (base_metal_type IN ('silver', 'baseAlloy')),
    gold_plating_grams NUMERIC(4,2) DEFAULT 0.0,
    making_charges NUMERIC(10,2) NOT NULL,
    stone_charges NUMERIC(10,2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory (
    design_code VARCHAR(30) PRIMARY KEY REFERENCES designs(design_code) ON DELETE CASCADE,
    stock_count INTEGER NOT NULL CHECK (stock_count >= 0),
    reserved_count INTEGER DEFAULT 0 CHECK (reserved_count >= 0),
    last_restocked TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY,
    customer_phone VARCHAR(20),
    order_status VARCHAR(20) DEFAULT 'pending' CHECK (order_status IN ('pending', 'approved', 'shipped', 'cancelled')),
    total_amount NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    design_code VARCHAR(30) REFERENCES designs(design_code),
    price NUMERIC(10,2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0)
);

-- Indexing write tables for transaction search optimization
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE INDEX idx_order_items_design ON order_items(design_code);


-- ==========================================
-- 2. READ MODEL DATABASE SCHEMA (Denormalized view / Redis layout)
-- Optimized for: O(1) reads, instant retrieval, high performance, zero joins
-- ==========================================

-- Document Cache: keys representing the calculated final retail price
-- Key format: catalog:product:{design_code}
-- Value Type: JSON string
-- {
--     "design_code": "D.no-1130",
--     "name": "Royal Gold Watch-Style Bracelet",
--     "base_price": 7250.00,
--     "total_price": 9350.00,  -- Pre-calculated making, gold plating and GST
--     "stock_status": "INSTOCK",
--     "updated_at": 1782632381
-- }

-- Summary Analytics Key: analytics:sales:today
-- Value Type: Hash map (HSET)
-- {
--     "D.no-1130": "187000.00", -- total sales in INR
--     "D.no-195": "45000.00"
-- }
