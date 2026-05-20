import { SupabaseClient } from '@supabase/supabase-js';

export interface SalesItemInput {
  product_id: string;
  quantity: number;
  unit_price: number;
}

export interface SalesOrderInput {
  customer_id: string;
  items: SalesItemInput[];
}

export class SalesService {
  private supabase: SupabaseClient;
  private userId: string;

  constructor(supabaseClient: SupabaseClient, userId: string) {
    this.supabase = supabaseClient;
    this.userId = userId;
  }

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
   * Create a new sales order with child line items
   */
  async createSalesOrder(input: SalesOrderInput) {
    const companyId = await this.getUserCompanyId();

    // 1. Calculate total order amount
    const totalAmount = input.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);

    // 2. Insert parent Sales Order (default status is 'draft')
    const { data: order, error: orderError } = await this.supabase
      .from('sales_orders')
      .insert({
        company_id: companyId,
        customer_id: input.customer_id,
        total_amount: totalAmount,
        status: 'draft',
        nfe_status: 'not_issued'
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 3. Prepare child sales items
    const itemsToInsert = input.items.map(item => ({
      company_id: companyId,
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price
    }));

    // 4. Batch insert Sales Items
    const { error: itemsError } = await this.supabase
      .from('sales_items')
      .insert(itemsToInsert);

    if (itemsError) {
      // Rollback (delete the parent order in case of failure, simulating a transaction)
      await this.supabase.from('sales_orders').delete().eq('id', order.id);
      throw itemsError;
    }

    return this.getSalesOrderById(order.id);
  }

  /**
   * List all sales orders under the active tenant
   */
  async listSalesOrders(filters?: { status?: string }) {
    let query = this.supabase
      .from('sales_orders')
      .select(`
        *,
        customers (
          name,
          cpf_cnpj
        )
      `);

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  /**
   * Retrieve a single sales order with its line items
   */
  async getSalesOrderById(id: string) {
    const { data, error } = await this.supabase
      .from('sales_orders')
      .select(`
        *,
        customers (*),
        sales_items (
          id,
          product_id,
          quantity,
          unit_price,
          total_price,
          products (
            name,
            sku,
            unit
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Updates a sales order status. If transitioned to 'approved', it will automatically:
   * 1. Deduct stock inventory for all items
   * 2. Log stock movements
   * 3. Recalculate customer purchasing stats
   * 4. Provision Accounts Receivable ledger
   * (all managed transparently by Supabase/Postgres triggers!)
   */
  async updateSalesOrderStatus(id: string, status: 'draft' | 'approved' | 'invoiced' | 'cancelled') {
    const { data, error } = await this.supabase
      .from('sales_orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.getSalesOrderById(id);
  }

  /**
   * Deletes a draft/cancelled sales order
   */
  async deleteSalesOrder(id: string) {
    // Only allow deletion if not approved/invoiced to maintain fiscal compliance
    const order = await this.getSalesOrderById(id);
    if (order.status === 'approved' || order.status === 'invoiced') {
      throw new Error('Não é permitido deletar pedidos faturados ou aprovados. Cancele o pedido primeiro.');
    }

    const { error } = await this.supabase
      .from('sales_orders')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true, id };
  }
}
