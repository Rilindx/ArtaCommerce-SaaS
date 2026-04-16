import { Router } from 'express';
import {
  createInvoice,
  getInvoiceById,
  getInvoices,
  updateInvoicePayment
} from '../controllers/invoiceController.js';

const router = Router();

router.get('/', getInvoices);
router.post('/', createInvoice);
router.get('/:id', getInvoiceById);
router.patch('/:id/payment', updateInvoicePayment);

export default router;
