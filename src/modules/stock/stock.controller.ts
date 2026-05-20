import { Request, Response, NextFunction } from 'express';
import { StockService } from './stock.service.js';
import { z } from 'zod';

const createProductSchema = z.object({
  sku: z.string().min(2, 'SKU deve conter no mínimo 2 caracteres.'),
  name: z.string().min(3, 'Nome deve conter no mínimo 3 caracteres.'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'O preço de venda não pode ser negativo.'),
  cost_price: z.coerce.number().min(0, 'O preço de custo não pode ser negativo.').default(0),
  stock_quantity: z.coerce.number().default(0),
  min_stock: z.coerce.number().default(0),
  max_stock: z.coerce.number().default(0),
  unit: z.enum(['UN', 'KG', 'L', 'M', 'HR', 'CX']).default('UN'),
  type: z.enum(['product', 'raw_material', 'service']).default('product')
});

const updateProductSchema = createProductSchema.partial();

export class StockController {

  static async listProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const type = req.query.type as string | undefined;
      const search = req.query.search as string | undefined;

      const stockService = new StockService(req.supabase, req.user!.id);
      const products = await stockService.listProducts({ type, search });

      return res.status(200).json({ data: products });
    } catch (error) {
      return next(error);
    }
  }

  static async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const stockService = new StockService(req.supabase, req.user!.id);
      const product = await stockService.getProductById(id);

      return res.status(200).json({ data: product });
    } catch (error) {
      return next(error);
    }
  }

  static async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const parseResult = createProductSchema.safeParse(req.body);

      if (!parseResult.success) {
        return res.status(400).json({
          error: 'Dados inválidos',
          details: parseResult.error.format()
        });
      }

      const stockService = new StockService(req.supabase, req.user!.id);
      const newProduct = await stockService.createProduct(parseResult.data as any);

      return res.status(201).json({
        message: 'Produto cadastrado com sucesso!',
        data: newProduct
      });
    } catch (error) {
      return next(error);
    }
  }

  static async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const parseResult = updateProductSchema.safeParse(req.body);

      if (!parseResult.success) {
        return res.status(400).json({
          error: 'Dados inválidos',
          details: parseResult.error.format()
        });
      }

      const stockService = new StockService(req.supabase, req.user!.id);
      const updatedProduct = await stockService.updateProduct(id, parseResult.data);

      return res.status(200).json({
        message: 'Produto atualizado com sucesso!',
        data: updatedProduct
      });
    } catch (error) {
      return next(error);
    }
  }

  static async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const stockService = new StockService(req.supabase, req.user!.id);
      const result = await stockService.deleteProduct(id);

      return res.status(200).json({
        message: 'Produto removido com sucesso!',
        data: result
      });
    } catch (error) {
      return next(error);
    }
  }
}
