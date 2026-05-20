import { Request, Response, NextFunction } from 'express';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { createSupabaseClient, supabaseAdmin } from '../config/supabase.js';

// Dynamically extend Express Request type to contain our scoped context
declare global {
  namespace Express {
    interface Request {
      supabase: SupabaseClient;
      user?: User;
    }
  }
}

/**
 * Middleware that authenticates incoming requests using Supabase Auth JWT.
 * Also configures and attaches a tenant-scoped Supabase client to the request context.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Acesso negado',
        message: 'Token de autenticação não fornecido ou inválido (Formato: Bearer <token>).'
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Acesso negado',
        message: 'Token de autenticação ausente.'
      });
    }

    // Validate the token against Supabase Auth using the admin client (which handles validation securely)
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        error: 'Não autorizado',
        message: 'Token expirado, inválido ou usuário inexistente.'
      });
    }

    // Attach user and dynamically scoped Supabase client to the request
    req.user = user;
    req.supabase = createSupabaseClient(token);

    return next();
  } catch (error) {
    return next(error);
  }
}
