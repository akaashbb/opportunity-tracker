-- =====================================================
-- OpportunityPro — Supabase PostgreSQL Schema
-- Run this entire script in Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. CUSTOMERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS customers (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  email         TEXT,
  phone         TEXT,
  address       TEXT,
  region        TEXT,
  business_unit TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. SALES MANAGERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS sales_managers (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  email      TEXT,
  department TEXT,
  team       TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. OPPORTUNITIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS opportunities (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opp_id           TEXT NOT NULL,
  project_name     TEXT NOT NULL,
  customer_id      UUID REFERENCES customers(id) ON DELETE SET NULL,
  manager_id       UUID REFERENCES sales_managers(id) ON DELETE SET NULL,
  department       TEXT,
  stage            TEXT NOT NULL DEFAULT 'Lead'
                     CHECK (stage IN ('Lead','Proposal','Negotiation','Won','Lost')),
  deal_value       NUMERIC(18,2) DEFAULT 0,
  cost             NUMERIC(18,2) DEFAULT 0,
  profit           NUMERIC(18,2) DEFAULT 0,
  profit_pct       NUMERIC(8,2)  DEFAULT 0,
  currency         TEXT DEFAULT 'INR',
  closing_date     DATE,
  probability      NUMERIC(5,2),
  competitor       TEXT,
  status           TEXT DEFAULT 'Open' CHECK (status IN ('Open','Closed')),
  priority         TEXT DEFAULT 'Medium' CHECK (priority IN ('High','Medium','Low')),
  technology       TEXT,
  start_date       DATE,
  end_date         DATE,
  delivery_manager TEXT,
  remarks          TEXT,
  user_id          UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS opportunities_updated_at ON opportunities;
CREATE TRIGGER opportunities_updated_at
  BEFORE UPDATE ON opportunities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE customers       ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_managers  ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities   ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first (safe re-run)
DROP POLICY IF EXISTS "Authenticated users can read customers"      ON customers;
DROP POLICY IF EXISTS "Authenticated users can insert customers"    ON customers;
DROP POLICY IF EXISTS "Authenticated users can update customers"    ON customers;
DROP POLICY IF EXISTS "Authenticated users can delete customers"    ON customers;

DROP POLICY IF EXISTS "Authenticated users can read managers"       ON sales_managers;
DROP POLICY IF EXISTS "Authenticated users can insert managers"     ON sales_managers;
DROP POLICY IF EXISTS "Authenticated users can update managers"     ON sales_managers;
DROP POLICY IF EXISTS "Authenticated users can delete managers"     ON sales_managers;

DROP POLICY IF EXISTS "Authenticated users can read all opportunities" ON opportunities;
DROP POLICY IF EXISTS "Users can insert opportunities"              ON opportunities;
DROP POLICY IF EXISTS "Users can update their opportunities"        ON opportunities;
DROP POLICY IF EXISTS "Users can delete their opportunities"        ON opportunities;

-- Customers policies
CREATE POLICY "Authenticated users can read customers"
  ON customers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert customers"
  ON customers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update customers"
  ON customers FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete customers"
  ON customers FOR DELETE TO authenticated USING (true);

-- Sales Managers policies
CREATE POLICY "Authenticated users can read managers"
  ON sales_managers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert managers"
  ON sales_managers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update managers"
  ON sales_managers FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete managers"
  ON sales_managers FOR DELETE TO authenticated USING (true);

-- Opportunities policies
CREATE POLICY "Authenticated users can read all opportunities"
  ON opportunities FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert opportunities"
  ON opportunities FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their opportunities"
  ON opportunities FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Users can delete their opportunities"
  ON opportunities FOR DELETE TO authenticated USING (true);

-- =====================================================
-- 5. SAMPLE DATA (Optional — remove if not needed)
-- =====================================================

-- Sample Customers (skips duplicates on re-run)
INSERT INTO customers (name, email, phone, region, business_unit) VALUES
  ('Apollo Hospitals',  'it@apollohospitals.com',    '+91 98765 43210', 'South India',      'Healthcare IT'),
  ('Yashoda Hospitals', 'contact@yashoda.com',        '+91 91234 56789', 'Telangana',         'Hospital ERP'),
  ('AIG Hospitals',     'tech@aighospitals.com',      '+91 95678 12345', 'Hyderabad',         'Healthcare'),
  ('KIMS Hospitals',    'info@kimshospitals.com',     '+91 98800 12345', 'Andhra Pradesh',    'Healthcare IT'),
  ('Infosys Ltd',       'procurement@infosys.com',    '+91 80 2852 0261','Karnataka',         'Technology')
ON CONFLICT DO NOTHING;

-- Sample Sales Managers (skips duplicates on re-run)
INSERT INTO sales_managers (name, email, department, team) VALUES
  ('Akash Kumar',  'akash@company.com', 'Healthcare',    'South India Sales'),
  ('Rahul Sharma', 'rahul@company.com', 'Technology',    'North India Sales'),
  ('Priya Singh',  'priya@company.com', 'Finance',       'West India Sales'),
  ('John Davis',   'john@company.com',  'Manufacturing', 'East India Sales')
ON CONFLICT DO NOTHING;
