import { pool } from '../config/db.js';

export const reportModel = {
  async getDailyReport() {
    const [rows] = await pool.query(
      `SELECT invoice_date AS report_date,
              COUNT(*) AS invoices_count,
              COALESCE(SUM(total_amount), 0) AS revenue,
              COALESCE(SUM(amount_paid), 0) AS cash_collected
       FROM invoices
       WHERE invoice_date = CURDATE()
       GROUP BY invoice_date`
    );
    return rows[0] || { report_date: null, invoices_count: 0, revenue: 0, cash_collected: 0 };
  },

  async getMonthlyReport() {
    const [rows] = await pool.query(
      `SELECT DATE_FORMAT(invoice_date, '%Y-%m') AS report_month,
              COUNT(*) AS invoices_count,
              COALESCE(SUM(total_amount), 0) AS revenue,
              COALESCE(SUM(amount_paid), 0) AS cash_collected
       FROM invoices
       WHERE invoice_date >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
       GROUP BY DATE_FORMAT(invoice_date, '%Y-%m')`
    );
    return rows[0] || { report_month: null, invoices_count: 0, revenue: 0, cash_collected: 0 };
  },

  async getDebtReport() {
    const [rows] = await pool.query(
      `SELECT customers.business_name, debts.amount, debts.amount_paid, debts.due_date, debts.status
       FROM debts
       INNER JOIN customers ON customers.id = debts.customer_id
       WHERE debts.status IN ('unpaid', 'partial', 'overdue')
       ORDER BY debts.due_date ASC`
    );
    return rows;
  },

  async getProfitReport() {
    const [rows] = await pool.query(
      `SELECT DATE_FORMAT(invoice_date, '%Y-%m') AS month,
              COALESCE(SUM(amount_paid), 0) AS collected_profit
       FROM invoices
       GROUP BY DATE_FORMAT(invoice_date, '%Y-%m')
       ORDER BY month DESC`
    );
    return rows;
  },

  async getWorkerPaymentsReport() {
    const [rows] = await pool.query(
      `SELECT workers.full_name, worker_payments.amount, worker_payments.payment_date, worker_payments.method
       FROM worker_payments
       INNER JOIN workers ON workers.id = worker_payments.worker_id
       ORDER BY worker_payments.payment_date DESC`
    );
    return rows;
  }
};
