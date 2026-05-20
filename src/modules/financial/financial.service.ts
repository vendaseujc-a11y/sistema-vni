import { SupabaseClient } from '@supabase/supabase-js';

export class FinancialService {
  private supabase: SupabaseClient;
  private userId: string;

  constructor(supabaseClient: SupabaseClient, userId: string) {
    this.supabase = supabaseClient;
    this.userId = userId;
  }

  /**
   * List all financial ledger transactions for the active tenant
   */
  async listTransactions(filters?: { type?: 'payable' | 'receivable'; status?: 'pending' | 'paid' | 'cancelled' }) {
    let query = this.supabase
      .from('financial_transactions')
      .select('*');

    if (filters?.type) {
      query = query.eq('type', filters.type);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query.order('due_date', { ascending: true });

    if (error) throw error;
    return data;
  }

  /**
   * Retrieve a single transaction detail
   */
  async getTransactionById(id: string) {
    const { data, error } = await this.supabase
      .from('financial_transactions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }
}
