import { Request, Response, NextFunction } from 'express';
import { CRMService } from './crm.service.js';
import { z } from 'zod';

// Zod schema for validating customer creation
const createCustomerSchema = z.object({
  person_type: z.enum(['PF', 'PJ'], {
    required_error: 'Tipo de pessoa é obrigatório (PF ou PJ).'
  }),
  name: z.string().min(3, 'Nome deve conter no mínimo 3 caracteres.'),
  trade_name: z.string().optional(),
  email: z.string().email('Email inválido.').optional().or(z.literal('')),
  phone: z.string().optional(),
  cpf_cnpj: z.string().min(11, 'Documento (CPF ou CNPJ) inválido.'),
  state_registration: z.string().optional(),
  address_street: z.string().optional(),
  address_number: z.string().optional(),
  address_neighborhood: z.string().optional(),
  address_city: z.string().optional(),
  address_state: z.string().max(2, 'Estado deve ser a sigla com 2 dígitos (Ex: SP).').optional(),
  address_zipcode: z.string().optional(),
  status: z.enum(['lead', 'active', 'inactive']).default('lead')
});

// Zod schema for validating customer updates
const updateCustomerSchema = createCustomerSchema.partial();

// Zod schema for validating interactions logging
const logInteractionSchema = z.object({
  type: z.enum(['email', 'call', 'meeting', 'whatsapp', 'system_event'], {
    required_error: 'Tipo de interação inválido.'
  }),
  description: z.string().min(3, 'A descrição deve conter no mínimo 3 caracteres.')
});

export class CRMController {
  
  static async listCustomers(req: Request, res: Response, next: NextFunction) {
    try {
      const status = req.query.status as string | undefined;
      const search = req.query.search as string | undefined;

      // Instantiate service with current request's Supabase context and auth user ID
      const crmService = new CRMService(req.supabase, req.user!.id);
      const customers = await crmService.listCustomers({ status, search });

      return res.status(200).json({ data: customers });
    } catch (error) {
      return next(error);
    }
  }

  static async getCustomerById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      const crmService = new CRMService(req.supabase, req.user!.id);
      const customer = await crmService.getCustomerById(id);

      return res.status(200).json({ data: customer });
    } catch (error) {
      return next(error);
    }
  }

  static async createCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate schema
      const parseResult = createCustomerSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        return res.status(400).json({
          error: 'Dados inválidos',
          details: parseResult.error.format()
        });
      }

      // If email is empty string, convert to undefined
      if (parseResult.data.email === '') {
        delete parseResult.data.email;
      }

      const crmService = new CRMService(req.supabase, req.user!.id);
      const newCustomer = await crmService.createCustomer(parseResult.data as any);

      return res.status(201).json({
        message: 'Cliente criado com sucesso!',
        data: newCustomer
      });
    } catch (error) {
      return next(error);
    }
  }

  static async updateCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const parseResult = updateCustomerSchema.safeParse(req.body);

      if (!parseResult.success) {
        return res.status(400).json({
          error: 'Dados inválidos',
          details: parseResult.error.format()
        });
      }

      const crmService = new CRMService(req.supabase, req.user!.id);
      const updatedCustomer = await crmService.updateCustomer(id, parseResult.data);

      return res.status(200).json({
        message: 'Cliente atualizado com sucesso!',
        data: updatedCustomer
      });
    } catch (error: any) {
      return next(error);
    }
  }

  static async deleteCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const crmService = new CRMService(req.supabase, req.user!.id);
      const result = await crmService.deleteCustomer(id);

      return res.status(200).json({
        message: 'Cliente removido com sucesso!',
        data: result
      });
    } catch (error) {
      return next(error);
    }
  }

  static async logInteraction(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params; // customer_id
      const parseResult = logInteractionSchema.safeParse(req.body);

      if (!parseResult.success) {
        return res.status(400).json({
          error: 'Dados inválidos',
          details: parseResult.error.format()
        });
      }

      const crmService = new CRMService(req.supabase, req.user!.id);
      const interaction = await crmService.logInteraction({
        customer_id: id,
        ...parseResult.data
      });

      return res.status(201).json({
        message: 'Interação registrada com sucesso!',
        data: interaction
      });
    } catch (error) {
      return next(error);
    }
  }
}
