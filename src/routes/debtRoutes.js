import { Router } from 'express';
import {
  addDebtPayment,
  getCustomerPaymentHistory,
  getDebts
} from '../controllers/debtController.js';

const router = Router();

router.get('/', getDebts);
router.get('/customer/:customerId/history', getCustomerPaymentHistory);
router.post('/:id/payments', addDebtPayment);

export default router;
