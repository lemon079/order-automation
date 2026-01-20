-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number SERIAL NOT NULL UNIQUE, -- Human-readable order ID
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'confirmed', 'assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled')),
  
  -- Customer Details
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  
  -- Pickup Location
  pickup_address TEXT NOT NULL,
  pickup_lat DECIMAL(10, 8),
  pickup_lng DECIMAL(11, 8),
  pickup_contact_name TEXT,
  pickup_contact_phone TEXT,
  
  -- Drop-off Location
  dropoff_address TEXT NOT NULL,
  dropoff_lat DECIMAL(10, 8),
  dropoff_lng DECIMAL(11, 8),
  dropoff_contact_name TEXT,
  dropoff_contact_phone TEXT,
  
  -- Items (stored as JSONB array)
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Time Windows
  pickup_time_window_start TIMESTAMPTZ,
  pickup_time_window_end TIMESTAMPTZ,
  dropoff_time_window_start TIMESTAMPTZ,
  dropoff_time_window_end TIMESTAMPTZ,
  
  -- Notes
  special_instructions TEXT,
  internal_notes TEXT,
  
  -- Assignment (for future use)
  assigned_driver_id UUID REFERENCES auth.users(id)
);

-- ============================================================
-- INDEXES FOR SCALE
-- ============================================================

-- Primary query patterns: filter by status, sort by date
CREATE INDEX idx_orders_status_created ON orders(status, created_at DESC);

-- Individual indexes for flexibility
CREATE INDEX idx_orders_status ON orders(status) WHERE status != 'delivered' AND status != 'cancelled';
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_order_number ON orders(order_number);

-- Search patterns
CREATE INDEX idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX idx_orders_customer_name ON orders(LOWER(customer_name));

-- Driver assignment queries
CREATE INDEX idx_orders_assigned_driver ON orders(assigned_driver_id, status) 
  WHERE assigned_driver_id IS NOT NULL;

-- Time window queries (for scheduling)
CREATE INDEX idx_orders_pickup_time ON orders(pickup_time_window_start) 
  WHERE pickup_time_window_start IS NOT NULL;

-- JSONB search on items (GIN index for item names)
CREATE INDEX idx_orders_items_gin ON orders USING GIN(items);

-- Composite index for active orders dashboard
CREATE INDEX idx_active_orders ON orders(status, created_at DESC)
  WHERE status IN ('pending', 'confirmed', 'assigned', 'picked_up', 'in_transit');

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read all orders
CREATE POLICY "Allow authenticated users to read orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Allow authenticated users to create orders
CREATE POLICY "Allow authenticated users to create orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Allow authenticated users to update orders
CREATE POLICY "Allow authenticated users to update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (true);

-- ============================================================
-- TRIGGERS & FUNCTIONS
-- ============================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on every update
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- PARTITIONING SETUP (for future scale)
-- ============================================================
-- When order volume grows (millions of rows), enable partitioning:
-- 
-- 1. Convert to partitioned table by month:
--    ALTER TABLE orders RENAME TO orders_old;
--    CREATE TABLE orders (LIKE orders_old INCLUDING ALL) 
--      PARTITION BY RANGE (created_at);
--
-- 2. Create monthly partitions:
--    CREATE TABLE orders_2026_01 PARTITION OF orders
--      FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
--
-- 3. Auto-create partitions with pg_partman extension
-- ============================================================

-- ============================================================
-- PERFORMANCE NOTES
-- ============================================================
-- Expected query patterns:
-- 1. List orders by status (uses idx_orders_status_created)
-- 2. Search by customer phone (uses idx_orders_customer_phone)
-- 3. Get driver's assigned orders (uses idx_orders_assigned_driver)
-- 4. Find orders in time window (uses idx_orders_pickup_time)
-- 5. Search items (uses idx_orders_items_gin)
--
-- Handles 100k+ orders/day with these indexes
-- Consider partitioning after 10M total orders
-- ============================================================
