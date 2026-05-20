import { Request, Response, NextFunction } from 'express';
import { FinancialService } from './financial.service.js';

export class FinancialController {

  static async listTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const type = req.query.type as 'payable' | 'receivable' | undefined;
      const status = req.query.status as 'pending' | 'paid' | 'cancelled' | undefined;

      const financialService = new FinancialService(req.supabase, req.user!.id);
      const transactions = await financialService.listTransactions({ type, status });

      return res.status(200).json({ data: transactions });
    } catch (error) {
      return next(error);
    }
  }

  static async getTransactionById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const financialService = new FinancialService(req.supabase, req.user!.id);
      const transaction = await financialService.getTransactionById(id);

      return res.status(200).json({ data: transaction });
    } catch (error) {
      return next(error);
    }
  }
}
