-- ============================================================
-- AHSAN SHOP - Initial Schema Migration
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE user_role AS ENUM ('owner', 'cashier');
CREATE TYPE invoice_status AS ENUM ('draft', 'held', 'finalized', 'cancelled', 'returned');
CREATE TYPE payment_method AS ENUM ('cash', 'card', 'bank_transfer', 'mobile_wallet', 'credit');
CREATE TYPE payment_status AS ENUM ('paid', 'partial', 'unpaid', 'overdue');
CREATE TYPE stock_movement_type AS ENUM ('sale', 'purchase', 'adjustment', 'return', 'damage');
CREATE TYPE expense_payment_method AS ENUM ('cash', 'card', 'bank_transfer', 'mobile_wallet');

-- ============================================================
-- SETTINGS TABLE (needs to exist early for FK references)
-- ============================================================
CREATE TABLE settings (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_name        TEXT NOT NULL DEFAULT 'Ahsan Shop',
  shop_address     TEXT,
  shop_phone       TEXT,
  shop_email       TEXT,
  logo_url         TEXT,
  currency         TEXT NOT NULL DEFAULT 'PKR',
  currency_symbol  TEXT NOT NULL DEFAULT 'Rs.',
  tax_rate         NUMERIC(5,2) NOT NULL DEFAULT 0,
  invoice_prefix   TEXT NOT NULL DEFAULT 'INV',
  invoice_counter  INTEGER NOT NULL DEFAULT 0,
  invoice_footer   TEXT DEFAULT 'Thank you for your business!',
  invoice_terms    TEXT,
  language         TEXT NOT NULL DEFAULT 'en',
  timezone         TEXT NOT NULL DEFAULT 'Asia/Karachi',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default settings row
INSERT INTO settings (id) VALUES (uuid_generate_v4());

-- ============================================================
-- PROFILES (linked to auth.users)
-- ============================================================
CREATE TABLE profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name    TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone        TEXT,
  role         user_role NOT NULL DEFAULT 'cashier',
  avatar_url   TEXT,
  is_active    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by   UUID REFERENCES profiles(id)
);

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  description TEXT,
  color       TEXT DEFAULT '#6366f1',
  sort_order  INTEGER DEFAULT 0,
  deleted_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by  UUID REFERENCES profiles(id)
);

-- Seed default categories
INSERT INTO categories (name, description, color, sort_order) VALUES
  ('School Uniforms', 'Uniforms for schools', '#4f46e5', 1),
  ('Stationery', 'Pens, pencils, notebooks etc.', '#0891b2', 2),
  ('Books', 'Textbooks and notebooks', '#059669', 3),
  ('Art Supplies', 'Paints, brushes, drawing materials', '#d97706', 4),
  ('Office Supplies', 'General office items', '#7c3aed', 5);

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE products (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id         UUID REFERENCES categories(id),
  name                TEXT NOT NULL,
  description         TEXT,
  sku                 TEXT UNIQUE,
  barcode             TEXT,
  cost_price          NUMERIC(12,2) NOT NULL DEFAULT 0,
  selling_price       NUMERIC(12,2) NOT NULL DEFAULT 0,
  stock_quantity      INTEGER NOT NULL DEFAULT 0,
  low_stock_threshold INTEGER NOT NULL DEFAULT 5,
  unit                TEXT NOT NULL DEFAULT 'piece',
  has_variants        BOOLEAN NOT NULL DEFAULT false,
  image_url           TEXT,
  is_active           BOOLEAN NOT NULL DEFAULT true,
  deleted_at          TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by          UUID REFERENCES profiles(id)
);

-- ============================================================
-- PRODUCT VARIANTS (for uniforms: size, color, school)
-- ============================================================
CREATE TABLE product_variants (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id     UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku            TEXT UNIQUE,
  size           TEXT,
  color          TEXT,
  school_name    TEXT,
  additional_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  stock_quantity   INTEGER NOT NULL DEFAULT 0,
  image_url      TEXT,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  deleted_at     TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CUSTOMERS
-- ============================================================
CREATE TABLE customers (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  phone         TEXT,
  email         TEXT,
  address       TEXT,
  school_name   TEXT,
  notes         TEXT,
  outstanding_balance NUMERIC(12,2) NOT NULL DEFAULT 0,
  deleted_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by    UUID REFERENCES profiles(id)
);

-- Walk-in customer
INSERT INTO customers (id, name, phone) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Walk-in Customer', NULL);

-- ============================================================
-- SUPPLIERS
-- ============================================================
CREATE TABLE suppliers (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  contact_person  TEXT,
  phone           TEXT,
  email           TEXT,
  address         TEXT,
  notes           TEXT,
  outstanding_payable NUMERIC(12,2) NOT NULL DEFAULT 0,
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by      UUID REFERENCES profiles(id)
);

-- ============================================================
-- INVOICES
-- ============================================================
CREATE TABLE invoices (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number  TEXT NOT NULL UNIQUE,
  customer_id     UUID NOT NULL REFERENCES customers(id),
  status          invoice_status NOT NULL DEFAULT 'draft',
  payment_status  payment_status NOT NULL DEFAULT 'unpaid',
  payment_method  payment_method,
  subtotal        NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount_type   TEXT CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value  NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax_rate        NUMERIC(5,2) NOT NULL DEFAULT 0,
  tax_amount      NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_amount    NUMERIC(12,2) NOT NULL DEFAULT 0,
  amount_paid     NUMERIC(12,2) NOT NULL DEFAULT 0,
  amount_due      NUMERIC(12,2) NOT NULL DEFAULT 0,
  notes           TEXT,
  finalized_at    TIMESTAMPTZ,
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by      UUID REFERENCES profiles(id)
);

-- ============================================================
-- INVOICE ITEMS
-- ============================================================
CREATE TABLE invoice_items (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id       UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  product_id       UUID REFERENCES products(id),
  variant_id       UUID REFERENCES product_variants(id),
  product_name     TEXT NOT NULL,
  variant_details  TEXT,
  sku              TEXT,
  quantity         INTEGER NOT NULL DEFAULT 1,
  unit_price       NUMERIC(12,2) NOT NULL,
  discount_amount  NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_price      NUMERIC(12,2) NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PAYMENTS
-- ============================================================
CREATE TABLE payments (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id     UUID REFERENCES invoices(id),
  customer_id    UUID NOT NULL REFERENCES customers(id),
  amount         NUMERIC(12,2) NOT NULL,
  payment_method payment_method NOT NULL DEFAULT 'cash',
  payment_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  reference_no   TEXT,
  notes          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by     UUID REFERENCES profiles(id)
);

-- ============================================================
-- PURCHASES (from suppliers)
-- ============================================================
CREATE TABLE purchases (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id      UUID REFERENCES suppliers(id),
  purchase_number  TEXT NOT NULL UNIQUE,
  purchase_date    DATE NOT NULL DEFAULT CURRENT_DATE,
  total_amount     NUMERIC(12,2) NOT NULL DEFAULT 0,
  amount_paid      NUMERIC(12,2) NOT NULL DEFAULT 0,
  amount_due       NUMERIC(12,2) NOT NULL DEFAULT 0,
  payment_method   payment_method,
  notes            TEXT,
  deleted_at       TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by       UUID REFERENCES profiles(id)
);

-- ============================================================
-- PURCHASE ITEMS
-- ============================================================
CREATE TABLE purchase_items (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  purchase_id    UUID NOT NULL REFERENCES purchases(id) ON DELETE CASCADE,
  product_id     UUID REFERENCES products(id),
  variant_id     UUID REFERENCES product_variants(id),
  product_name   TEXT NOT NULL,
  quantity       INTEGER NOT NULL DEFAULT 1,
  unit_cost      NUMERIC(12,2) NOT NULL,
  total_cost     NUMERIC(12,2) NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- EXPENSE CATEGORIES
-- ============================================================
CREATE TABLE expense_categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  description TEXT,
  deleted_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by  UUID REFERENCES profiles(id)
);

INSERT INTO expense_categories (name) VALUES
  ('Rent'), ('Salaries'), ('Utilities'), ('Transport'),
  ('Inventory'), ('Marketing'), ('Maintenance'), ('Other');

-- ============================================================
-- EXPENSES
-- ============================================================
CREATE TABLE expenses (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id     UUID REFERENCES expense_categories(id),
  title           TEXT NOT NULL,
  amount          NUMERIC(12,2) NOT NULL,
  expense_date    DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method  expense_payment_method NOT NULL DEFAULT 'cash',
  reference_no    TEXT,
  notes           TEXT,
  receipt_url     TEXT,
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by      UUID REFERENCES profiles(id)
);

-- ============================================================
-- STOCK MOVEMENTS (audit trail)
-- ============================================================
CREATE TABLE stock_movements (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id    UUID NOT NULL REFERENCES products(id),
  variant_id    UUID REFERENCES product_variants(id),
  movement_type stock_movement_type NOT NULL,
  quantity      INTEGER NOT NULL,
  quantity_before INTEGER NOT NULL,
  quantity_after  INTEGER NOT NULL,
  reference_id    UUID,
  reference_type  TEXT,
  reason          TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by    UUID REFERENCES profiles(id)
);

-- ============================================================
-- DAILY CLOSINGS
-- ============================================================
CREATE TABLE daily_closings (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  closing_date     DATE NOT NULL UNIQUE,
  opening_cash     NUMERIC(12,2) NOT NULL DEFAULT 0,
  sales_cash       NUMERIC(12,2) NOT NULL DEFAULT 0,
  sales_card       NUMERIC(12,2) NOT NULL DEFAULT 0,
  sales_other      NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_sales      NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_expenses   NUMERIC(12,2) NOT NULL DEFAULT 0,
  closing_cash     NUMERIC(12,2) NOT NULL DEFAULT 0,
  notes            TEXT,
  closed_by        UUID REFERENCES profiles(id),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- AUDIT LOGS
-- ============================================================
CREATE TABLE audit_logs (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID REFERENCES profiles(id),
  action       TEXT NOT NULL,
  table_name   TEXT NOT NULL,
  record_id    UUID,
  old_values   JSONB,
  new_values   JSONB,
  ip_address   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_invoices_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_customer ON invoices(customer_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_created_at ON invoices(created_at DESC);
CREATE INDEX idx_invoices_finalized_at ON invoices(finalized_at DESC);

CREATE INDEX idx_products_name ON products USING gin(to_tsvector('english', name));
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_products_category ON products(category_id);

CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_name ON customers(name);

CREATE INDEX idx_payments_invoice ON payments(invoice_id);
CREATE INDEX idx_payments_customer ON payments(customer_id);
CREATE INDEX idx_payments_date ON payments(payment_date DESC);

CREATE INDEX idx_expenses_date ON expenses(expense_date DESC);
CREATE INDEX idx_expenses_category ON expenses(category_id);

CREATE INDEX idx_stock_movements_product ON stock_movements(product_id);
CREATE INDEX idx_stock_movements_created ON stock_movements(created_at DESC);

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON product_variants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_purchases_updated_at BEFORE UPDATE ON purchases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'owner'::public.user_role)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- GENERATE INVOICE NUMBER (atomic, sequential)
-- ============================================================
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
  v_prefix    TEXT;
  v_counter   INTEGER;
  v_year      TEXT;
  v_num       TEXT;
BEGIN
  SELECT invoice_prefix, invoice_counter + 1
  INTO v_prefix, v_counter
  FROM settings
  LIMIT 1
  FOR UPDATE;

  UPDATE settings SET invoice_counter = v_counter;

  v_year := TO_CHAR(NOW(), 'YYYY');
  v_num  := LPAD(v_counter::TEXT, 4, '0');

  RETURN v_prefix || '-' || v_year || '-' || v_num;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- FINALIZE INVOICE (atomic transaction: stock + payment + totals)
-- ============================================================
CREATE OR REPLACE FUNCTION finalize_invoice(
  p_invoice_id    UUID,
  p_payment_method payment_method,
  p_amount_paid   NUMERIC,
  p_user_id       UUID
)
RETURNS JSONB AS $$
DECLARE
  v_invoice       invoices%ROWTYPE;
  v_item          invoice_items%ROWTYPE;
  v_product       products%ROWTYPE;
  v_variant       product_variants%ROWTYPE;
  v_stock_before  INTEGER;
  v_result        JSONB;
BEGIN
  -- Lock and fetch invoice
  SELECT * INTO v_invoice FROM invoices WHERE id = p_invoice_id FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invoice not found';
  END IF;
  IF v_invoice.status = 'finalized' THEN
    RAISE EXCEPTION 'Invoice is already finalized';
  END IF;
  IF v_invoice.status = 'cancelled' THEN
    RAISE EXCEPTION 'Cannot finalize a cancelled invoice';
  END IF;

  -- Deduct stock for each item
  FOR v_item IN SELECT * FROM invoice_items WHERE invoice_id = p_invoice_id LOOP
    IF v_item.variant_id IS NOT NULL THEN
      SELECT * INTO v_variant FROM product_variants WHERE id = v_item.variant_id FOR UPDATE;
      v_stock_before := v_variant.stock_quantity;
      IF v_variant.stock_quantity < v_item.quantity THEN
        RAISE EXCEPTION 'Insufficient stock for variant: %', v_item.variant_details;
      END IF;
      UPDATE product_variants SET stock_quantity = stock_quantity - v_item.quantity WHERE id = v_item.variant_id;
    ELSIF v_item.product_id IS NOT NULL THEN
      SELECT * INTO v_product FROM products WHERE id = v_item.product_id FOR UPDATE;
      v_stock_before := v_product.stock_quantity;
      IF v_product.stock_quantity < v_item.quantity THEN
        RAISE EXCEPTION 'Insufficient stock for product: %', v_item.product_name;
      END IF;
      UPDATE products SET stock_quantity = stock_quantity - v_item.quantity WHERE id = v_item.product_id;
    END IF;

    -- Stock movement record
    INSERT INTO stock_movements (
      product_id, variant_id, movement_type, quantity,
      quantity_before, quantity_after, reference_id, reference_type, created_by
    ) VALUES (
      v_item.product_id, v_item.variant_id, 'sale', -v_item.quantity,
      COALESCE(v_stock_before, 0),
      COALESCE(v_stock_before, 0) - v_item.quantity,
      p_invoice_id, 'invoice', p_user_id
    );
  END LOOP;

  -- Update invoice status
  UPDATE invoices SET
    status         = 'finalized',
    payment_method = p_payment_method,
    amount_paid    = p_amount_paid,
    amount_due     = total_amount - p_amount_paid,
    payment_status = CASE
      WHEN p_amount_paid >= total_amount THEN 'paid'::payment_status
      WHEN p_amount_paid > 0 THEN 'partial'::payment_status
      ELSE 'unpaid'::payment_status
    END,
    finalized_at   = NOW(),
    updated_at     = NOW()
  WHERE id = p_invoice_id;

  -- Record payment if any
  IF p_amount_paid > 0 THEN
    INSERT INTO payments (invoice_id, customer_id, amount, payment_method, created_by)
    SELECT p_invoice_id, customer_id, p_amount_paid, p_payment_method, p_user_id
    FROM invoices WHERE id = p_invoice_id;
  END IF;

  -- Update customer outstanding balance if credit
  IF p_amount_paid < (SELECT total_amount FROM invoices WHERE id = p_invoice_id) THEN
    UPDATE customers SET outstanding_balance = outstanding_balance +
      ((SELECT total_amount FROM invoices WHERE id = p_invoice_id) - p_amount_paid)
    WHERE id = (SELECT customer_id FROM invoices WHERE id = p_invoice_id);
  END IF;

  SELECT row_to_json(i) INTO v_result FROM invoices i WHERE id = p_invoice_id;
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Helper function to get user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- SETTINGS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings_read_all"   ON settings FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "settings_write_owner" ON settings FOR UPDATE USING (get_user_role() = 'owner');

-- PROFILES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_read_own"   ON profiles FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id OR get_user_role() = 'owner');
CREATE POLICY "profiles_owner_all"  ON profiles FOR ALL USING (get_user_role() = 'owner');

-- CATEGORIES
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_read_all"       ON categories FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);
CREATE POLICY "categories_write_owner"    ON categories FOR ALL USING (get_user_role() = 'owner');
CREATE POLICY "categories_insert_cashier" ON categories FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- PRODUCTS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_read_all"       ON products FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);
CREATE POLICY "products_write_owner"    ON products FOR ALL USING (get_user_role() = 'owner');
CREATE POLICY "products_insert_cashier" ON products FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "products_update_cashier" ON products FOR UPDATE USING (auth.uid() IS NOT NULL);

-- PRODUCT VARIANTS
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "variants_read_all"    ON product_variants FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "variants_write_owner" ON product_variants FOR ALL USING (get_user_role() = 'owner');
CREATE POLICY "variants_insert_any"  ON product_variants FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- CUSTOMERS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "customers_read_all"     ON customers FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);
CREATE POLICY "customers_insert_any"   ON customers FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "customers_update_any"   ON customers FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "customers_delete_owner" ON customers FOR DELETE USING (get_user_role() = 'owner');

-- SUPPLIERS
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "suppliers_read_all"     ON suppliers FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);
CREATE POLICY "suppliers_insert_any"   ON suppliers FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "suppliers_update_any"   ON suppliers FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "suppliers_delete_owner" ON suppliers FOR DELETE USING (get_user_role() = 'owner');

-- INVOICES
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "invoices_read_all"     ON invoices FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);
CREATE POLICY "invoices_insert_any"   ON invoices FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "invoices_update_any"   ON invoices FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "invoices_delete_owner" ON invoices FOR DELETE USING (get_user_role() = 'owner');

-- INVOICE ITEMS
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "invoice_items_read_all"   ON invoice_items FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "invoice_items_insert_any" ON invoice_items FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "invoice_items_update_any" ON invoice_items FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "invoice_items_delete_any" ON invoice_items FOR DELETE USING (auth.uid() IS NOT NULL);

-- PAYMENTS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "payments_read_all"     ON payments FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "payments_insert_any"   ON payments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "payments_update_owner" ON payments FOR UPDATE USING (get_user_role() = 'owner');

-- PURCHASES
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "purchases_read_all"     ON purchases FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);
CREATE POLICY "purchases_insert_any"   ON purchases FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "purchases_update_any"   ON purchases FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "purchases_delete_owner" ON purchases FOR DELETE USING (get_user_role() = 'owner');

-- PURCHASE ITEMS
ALTER TABLE purchase_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "purchase_items_read_all"   ON purchase_items FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "purchase_items_insert_any" ON purchase_items FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- EXPENSE CATEGORIES
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "expense_cats_read_all"    ON expense_categories FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "expense_cats_write_owner" ON expense_categories FOR ALL USING (get_user_role() = 'owner');
CREATE POLICY "expense_cats_insert_any"  ON expense_categories FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- EXPENSES
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "expenses_read_all"     ON expenses FOR SELECT USING (auth.uid() IS NOT NULL AND deleted_at IS NULL);
CREATE POLICY "expenses_insert_any"   ON expenses FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "expenses_update_any"   ON expenses FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "expenses_delete_owner" ON expenses FOR DELETE USING (get_user_role() = 'owner');

-- STOCK MOVEMENTS
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "stock_movements_read_all"   ON stock_movements FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "stock_movements_insert_any" ON stock_movements FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- DAILY CLOSINGS
ALTER TABLE daily_closings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "daily_closings_read_all"     ON daily_closings FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "daily_closings_insert_any"   ON daily_closings FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "daily_closings_update_owner" ON daily_closings FOR UPDATE USING (get_user_role() = 'owner');

-- AUDIT LOGS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audit_logs_read_owner" ON audit_logs FOR SELECT USING (get_user_role() = 'owner');
CREATE POLICY "audit_logs_insert_any" ON audit_logs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
