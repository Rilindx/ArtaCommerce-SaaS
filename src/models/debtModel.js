import { pool } from '../config/db.js';

export const debtModel = {
  async getAllWithCustomers() {
    const [rows] = await pool.query(
      `SELECT debts.*, customers.business_name, customers.phone
       FROM debts
       INNER JOIN customers ON customers.id = debts.customer_id
       ORDER BY debts.due_date ASC`
    );
    return rows;
  },

  async getById(id, connection = pool) {
    const [rows] = await connection.query('SELECT * FROM debts WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
  },

  async create(payload, connection) {
    const { customerId, invoiceId, amount, amountPaid, dueDate, status } = payload;
    const [result] = await connection.query(
      `INSERT INTO debts (customer_id, invoice_id, amount, amount_paid, due_date, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [customerId, invoiceId || null, amount, amountPaid || 0, dueDate, status || 'unpaid']
    );
    return this.getById(result.insertId, connection);
  },

  async addPayment(debtId, payload, connection) {
    const { customerId, amount, paymentDate, method, notes } = payload;
    await connection.query(
      `INSERT INTO debt_payments (debt_id, customer_id, amount, payment_date, method, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [debtId, customerId, amount, paymentDate, method || 'cash', notes || null]
    );
  },

  async updateAmounts(id, amountPaid, status, connection) {
    await connection.query(
      'UPDATE debts SET amount_paid = ?, status = ? WHERE id = ?',
      [amountPaid, status, id]
    );
    return this.getById(id, connection);
  },

  async getPaymentHistory(customerId) {
    const [rows] = await pool.query(
      `SELECT debt_payments.*, customers.business_name
       FROM debt_payments
       INNER JOIN customers ON customers.id = debt_payments.customer_id
       WHERE debt_payments.customer_id = ?
       ORDER BY debt_payments.payment_date DESC`,
      [customerId]
    );
    return rows;
  }
};
