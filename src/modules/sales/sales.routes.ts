import { Router } from 'express';
import { SalesController } from './sales.controller.js';

const router = Router();

// Base path: /api/sales/orders

router.get('/', SalesController.listSalesOrders);
router.post('/', SalesController.createSalesOrder);
router.get('/:id', SalesController.getSalesOrderById);
router.put('/:id/status', SalesController.updateStatus);
router.delete('/:id', SalesController.deleteSalesOrder);

export default router;
