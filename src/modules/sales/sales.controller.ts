import { Request, Response, NextFunction } from 'express';
import { SalesService } from './sales.service.js';
import { z } from 'zod';

const createSalesOrderSchema = z.object({
  customer_id: z.string().uuid('ID do cliente inválido (deve ser UUID).'),
  items: z.array(
    z.object({
      product_id: z.string().uuid('ID do produto inválido (deve ser UUID).'),
      quantity: z.coerce.number().min(0.001, 'Quantidade deve ser maior que zero.'),
      unit_price: z.coerce.number().min(0, 'Preço unitário não pode ser negativo.')
    })
  ).min(1, 'O pedido de venda deve conter no mínimo 1 item.')
});

const updateStatusSchema = z.object({
  status: z.enum(['draft', 'approved', 'invoiced', 'cancelled'], {
    required_error: 'Status é obrigatório.'
  })
});

export class SalesController {

  static async listSalesOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const status = req.query.status as string | undefined;

      const salesService = new SalesService(req.supabase, req.user!.id);
      const orders = await salesService.listSalesOrders({ status });

      return res.status(200).json({ data: orders });
    } catch (error) {
      return next(error);
    }
  }

  static async getSalesOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const salesService = new SalesService(req.supabase, req.user!.id);
      const order = await salesService.getSalesOrderById(id);

      return res.status(200).json({ data: order });
    } catch (error) {
      return next(error);
    }
  }

  static async createSalesOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const parseResult = createSalesOrderSchema.safeParse(req.body);

      if (!parseResult.success) {
        return res.status(400).json({
          error: 'Dados inválidos',
          details: parseResult.error.format()
        });
      }

      const salesService = new SalesService(req.supabase, req.user!.id);
      const newOrder = await salesService.createSalesOrder(parseResult.data);

      return res.status(201).json({
        message: 'Pedido de venda criado com sucesso!',
        data: newOrder
      });
    } catch (error) {
      return next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const parseResult = updateStatusSchema.safeParse(req.body);

      if (!parseResult.success) {
        return res.status(400).json({
          error: 'Dados inválidos',
          details: parseResult.error.format()
        });
      }

      const salesService = new SalesService(req.supabase, req.user!.id);
      const updatedOrder = await salesService.updateSalesOrderStatus(id, parseResult.data.status);

      let successMessage = 'Pedido faturado com sucesso!';
      if (parseResult.data.status === 'cancelled') {
        successMessage = 'Pedido cancelado e estoque estornado com sucesso!';
      } else if (parseResult.data.status === 'draft') {
        successMessage = 'Pedido alterado para orçamento.';
      }

      return res.status(200).json({
        message: successMessage,
        data: updatedOrder
      });
    } catch (error) {
      return next(error);
    }
  }

  static async deleteSalesOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const salesService = new SalesService(req.supabase, req.user!.id);
      const result = await salesService.deleteSalesOrder(id);

      return res.status(200).json({
        message: 'Pedido de venda removido com sucesso!',
        data: result
      });
    } catch (error) {
      return next(error);
    }
  }
}
