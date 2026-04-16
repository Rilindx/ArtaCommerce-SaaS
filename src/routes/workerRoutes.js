import { Router } from 'express';
import {
  addWorkerPayment,
  createWorker,
  deleteWorker,
  getWorkerPayments,
  getWorkers,
  updateWorker
} from '../controllers/workerController.js';

const router = Router();

router.get('/', getWorkers);
router.post('/', createWorker);
router.put('/:id', updateWorker);
router.delete('/:id', deleteWorker);
router.get('/:id/payments', getWorkerPayments);
router.post('/:id/payments', addWorkerPayment);

export default router;
