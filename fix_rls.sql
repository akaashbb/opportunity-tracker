-- Fix RLS Policies for all tables

ALTER TABLE customers      ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities  ENABLE ROW LEVEL SECURITY;

-- Drop and recreate customer policies
DROP POLICY IF EXISTS "Authenticated users can read customers"   ON customers;
DROP POLICY IF EXISTS "Authenticated users can insert customers" ON customers;
DROP POLICY IF EXISTS "Authenticated users can update customers" ON customers;
DROP POLICY IF EXISTS "Authenticated users can delete customers" ON customers;

CREATE POLICY "Authenticated users can read customers"   ON customers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert customers" ON customers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update customers" ON customers FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete customers" ON customers FOR DELETE TO authenticated USING (true);

-- Drop and recreate sales_managers policies
DROP POLICY IF EXISTS "Authenticated users can read managers"   ON sales_managers;
DROP POLICY IF EXISTS "Authenticated users can insert managers" ON sales_managers;
DROP POLICY IF EXISTS "Authenticated users can update managers" ON sales_managers;
DROP POLICY IF EXISTS "Authenticated users can delete managers" ON sales_managers;

CREATE POLICY "Authenticated users can read managers"   ON sales_managers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert managers" ON sales_managers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update managers" ON sales_managers FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete managers" ON sales_managers FOR DELETE TO authenticated USING (true);

-- Drop and recreate opportunities policies
DROP POLICY IF EXISTS "Authenticated users can read all opportunities" ON opportunities;
DROP POLICY IF EXISTS "Users can insert opportunities"                 ON opportunities;
DROP POLICY IF EXISTS "Users can update their opportunities"           ON opportunities;
DROP POLICY IF EXISTS "Users can delete their opportunities"           ON opportunities;

CREATE POLICY "Authenticated users can read all opportunities" ON opportunities FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert opportunities"                 ON opportunities FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update their opportunities"           ON opportunities FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Users can delete their opportunities"           ON opportunities FOR DELETE TO authenticated USING (true);
