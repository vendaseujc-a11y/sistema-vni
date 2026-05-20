import { Request, Response, NextFunction } from 'express';

/**
 * Global Exception Interceptor Middleware
 * Standardizes API error responses and prevents server crash on unhandled rejections
 */
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('❌ Erro detectado no servidor:', err);

  // If error has a specific status code (e.g. from a custom app error or library)
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Ocorreu um erro interno no servidor.';
  const code = err.code || 'INTERNAL_SERVER_ERROR';

  return res.status(statusCode).json({
    error: {
      message,
      code,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  });
}
