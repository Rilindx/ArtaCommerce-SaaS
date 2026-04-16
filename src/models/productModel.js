import { pool } from '../config/db.js';

export const productModel = {
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    return rows;
  },

  async getById(id, connection = pool) {
    const [rows] = await connection.query('SELECT * FROM products WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
  },

  async create(payload) {
    const { sku, name, category, unit, pricePerM2, quantityInStock, reorderLevel } = payload;
    const [result] = await pool.query(
      `INSERT INTO products (sku, name, category, unit, price_per_m2, quantity_in_stock, reorder_level)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [sku, name, category || 'Tile', unit || 'm2', pricePerM2, quantityInStock, reorderLevel || 0]
    );
    return this.getById(result.insertId);
  },

  async update(id, payload) {
    const { sku, name, category, unit, pricePerM2, quantityInStock, reorderLevel } = payload;
    await pool.query(
      `UPDATE products
       SET sku = ?, name = ?, category = ?, unit = ?, price_per_m2 = ?, quantity_in_stock = ?, reorder_level = ?
       WHERE id = ?`,
      [sku, name, category || 'Tile', unit || 'm2', pricePerM2, quantityInStock, reorderLevel || 0, id]
    );
    return this.getById(id);
  },

  async remove(id) {
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
  },

  async decreaseStock(productId, quantity, connection) {
    await connection.query(
      'UPDATE products SET quantity_in_stock = quantity_in_stock - ? WHERE id = ?',
      [quantity, productId]
    );
  }
};
