import { SupabaseClient } from '@supabase/supabase-js';

export class CompaniesService {
  private supabase: SupabaseClient;
  private userId: string;

  constructor(supabaseClient: SupabaseClient, userId: string) {
    this.supabase = supabaseClient;
    this.userId = userId;
  }

  /**
   * Provisions a new company and associates it to the authenticated user's profile
   */
  async createCompany(name: string, cnpj?: string) {
    // 1. Insert into companies table (allowed by RLS for all authenticated users)
    const { data: company, error: companyError } = await this.supabase
      .from('companies')
      .insert({ name, cnpj })
      .select()
      .single();

    if (companyError) throw companyError;

    // 2. Update user profile to link company_id (allowed for self profile update)
    const { error: profileError } = await this.supabase
      .from('profiles')
      .update({ company_id: company.id })
      .eq('id', this.userId);

    if (profileError) throw profileError;

    return company;
  }

  /**
   * Retrieves the company profile associated with the current authenticated user
   */
  async getMyCompany() {
    const { data: profile, error: profileError } = await this.supabase
      .from('profiles')
      .select('company_id, companies(*)')
      .eq('id', this.userId)
      .single();

    if (profileError) throw profileError;
    return (profile as any)?.companies || null;
  }
}
