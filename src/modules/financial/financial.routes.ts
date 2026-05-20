import { Router } from 'express';
import { FinancialController } from './financial.controller.js';

const router = Router();

// Base path: /api/financial/transactions

router.get('/', FinancialController.listTransactions);
router.get('/:id', FinancialController.getTransactionById);

export default router;
