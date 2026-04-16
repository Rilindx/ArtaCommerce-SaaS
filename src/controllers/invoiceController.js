import { withTransaction } from '../config/db.js';
import { invoiceModel } from '../models/invoiceModel.js';
import { productModel } from '../models/productModel.js';
import { debtModel } from '../models/debtModel.js';
import { customerModel } from '../models/customerModel.js';
import { createHttpError } from '../utils/httpError.js';

const calculatePaymentStatus = (amount, amountPaid) => {
  if (amountPaid >= amount) {
    return 'paid';
  }
  if (amountPaid > 0) {
    return 'partial';
  }
  return 'unpaid';
};

export const getInvoices = async (req, res, next) => {
  try {
    const invoices = await invoiceModel.getAll();
    res.json(invoices);
  } catch (error) {
    next(error);
  }
};

export const getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await invoiceModel.getById(req.params.id);
    if (!invoice) {
      throw createHttpError(404, 'Invoice not found.');
    }
    res.json(invoice);
  } catch (error) {
    next(error);
  }
};

export const createInvoice = async (req, res, next) => {
  try {
    const savedInvoice = await withTransaction(async (connection) => {
      const { customerId, items = [], invoiceDate, dueDate, discount = 0, tax = 0, notes, amountPaid = 0 } = req.body;

      if (!customerId || items.length === 0) {
        throw createHttpError(400, 'Customer and at least one invoice item are required.');
      }

      let subtotal = 0;
      const normalizedItems = [];

      for (const item of items) {
        const product = await productModel.getById(item.productId, connection);
        if (!product) {
          throw createHttpError(404, `Product ${item.productId} not found.`);
        }
        if (Number(product.quantity_in_stock) < Number(item.quantity)) {
          throw createHttpError(400, `Insufficient stock for ${product.name}.`);
        }

        const unitPrice = Number(item.unitPrice || product.price_per_m2);
        const quantity = Number(item.quantity);
        const lineTotal = unitPrice * quantity;
        subtotal += lineTotal;
        normalizedItems.push({ ...item, unitPrice, quantity, lineTotal });
      }

      const totalAmount = subtotal - Number(discount) + Number(tax);
      const paymentStatus = calculatePaymentStatus(totalAmount, Number(amountPaid));
      const invoiceNumber = `INV-${Date.now()}`;

      const invoiceId = await invoiceModel.createInvoice(
        {
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
          notes,
          createdBy: req.user.id
        },
        connection
      );

      await invoiceModel.addItems(invoiceId, normalizedItems, connection);

      for (const item of normalizedItems) {
        await productModel.decreaseStock(item.productId, item.quantity, connection);
      }

      await debtModel.create(
        {
          customerId,
          invoiceId,
          amount: totalAmount,
          amountPaid,
          dueDate,
          status: paymentStatus
        },
        connection
      );

      await customerModel.syncDebtBalance(customerId, connection);

      return invoiceModel.getById(invoiceId, connection);
    });

    res.status(201).json(savedInvoice);
  } catch (error) {
    next(error);
  }
};

export const updateInvoicePayment = async (req, res, next) => {
  try {
    const savedInvoice = await withTransaction(async (connection) => {
      const invoice = await invoiceModel.getById(req.params.id, connection);
      if (!invoice) {
        throw createHttpError(404, 'Invoice not found.');
      }

      const amountPaid = Number(req.body.amountPaid);
      const paymentStatus = calculatePaymentStatus(Number(invoice.total_amount), amountPaid);

      await connection.query(
        'UPDATE invoices SET amount_paid = ?, payment_status = ? WHERE id = ?',
        [amountPaid, paymentStatus, req.params.id]
      );
      await connection.query(
        'UPDATE debts SET amount_paid = ?, status = ? WHERE invoice_id = ?',
        [amountPaid, paymentStatus, req.params.id]
      );
      await customerModel.syncDebtBalance(invoice.customer_id, connection);
      return invoiceModel.getById(req.params.id, connection);
    });

    res.json(savedInvoice);
  } catch (error) {
    next(error);
  }
};
