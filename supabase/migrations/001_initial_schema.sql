-- FAL Finance & Asset Ledger - Complete Schema
-- PostgreSQL + Supabase with Row Level Security

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. USERS TABLE (linked to auth.users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  currency TEXT DEFAULT 'IDR' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);

-- Index on users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================================================
-- 2. USER SETTINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  auto_save_rate NUMERIC(5, 4) DEFAULT 0.3000 CHECK (auto_save_rate >= 0 AND auto_save_rate <= 1),
  dca_value NUMERIC(15, 2) DEFAULT 0 CHECK (dca_value >= 0),
  currency TEXT DEFAULT 'IDR' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id)
);

-- ============================================================================
-- 3. CATEGORIES TABLE (normalized)
-- ============================================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'asset_buy', 'asset_sell', 'dca_invest', 'dca_withdraw', 'unlock_savings')),
  icon TEXT,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ,
  UNIQUE(user_id, name, type)
);

CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_type ON categories(type);

-- Insert default categories
INSERT INTO categories (name, type, icon, is_default) VALUES
  ('Salary', 'income', '💰', true),
  ('Freelance', 'income', '💼', true),
  ('Business', 'income', '🏢', true),
  ('Bonus', 'income', '🎁', true),
  ('Other Income', 'income', '💵', true),
  ('Food', 'expense', '🍔', true),
  ('Transport', 'expense', '🚌', true),
  ('Bills', 'expense', '📄', true),
  ('Shopping', 'expense', '🛒', true),
  ('Entertainment', 'expense', '🎬', true),
  ('Healthcare', 'expense', '🏥', true),
  ('Rent', 'expense', '🏠', true),
  ('Other Expense', 'expense', '💸', true),
  ('House', 'asset_buy', '🏠', true),
  ('Gold', 'asset_buy', '🥇', true),
  ('Car', 'asset_buy', '🚗', true),
  ('Laptop', 'asset_buy', '💻', true),
  ('Phone', 'asset_buy', '📱', true),
  ('Watch', 'asset_buy', '⌚', true),
  ('Bike', 'asset_buy', '🚲', true),
  ('Jewelry', 'asset_buy', '💎', true),
  ('Stock', 'asset_buy', '📈', true),
  ('Crypto', 'asset_buy', '₿', true),
  ('Asset Sale', 'asset_sell', '🏆', true),
  ('DCA Investment', 'dca_invest', '📈', true),
  ('DCA Withdraw', 'dca_withdraw', '📉', true),
  ('Unlock Savings', 'unlock_savings', '🔓', true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 4. TRANSACTIONS TABLE (CORE EVENT LOG)
-- ============================================================================
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'asset_buy', 'asset_sell', 'dca_invest', 'dca_withdraw', 'unlock_savings')),
  amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  category_name TEXT NOT NULL,
  date DATE NOT NULL,
  note TEXT,
  currency TEXT DEFAULT 'IDR' NOT NULL,
  
  -- Locked savings fields
  locked_amount NUMERIC(15, 2) DEFAULT 0 CHECK (locked_amount >= 0),
  auto_save_rate NUMERIC(5, 4),
  
  -- Reference for linked transactions (e.g., asset sell links to original buy)
  reference_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
  
  -- Metadata (only if needed)
  metadata JSONB,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);

-- Indexes for transactions (CRITICAL for performance)
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category_name);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON transactions(user_id, date);
CREATE INDEX IF NOT EXISTS idx_transactions_user_type ON transactions(user_id, type);
CREATE INDEX IF NOT EXISTS idx_transactions_user_deleted ON transactions(user_id, deleted_at) WHERE deleted_at IS NULL;

-- ============================================================================
-- 5. DCA TRANSACTIONS TABLE (separate subsystem)
-- ============================================================================
CREATE TABLE IF NOT EXISTS dca_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('dca_invest', 'dca_withdraw')),
  amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
  date DATE NOT NULL,
  note TEXT,
  currency TEXT DEFAULT 'IDR' NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);

-- Indexes for DCA
CREATE INDEX IF NOT EXISTS idx_dca_transactions_user_id ON dca_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_dca_transactions_date ON dca_transactions(date);
CREATE INDEX IF NOT EXISTS idx_dca_transactions_type ON dca_transactions(type);
CREATE INDEX IF NOT EXISTS idx_dca_transactions_created_at ON dca_transactions(created_at);

-- ============================================================================
-- 6. UPDATED_AT TRIGGER FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dca_transactions_updated_at BEFORE UPDATE ON dca_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dca_transactions ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- User settings policies
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Categories policies
CREATE POLICY "Users can view default and own categories" ON categories
  FOR SELECT USING (is_default = true OR auth.uid() = user_id);

CREATE POLICY "Users can manage own categories" ON categories
  FOR ALL USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions" ON transactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions" ON transactions
  FOR DELETE USING (auth.uid() = user_id);

-- DCA transactions policies
CREATE POLICY "Users can view own dca transactions" ON dca_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own dca transactions" ON dca_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own dca transactions" ON dca_transactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own dca transactions" ON dca_transactions
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- 8. FUNCTION: Create user profile on signup
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'display_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  INSERT INTO public.user_settings (user_id, auto_save_rate, dca_value)
  VALUES (NEW.id, 0.3000, 0);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 9. SQL VIEW: Transaction summary for KPIs
-- ============================================================================
CREATE OR REPLACE VIEW transaction_summary AS
SELECT
  user_id,
  COUNT(*) FILTER (WHERE type = 'income') AS income_count,
  COALESCE(SUM(amount) FILTER (WHERE type = 'income'), 0) AS total_income,
  COUNT(*) FILTER (WHERE type = 'expense') AS expense_count,
  COALESCE(SUM(amount) FILTER (WHERE type = 'expense'), 0) AS total_expense,
  COUNT(*) FILTER (WHERE type = 'asset_buy') AS asset_buy_count,
  COALESCE(SUM(amount) FILTER (WHERE type = 'asset_buy'), 0) AS total_asset_buys,
  COUNT(*) FILTER (WHERE type = 'asset_sell') AS asset_sell_count,
  COALESCE(SUM(amount) FILTER (WHERE type = 'asset_sell'), 0) AS total_asset_sells,
  COUNT(*) FILTER (WHERE type = 'unlock_savings') AS unlock_count,
  COALESCE(SUM(locked_amount) FILTER (WHERE type = 'unlock_savings'), 0) AS total_unlocked
FROM transactions
WHERE deleted_at IS NULL
GROUP BY user_id;

-- ============================================================================
-- 10. SQL FUNCTION: Get transaction with pagination and filtering
-- ============================================================================
CREATE OR REPLACE FUNCTION get_transactions_paginated(
  p_user_id UUID,
  p_limit INT DEFAULT 20,
  p_offset INT DEFAULT 0,
  p_type TEXT DEFAULT NULL,
  p_category TEXT DEFAULT NULL,
  p_date_from DATE DEFAULT NULL,
  p_date_to DATE DEFAULT NULL,
  p_min_amount NUMERIC DEFAULT NULL,
  p_max_amount NUMERIC DEFAULT NULL,
  p_keyword TEXT DEFAULT NULL,
  p_sort_by TEXT DEFAULT 'date',
  p_sort_order TEXT DEFAULT 'DESC'
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  type TEXT,
  amount NUMERIC,
  category_name TEXT,
  date DATE,
  note TEXT,
  currency TEXT,
  locked_amount NUMERIC,
  reference_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ,
  total_count BIGINT
) AS $$
DECLARE
  v_sort TEXT;
BEGIN
  v_sort := CASE p_sort_by
    WHEN 'date' THEN 't.date'
    WHEN 'amount_desc' THEN 't.amount DESC'
    WHEN 'amount_asc' THEN 't.amount ASC'
    WHEN 'category' THEN 't.category_name'
    WHEN 'created_at' THEN 't.created_at'
    ELSE 't.date'
  END;
  
  IF p_sort_order = 'ASC' AND p_sort_by NOT IN ('amount_desc') THEN
    v_sort := v_sort || ' ASC';
  ELSE
    v_sort := v_sort || ' DESC';
  END IF;
  
  RETURN QUERY EXECUTE format(
    $sql$
    SELECT
      t.id,
      t.user_id,
      t.type,
      t.amount,
      t.category_name,
      t.date,
      t.note,
      t.currency,
      t.locked_amount,
      t.reference_id,
      t.metadata,
      t.created_at,
      COUNT(*) OVER() AS total_count
    FROM transactions t
    WHERE t.user_id = $1
      AND t.deleted_at IS NULL
      AND ($2 IS NULL OR t.type = $2)
      AND ($3 IS NULL OR t.category_name ILIKE '%%' || $3 || '%%')
      AND ($4 IS NULL OR t.date >= $4)
      AND ($5 IS NULL OR t.date <= $5)
      AND ($6 IS NULL OR t.amount >= $6)
      AND ($7 IS NULL OR t.amount <= $7)
      AND ($8 IS NULL OR t.note ILIKE '%%' || $8 || '%%')
    ORDER BY %s
    LIMIT $9 OFFSET $10
    $sql$,
    v_sort
  )
  USING p_user_id, p_type, p_category, p_date_from, p_date_to, p_min_amount, p_max_amount, p_keyword, p_limit, p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
