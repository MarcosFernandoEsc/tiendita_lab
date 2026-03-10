CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL CHECK (stock >= 0)
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0)
);

INSERT INTO products (name, description, price, stock)
SELECT 'Cafe de grano', 'Bolsa de cafe 500g', 145.00, 25
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Cafe de grano');

INSERT INTO products (name, description, price, stock)
SELECT 'Taza termica', 'Acero inoxidable 350ml', 210.00, 12
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Taza termica');

INSERT INTO products (name, description, price, stock)
SELECT 'Galletas artesanales', 'Caja surtida de 12 pz', 95.00, 40
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Galletas artesanales');
