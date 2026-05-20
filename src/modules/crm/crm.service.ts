import { SupabaseClient } from '@supabase/supabase-js';

export interface CustomerInput {
  person_type: 'PF' | 'PJ';
  name: string;
  trade_name?: string;
  email?: string;
  phone?: string;
  cpf_cnpj: string;
  state_registration?: string;
  address_street?: string;
  address_number?: string;
  address_neighborhood?: string;
  address_city?: string;
  address_state?: string;
  address_zipcode?: string;
  status?: 'lead' | 'active' | 'inactive';
}

export interface InteractionInput {
  customer_id: string;
  type: 'email' | 'call' | 'meeting' | 'whatsapp' | 'system_event';
  description: string;
  created_by?: string;
}

export class CRMService {
  private supabase: SupabaseClient;
  private userId: string;

  constructor(supabaseClient: SupabaseClient, userId: string) {
    this.supabase = supabaseClient;
    this.userId = userId;
  }

  /**
   * Helper to retrieve the current user's company_id from their profile
   */
  async getUserCompanyId(): Promise<string> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('company_id')
      .eq('id', this.userId)
      .single();

    if (error || !data || !data.company_id) {
      throw new Error('Empresa não vinculada ao usuário. Por favor, crie ou associe-se a uma empresa.');
    }

    return data.company_id;
  }

  /**
   * List all customers scoped to the user's company
   */
  async listCustomers(filters?: { status?: string; search?: string }) {
    let query = this.supabase
      .from('customers')
      .select('*');

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,cpf_cnpj.ilike.%${filters.search}%`);
    }

    const { data, error } = await query.order('name', { ascending: true });

    if (error) throw error;
    return data;
  }

  /**
   * Retrieve a single customer with their interaction history
   */
  async getCustomerById(id: string) {
    const { data, error } = await this.supabase
      .from('customers')
      .select(`
        *,
        interactions (
          id,
          type,
          description,
          created_at,
          created_by
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Create a new customer record under the user's company
   */
  async createCustomer(input: CustomerInput) {
    const companyId = await this.getUserCompanyId();

    const { data, error } = await this.supabase
      .from('customers')
      .insert({
        ...input,
        company_id: companyId
      })
      .select()
      .single();

    if (error) throw error;

    // Log a system event interaction
    await this.logInteraction({
      customer_id: data.id,
      type: 'system_event',
      description: 'Cliente cadastrado no sistema CRM/ERP.'
    });

    return data;
  }

  /**
   * Update customer details
   */
  async updateCustomer(id: string, input: Partial<CustomerInput>) {
    // RLS will ensure the customer belongs to the company, so we just run the update
    const { data, error } = await this.supabase
      .from('customers')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Delete a customer (only allowed if they have no active sales/debts, enforced by database constraints)
   */
  async deleteCustomer(id: string) {
    const { error } = await this.supabase
      .from('customers')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true, id };
  }

  /**
   * Log an interaction with a customer
   */
  async logInteraction(input: InteractionInput) {
    const companyId = await this.getUserCompanyId();

    const { data, error } = await this.supabase
      .from('interactions')
      .insert({
        ...input,
        company_id: companyId,
        created_by: this.userId
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
