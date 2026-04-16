import { Router } from 'express';
import { getProfile, login } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/login', login);
router.get('/me', requireAuth, getProfile);

export default router;
