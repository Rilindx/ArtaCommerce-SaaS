import { pool } from '../config/db.js';

export const workerModel = {
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM workers ORDER BY created_at DESC');
    return rows;
  },

  async getById(id, connection = pool) {
    const [rows] = await connection.query('SELECT * FROM workers WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
  },

  async create(payload) {
    const { fullName, phone, roleTitle, salaryAmount, paymentDueDate, status } = payload;
    const [result] = await pool.query(
      `INSERT INTO workers (full_name, phone, role_title, salary_amount, payment_due_date, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [fullName, phone || null, roleTitle || null, salaryAmount, paymentDueDate, status || 'unpaid']
    );
    return this.getById(result.insertId);
  },

  async update(id, payload) {
    const { fullName, phone, roleTitle, salaryAmount, paymentDueDate, status } = payload;
    await pool.query(
      `UPDATE workers
       SET full_name = ?, phone = ?, role_title = ?, salary_amount = ?, payment_due_date = ?, status = ?
       WHERE id = ?`,
      [fullName, phone || null, roleTitle || null, salaryAmount, paymentDueDate, status || 'unpaid', id]
    );
    return this.getById(id);
  },

  async remove(id) {
    await pool.query('DELETE FROM workers WHERE id = ?', [id]);
  },

  async addPayment(workerId, payload, connection) {
    const { amount, paymentDate, paymentWeekStart, method, notes } = payload;
    await connection.query(
      `INSERT INTO worker_payments (worker_id, amount, payment_date, payment_week_start, method, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [workerId, amount, paymentDate, paymentWeekStart || null, method || 'bank transfer', notes || null]
    );
  },

  async updateStatus(workerId, status, connection) {
    await connection.query('UPDATE workers SET status = ? WHERE id = ?', [status, workerId]);
    return this.getById(workerId, connection);
  },

  async getPaymentHistory(workerId) {
    const [rows] = await pool.query(
      'SELECT * FROM worker_payments WHERE worker_id = ? ORDER BY payment_date DESC',
      [workerId]
    );
    return rows;
  }
};
