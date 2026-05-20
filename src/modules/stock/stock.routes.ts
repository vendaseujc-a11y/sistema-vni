import { Router } from 'express';
import { StockController } from './stock.controller.js';

const router = Router();

// Base path: /api/stock/products

router.get('/', StockController.listProducts);
router.post('/', StockController.createProduct);
router.get('/:id', StockController.getProductById);
router.put('/:id', StockController.updateProduct);
router.delete('/:id', StockController.deleteProduct);

export default router;
