import { SupabaseClient } from '@supabase/supabase-js';

export interface ProductInput {
  sku: string;
  name: string;
  description?: string;
  price: number;
  cost_price?: number;
  stock_quantity?: number;
  min_stock?: number;
  max_stock?: number;
  unit?: 'UN' | 'KG' | 'L' | 'M' | 'HR' | 'CX';
  type?: 'product' | 'raw_material' | 'service';
}

export class StockService {
  private supabase: SupabaseClient;
  private userId: string;

  constructor(supabaseClient: SupabaseClient, userId: string) {
    this.supabase = supabaseClient;
    this.userId = userId;
  }

  /**
   * Helper to retrieve user's active company ID
   */
  async getUserCompanyId(): Promise<string> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('company_id')
      .eq('id', this.userId)
      .single();

    if (error || !data || !data.company_id) {
      throw new Error('Empresa não vinculada ao usuário. Por favor, crie uma empresa primeiro.');
    }

    return data.company_id;
  }

  /**
   * Create a new product in the database
   */
  async createProduct(input: ProductInput) {
    const companyId = await this.getUserCompanyId();

    const { data, error } = await this.supabase
      .from('products')
      .insert({
        ...input,
        company_id: companyId
      })
      .select()
      .single();

    if (error) throw error;

    // Log the initial stock movement if quantity was supplied
    if (input.stock_quantity && input.stock_quantity > 0) {
      await this.supabase.from('stock_movements').insert({
        company_id: companyId,
        product_id: data.id,
        quantity: input.stock_quantity,
        type: 'input',
        description: 'Lançamento de saldo inicial de estoque no cadastro.'
      });
    }

    return data;
  }

  /**
   * List all products under the active tenant
   */
  async listProducts(filters?: { type?: string; search?: string }) {
    let query = this.supabase
      .from('products')
      .select('*');

    if (filters?.type) {
      query = query.eq('type', filters.type);
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`);
    }

    const { data, error } = await query.order('name', { ascending: true });

    if (error) throw error;
    return data;
  }

  /**
   * Retrieve a single product by ID
   */
  async getProductById(id: string) {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Edit product details
   */
  async updateProduct(id: string, input: Partial<ProductInput>) {
    const { data, error } = await this.supabase
      .from('products')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Remove product catalog entry
   */
  async deleteProduct(id: string) {
    const { error } = await this.supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true, id };
  }
}
