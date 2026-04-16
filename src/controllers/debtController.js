import { withTransaction } from '../config/db.js';
import { debtModel } from '../models/debtModel.js';
import { customerModel } from '../models/customerModel.js';
import { createHttpError } from '../utils/httpError.js';

const deriveDebtStatus = (amount, amountPaid, dueDate) => {
  if (amountPaid >= amount) {
    return 'paid';
  }
  if (amountPaid > 0) {
    return 'partial';
  }
  if (new Date(dueDate) < new Date()) {
    return 'overdue';
  }
  return 'unpaid';
};

export const getDebts = async (req, res, next) => {
  try {
    const debts = await debtModel.getAllWithCustomers();
    res.json(debts);
  } catch (error) {
    next(error);
  }
};

export const addDebtPayment = async (req, res, next) => {
  try {
    const result = await withTransaction(async (connection) => {
      const debt = await debtModel.getById(req.params.id, connection);
      if (!debt) {
        throw createHttpError(404, 'Debt not found.');
      }

      const paymentAmount = Number(req.body.amount);
      const nextAmountPaid = Number(debt.amount_paid) + paymentAmount;
      const status = deriveDebtStatus(Number(debt.amount), nextAmountPaid, debt.due_date);

      await debtModel.addPayment(
        req.params.id,
        {
          customerId: debt.customer_id,
          amount: paymentAmount,
          paymentDate: req.body.paymentDate,
          method: req.body.method,
          notes: req.body.notes
        },
        connection
      );

      await debtModel.updateAmounts(req.params.id, nextAmountPaid, status, connection);

      if (debt.invoice_id) {
        await connection.query(
          'UPDATE invoices SET amount_paid = ?, payment_status = ? WHERE id = ?',
          [nextAmountPaid, status === 'overdue' ? 'unpaid' : status, debt.invoice_id]
        );
      }

      await customerModel.syncDebtBalance(debt.customer_id, connection);
      return debtModel.getById(req.params.id, connection);
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getCustomerPaymentHistory = async (req, res, next) => {
  try {
    const history = await debtModel.getPaymentHistory(req.params.customerId);
    res.json(history);
  } catch (error) {
    next(error);
  }
};
