import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  SUPABASE_URL: z.string().default(''),
  SUPABASE_ANON_KEY: z.string().default(''),
  SUPABASE_SERVICE_ROLE_KEY: z.string().default('')
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.warn('⚠️ Algumas variáveis de ambiente não foram validadas:', _env.error.format());
}

export const env = _env.success 
  ? _env.data 
  : {
      PORT: Number(process.env.PORT) || 4000,
      NODE_ENV: (process.env.NODE_ENV as any) || 'development',
      SUPABASE_URL: process.env.SUPABASE_URL || '',
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    };
