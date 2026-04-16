import { pool } from '../config/db.js';

export const invoiceModel = {
  async getAll() {
    const [rows] = await pool.query(
      `SELECT invoices.*, customers.business_name
       FROM invoices
       INNER JOIN customers ON customers.id = invoices.customer_id
       ORDER BY invoices.created_at DESC`
    );
    return rows;
  },

  async getById(id, connection = pool) {
    const [rows] = await connection.query(
      `SELECT invoices.*, customers.business_name
       FROM invoices
       INNER JOIN customers ON customers.id = invoices.customer_id
       WHERE invoices.id = ?
       LIMIT 1`,
      [id]
    );
    const invoice = rows[0] || null;

    if (!invoice) {
      return null;
    }

    const [items] = await connection.query(
      `SELECT invoice_items.*, products.name AS product_name, products.sku
       FROM invoice_items
       INNER JOIN products ON products.id = invoice_items.product_id
       WHERE invoice_items.invoice_id = ?`,
      [id]
    );

    return { ...invoice, items };
  },

  async createInvoice(payload, connection) {
    const {
      invoiceNumber,
      customerId,
      invoiceDate,
      dueDate,
      subtotal,
      discount,
      tax,
      totalAmount,
      paymentStatus,
      amountPaid,
      notes,
      createdBy
    } = payload;

    const [result] = await connection.query(
      `INSERT INTO invoices
       (invoice_number, customer_id, invoice_date, due_date, subtotal, discount, tax, total_amount, amount_paid, payment_status, notes, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        invoiceNumber,
        customerId,
        invoiceDate,
        dueDate,
        subtotal,
        discount,
        tax,
        totalAmount,
        amountPaid,
        paymentStatus,
        notes || null,
        createdBy
      ]
    );

    return result.insertId;
  },

  async addItems(invoiceId, items, connection) {
    for (const item of items) {
      await connection.query(
        `INSERT INTO invoice_items (invoice_id, product_id, quantity, unit_price, line_total)
         VALUES (?, ?, ?, ?, ?)`,
        [invoiceId, item.productId, item.quantity, item.unitPrice, item.lineTotal]
      );
    }
  }
};
