import { pool } from '../config/db.js';

export const dashboardModel = {
  async getStats() {
    const [[customers]] = await pool.query('SELECT COUNT(*) AS totalCustomers FROM customers');
    const [[debts]] = await pool.query(
      "SELECT COALESCE(SUM(amount - amount_paid), 0) AS totalDebts FROM debts WHERE status IN ('unpaid', 'partial', 'overdue')"
    );
    const [[paidInvoices]] = await pool.query(
      "SELECT COUNT(*) AS paidInvoices FROM invoices WHERE payment_status = 'paid'"
    );
    const [[unpaidInvoices]] = await pool.query(
      "SELECT COUNT(*) AS unpaidInvoices FROM invoices WHERE payment_status IN ('unpaid', 'partial')"
    );
    const [[workersToPay]] = await pool.query(
      "SELECT COUNT(*) AS workersToPayThisWeek FROM workers WHERE status IN ('unpaid', 'partial') AND payment_due_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)"
    );
    const [[profit]] = await pool.query(
      'SELECT COALESCE(SUM(amount_paid), 0) AS totalProfit FROM invoices'
    );

    return {
      totalCustomers: customers.totalCustomers,
      totalDebts: debts.totalDebts,
      paidInvoices: paidInvoices.paidInvoices,
      unpaidInvoices: unpaidInvoices.unpaidInvoices,
      workersToPayThisWeek: workersToPay.workersToPayThisWeek,
      totalProfit: profit.totalProfit
    };
  }
};
