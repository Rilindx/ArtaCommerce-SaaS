USE arta_ceramics_wms;

INSERT INTO products (sku, name, category, unit, price_per_m2, quantity_in_stock, reorder_level)
VALUES
  ('AC-TILE-001', 'Carrara Gloss Tile', 'Wall Tile', 'm2', 24.50, 320.00, 80.00),
  ('AC-TILE-002', 'Slate Stone Tile', 'Floor Tile', 'm2', 31.00, 210.00, 60.00),
  ('AC-TILE-003', 'Sand Beige Tile', 'Outdoor Tile', 'm2', 28.75, 145.00, 40.00)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  category = VALUES(category),
  price_per_m2 = VALUES(price_per_m2),
  quantity_in_stock = VALUES(quantity_in_stock);
