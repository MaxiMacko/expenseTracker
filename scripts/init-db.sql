-- Create schema for Expense Tracker
-- This script runs automatically when the PostgreSQL container starts

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  color VARCHAR(7),
  icon VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_created_at ON expenses(created_at);

-- Insert default categories
INSERT INTO categories (name, color, icon) VALUES
  ('Food', '#FF6B6B', 'utensils'),
  ('Transport', '#4ECDC4', 'car'),
  ('Utilities', '#45B7D1', 'lightbulb'),
  ('Shopping', '#FFA07A', 'shopping-bag'),
  ('Subscriptions', '#98D8C8', 'subscription')
ON CONFLICT (name) DO NOTHING;

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for expenses table
DROP TRIGGER IF EXISTS update_expenses_updated_at ON expenses;
CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON expenses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create view for expense summary
CREATE OR REPLACE VIEW expense_summary AS
SELECT
  category,
  COUNT(*) as count,
  SUM(price) as total,
  AVG(price) as average,
  MAX(price) as maximum,
  MIN(price) as minimum
FROM expenses
GROUP BY category
ORDER BY total DESC;