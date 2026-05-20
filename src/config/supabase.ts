import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

/**
 * Supabase Admin Client
 * Bypasses Row Level Security (RLS). Use with high caution and only for system operations,
 * background jobs, or server-level tasks.
 */
export const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

/**
 * Creates a Supabase client scoped to a specific user's authentication token.
 * This client respects Row Level Security (RLS) since it transmits the user's JWT
 * down to the PostgreSQL session.
 * 
 * @param userToken - The Bearer JWT token of the authenticated user
 */
export function createSupabaseClient(userToken?: string) {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    },
    global: {
      headers: userToken ? { Authorization: `Bearer ${userToken}` } : {}
    }
  });
}
