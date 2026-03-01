-- Products Module Migration
-- Run this in Supabase Dashboard → SQL Editor

-- 1) Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price_inr NUMERIC(12,2),
  price_usd NUMERIC(12,2),
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2) Product images table (supports multiple images per product)
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3) Product enquiries table
CREATE TABLE IF NOT EXISTS product_enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  name TEXT,
  email TEXT,
  phone TEXT,
  country TEXT,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4) Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_position ON products(position);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_enquiries_product_id ON product_enquiries(product_id);
CREATE INDEX IF NOT EXISTS idx_product_enquiries_is_read ON product_enquiries(is_read);
CREATE INDEX IF NOT EXISTS idx_product_enquiries_created_at ON product_enquiries(created_at DESC);

-- 5) Auto-update updated_at trigger (reuse existing function or create)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_products_updated_at ON products;
CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6) RLS Policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_enquiries ENABLE ROW LEVEL SECURITY;

-- Public READ on published products
DROP POLICY IF EXISTS "Public can read published products" ON products;
CREATE POLICY "Public can read published products"
  ON products FOR SELECT
  USING (status = 'published');

-- Authenticated admins can do everything on products
DROP POLICY IF EXISTS "Admins manage products" ON products;
CREATE POLICY "Admins manage products"
  ON products FOR ALL
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role IN ('admin', 'super_admin', 'editor')
    )
  );

-- Public READ on product images
DROP POLICY IF EXISTS "Public can read product images" ON product_images;
CREATE POLICY "Public can read product images"
  ON product_images FOR SELECT USING (true);

-- Admins manage product images
DROP POLICY IF EXISTS "Admins manage product images" ON product_images;
CREATE POLICY "Admins manage product images"
  ON product_images FOR ALL
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role IN ('admin', 'super_admin', 'editor')
    )
  );

-- Anyone can INSERT enquiries (public form)
DROP POLICY IF EXISTS "Public can insert enquiries" ON product_enquiries;
CREATE POLICY "Public can insert enquiries"
  ON product_enquiries FOR INSERT
  WITH CHECK (true);

-- Only admins can read/update/delete enquiries
DROP POLICY IF EXISTS "Admins manage enquiries" ON product_enquiries;
CREATE POLICY "Admins manage enquiries"
  ON product_enquiries FOR ALL
  USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role IN ('admin', 'super_admin')
    )
  );

-- 7) Optional: Add primary_color, background_color, accent_color to organization_settings
ALTER TABLE organization_settings
  ADD COLUMN IF NOT EXISTS primary_color TEXT DEFAULT '#004643',
  ADD COLUMN IF NOT EXISTS background_color TEXT DEFAULT '#F0EDE5',
  ADD COLUMN IF NOT EXISTS accent_color TEXT DEFAULT '#0a5f58';
