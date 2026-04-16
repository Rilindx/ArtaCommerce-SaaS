import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct
} from '../controllers/productController.js';

const router = Router();

router.get('/', getProducts);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
