import { pool } from '../config/db.js';

export const customerModel = {
  async getAll() {
    const [rows] = await pool.query(
      'SELECT * FROM customers ORDER BY created_at DESC'
    );
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM customers WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
  },

  async create(payload) {
    const { businessName, contactName, phone, address, debtBalance = 0, notes } = payload;
    const [result] = await pool.query(
      `INSERT INTO customers (business_name, contact_name, phone, address, debt_balance, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [businessName, contactName || null, phone, address, debtBalance, notes || null]
    );
    return this.getById(result.insertId);
  },

  async update(id, payload) {
    const { businessName, contactName, phone, address, debtBalance = 0, notes } = payload;
    await pool.query(
      `UPDATE customers
       SET business_name = ?, contact_name = ?, phone = ?, address = ?, debt_balance = ?, notes = ?
       WHERE id = ?`,
      [businessName, contactName || null, phone, address, debtBalance, notes || null, id]
    );
    return this.getById(id);
  },

  async remove(id) {
    await pool.query('DELETE FROM customers WHERE id = ?', [id]);
  },

  async getDetails(id) {
    const customer = await this.getById(id);
    if (!customer) {
      return null;
    }

    const [invoices] = await pool.query(
      `SELECT id, invoice_number, invoice_date, due_date, total_amount, amount_paid, payment_status
       FROM invoices
       WHERE customer_id = ?
       ORDER BY invoice_date DESC`,
      [id]
    );
    const [payments] = await pool.query(
      `SELECT id, amount, payment_date, method, notes
       FROM debt_payments
       WHERE customer_id = ?
       ORDER BY payment_date DESC`,
      [id]
    );

    return { ...customer, invoices, payments };
  },

  async syncDebtBalance(customerId, connection = pool) {
    const [rows] = await connection.query(
      "SELECT COALESCE(SUM(amount - amount_paid), 0) AS balance FROM debts WHERE customer_id = ? AND status IN ('unpaid', 'partial', 'overdue')",
      [customerId]
    );
    const balance = rows[0]?.balance || 0;
    await connection.query('UPDATE customers SET debt_balance = ? WHERE id = ?', [balance, customerId]);
    return balance;
  }
};
