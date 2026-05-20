import { Request, Response, NextFunction } from 'express';
import { CompaniesService } from './companies.service.js';
import { z } from 'zod';

const createCompanySchema = z.object({
  name: z.string().min(3, 'Nome da empresa deve conter no mínimo 3 caracteres.'),
  cnpj: z.string().optional()
});

export class CompaniesController {
  
  static async createCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const parseResult = createCompanySchema.safeParse(req.body);
      
      if (!parseResult.success) {
        return res.status(400).json({
          error: 'Dados inválidos',
          details: parseResult.error.format()
        });
      }

      const companiesService = new CompaniesService(req.supabase, req.user!.id);
      const company = await companiesService.createCompany(parseResult.data.name, parseResult.data.cnpj);

      return res.status(201).json({
        message: 'Empresa criada e vinculada com sucesso!',
        data: company
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getMyCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const companiesService = new CompaniesService(req.supabase, req.user!.id);
      const company = await companiesService.getMyCompany();

      return res.status(200).json({ data: company });
    } catch (error) {
      return next(error);
    }
  }
}
