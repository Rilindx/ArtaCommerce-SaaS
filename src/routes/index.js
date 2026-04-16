import { Router } from 'express';
import authRoutes from './authRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import customerRoutes from './customerRoutes.js';
import invoiceRoutes from './invoiceRoutes.js';
import debtRoutes from './debtRoutes.js';
import productRoutes from './productRoutes.js';
import workerRoutes from './workerRoutes.js';
import reportRoutes from './reportRoutes.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/dashboard', requireAuth, dashboardRoutes);
router.use('/customers', requireAuth, customerRoutes);
router.use('/invoices', requireAuth, invoiceRoutes);
router.use('/debts', requireAuth, debtRoutes);
router.use('/products', requireAuth, productRoutes);
router.use('/workers', requireAuth, workerRoutes);
router.use('/reports', requireAuth, reportRoutes);

export default router;
