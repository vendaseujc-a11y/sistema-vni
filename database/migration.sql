-- ============================================================================
-- CRM & ERP MODULAR SYSTEM - SUPABASE POSTGRESQL MIGRATION
-- ============================================================================
-- Description: Establishes a highly performant, automated, multi-tenant database
--              structure. Employs RLS (Row Level Security) isolated by company,
--              automated triggers, and foreign key indexes.
-- ============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. BASE AND TENANCY SCHEMAS
-- ============================================================================

-- Companies / Tenants
CREATE TABLE public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255),
    cnpj VARCHAR(18) UNIQUE,
    state_registration VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(255),
    address_street VARCHAR(255),
    address_number VARCHAR(50),
    address_neighborhood VARCHAR(100),
    address_city VARCHAR(100),
    address_state VARCHAR(2),
    address_zipcode VARCHAR(9),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User Profiles (Extends Supabase Auth users table)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    full_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member', 'accountant')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 2. CRM & CLIENTS MODULE
-- ============================================================================

-- Customers (Pessoa Física or Jurídica)
CREATE TABLE public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    person_type VARCHAR(2) NOT NULL CHECK (person_type IN ('PF', 'PJ')),
    name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    cpf_cnpj VARCHAR(18) NOT NULL,
    state_registration VARCHAR(20),
    address_street VARCHAR(255),
    address_number VARCHAR(50),
    address_neighborhood VARCHAR(100),
    address_city VARCHAR(100),
    address_state VARCHAR(2),
    address_zipcode VARCHAR(9),
    status VARCHAR(50) NOT NULL DEFAULT 'lead' CHECK (status IN ('lead', 'active', 'inactive')),
    total_purchases DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    last_purchase_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Customer Interactions History
CREATE TABLE public.interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('email', 'call', 'meeting', 'whatsapp', 'system_event')),
    description TEXT NOT NULL,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 3. INVENTORY & PRODUCTION MODULE
-- ============================================================================

-- Products, Services & Raw Materials
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    sku VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    cost_price DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    stock_quantity DECIMAL(12, 3) NOT NULL DEFAULT 0.000,
    min_stock DECIMAL(12, 3) NOT NULL DEFAULT 0.000,
    max_stock DECIMAL(12, 3) NOT NULL DEFAULT 0.000,
    unit VARCHAR(10) NOT NULL DEFAULT 'UN' CHECK (unit IN ('UN', 'KG', 'L', 'M', 'HR', 'CX')),
    type VARCHAR(50) NOT NULL DEFAULT 'product' CHECK (type IN ('product', 'raw_material', 'service')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_sku_per_company UNIQUE (company_id, sku)
);

-- Bill of Materials (BOM) / Product Components
CREATE TABLE public.product_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    parent_product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    component_product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    quantity_needed DECIMAL(12, 3) NOT NULL CHECK (quantity_needed > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_bom_entry UNIQUE (parent_product_id, component_product_id),
    CONSTRAINT prevent_self_reference CHECK (parent_product_id <> component_product_id)
);

-- Production Orders (Simple Manufacturing)
CREATE TABLE public.production_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    quantity DECIMAL(12, 3) NOT NULL CHECK (quantity > 0),
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Stock Movement Logs
CREATE TABLE public.stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    quantity DECIMAL(12, 3) NOT NULL, -- Positive for entries, Negative for exits
    type VARCHAR(20) NOT NULL CHECK (type IN ('input', 'output', 'production', 'sale', 'loss', 'adjustment')),
    description VARCHAR(255) NOT NULL,
    reference_id UUID, -- References sale_order_id, production_order_id, etc.
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 4. SALES & NF-e MODULE
-- ============================================================================

-- Sales Orders
CREATE TABLE public.sales_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'invoiced', 'cancelled')),
    total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    nfe_status VARCHAR(50) NOT NULL DEFAULT 'not_issued' CHECK (nfe_status IN ('not_issued', 'pending', 'issued', 'error')),
    nfe_key VARCHAR(44),
    nfe_xml_path VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Sales Items
CREATE TABLE public.sales_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES public.sales_orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    quantity DECIMAL(12, 3) NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(12, 2) NOT NULL CHECK (unit_price >= 0),
    total_price DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 5. FINANCIAL & CASH FLOW MODULE
-- ============================================================================

-- Bank Accounts / Cash Registers
CREATE TABLE public.bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    account_type VARCHAR(50) NOT NULL DEFAULT 'checking' CHECK (account_type IN ('checking', 'savings', 'wallet', 'investment')),
    bank_name VARCHAR(100),
    agency VARCHAR(20),
    account_number VARCHAR(50),
    balance DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Accounts Payable & Accounts Receivable (Fluxo de Caixa)
CREATE TABLE public.financial_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    bank_account_id UUID REFERENCES public.bank_accounts(id) ON DELETE SET NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('payable', 'receivable')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    due_date DATE NOT NULL,
    payment_date TIMESTAMPTZ,
    category VARCHAR(100) NOT NULL DEFAULT 'Operational',
    sale_order_id UUID REFERENCES public.sales_orders(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 6. SERVICES & NFS-e MODULE
-- ============================================================================

-- Service Contracts (Recurrence Billing)
CREATE TABLE public.service_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount >= 0),
    recurrence_period VARCHAR(20) NOT NULL DEFAULT 'monthly' CHECK (recurrence_period IN ('monthly', 'quarterly', 'yearly')),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'cancelled')),
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Service Orders (NFS-e Execution)
CREATE TABLE public.service_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    contract_id UUID REFERENCES public.service_contracts(id) ON DELETE SET NULL,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount >= 0),
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    nfse_status VARCHAR(50) NOT NULL DEFAULT 'not_issued' CHECK (nfse_status IN ('not_issued', 'pending', 'issued', 'error')),
    nfse_xml_path VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 7. FISCAL DOCUMENTS REPOSITORY (PAINEL DO CONTADOR)
-- ============================================================================

-- Fiscal Documents (XML Storage References)
CREATE TABLE public.fiscal_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    type VARCHAR(10) NOT NULL CHECK (type IN ('nfe', 'nfse')),
    number INT NOT NULL,
    series INT NOT NULL,
    xml_content TEXT NOT NULL,
    issue_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    amount DECIMAL(12, 2) NOT NULL CHECK (amount >= 0),
    recipient_name VARCHAR(255) NOT NULL,
    recipient_cpf_cnpj VARCHAR(18) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'authorized' CHECK (status IN ('authorized', 'cancelled')),
    file_path VARCHAR(255) NOT NULL, -- Path to storage bucket
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 8. INDEXES FOR PERFORMANCE OPTIMIZATION
-- ============================================================================

-- Foreign key search optimizations
CREATE INDEX idx_profiles_company ON public.profiles(company_id);
CREATE INDEX idx_customers_company ON public.customers(company_id);
CREATE INDEX idx_interactions_customer ON public.interactions(customer_id);
CREATE INDEX idx_products_company ON public.products(company_id);
CREATE INDEX idx_bom_parent ON public.product_components(parent_product_id);
CREATE INDEX idx_bom_component ON public.product_components(component_product_id);
CREATE INDEX idx_production_orders_product ON public.production_orders(product_id);
CREATE INDEX idx_stock_movements_product ON public.stock_movements(product_id);
CREATE INDEX idx_sales_orders_customer ON public.sales_orders(customer_id);
CREATE INDEX idx_sales_items_order ON public.sales_items(order_id);
CREATE INDEX idx_sales_items_product ON public.sales_items(product_id);
CREATE INDEX idx_bank_accounts_company ON public.bank_accounts(company_id);
CREATE INDEX idx_financial_transactions_bank ON public.financial_transactions(bank_account_id);
CREATE INDEX idx_financial_transactions_due ON public.financial_transactions(due_date);
CREATE INDEX idx_service_contracts_customer ON public.service_contracts(customer_id);
CREATE INDEX idx_service_orders_contract ON public.service_orders(contract_id);
CREATE INDEX idx_fiscal_documents_company ON public.fiscal_documents(company_id);
CREATE INDEX idx_fiscal_documents_date ON public.fiscal_documents(issue_date);

-- Business columns search optimizations
CREATE INDEX idx_customers_cpf_cnpj ON public.customers(cpf_cnpj);
CREATE INDEX idx_products_sku ON public.products(sku);
CREATE INDEX idx_sales_orders_status ON public.sales_orders(status);
CREATE INDEX idx_financial_transactions_type_status ON public.financial_transactions(type, status);

-- ============================================================================
-- 9. DYNAMIC MULTI-TENANCY RLS SETUP
-- ============================================================================

-- Helper function to extract user's company context
CREATE OR REPLACE FUNCTION public.get_user_company_id()
RETURNS UUID AS $$
DECLARE
    v_company_id UUID;
BEGIN
    SELECT company_id INTO v_company_id 
    FROM public.profiles 
    WHERE id = auth.uid();
    RETURN v_company_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fiscal_documents ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES FOR COMPANIES
CREATE POLICY company_read ON public.companies
    FOR SELECT TO authenticated USING (id = public.get_user_company_id());

CREATE POLICY company_create ON public.companies
    FOR INSERT TO authenticated WITH CHECK (true); -- User creating their company

CREATE POLICY company_update ON public.companies
    FOR UPDATE TO authenticated USING (
        id = public.get_user_company_id() 
        AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- RLS POLICIES FOR PROFILES
CREATE POLICY profile_read ON public.profiles
    FOR SELECT TO authenticated USING (
        id = auth.uid() 
        OR company_id = public.get_user_company_id()
    );

CREATE POLICY profile_update ON public.profiles
    FOR UPDATE TO authenticated USING (
        id = auth.uid() 
        OR (company_id = public.get_user_company_id() AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
    );

-- GENERIC POLICY TEMPLATE FUNCTION (SCOPED BY COMPANY_ID)
-- Applying scoping policy to all other tables
CREATE POLICY tenant_isolation ON public.customers
    FOR ALL TO authenticated USING (company_id = public.get_user_company_id()) WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY tenant_isolation ON public.interactions
    FOR ALL TO authenticated USING (company_id = public.get_user_company_id()) WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY tenant_isolation ON public.products
    FOR ALL TO authenticated USING (company_id = public.get_user_company_id()) WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY tenant_isolation ON public.product_components
    FOR ALL TO authenticated USING (company_id = public.get_user_company_id()) WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY tenant_isolation ON public.production_orders
    FOR ALL TO authenticated USING (company_id = public.get_user_company_id()) WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY tenant_isolation ON public.stock_movements
    FOR ALL TO authenticated USING (company_id = public.get_user_company_id()) WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY tenant_isolation ON public.sales_orders
    FOR ALL TO authenticated USING (company_id = public.get_user_company_id()) WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY tenant_isolation ON public.sales_items
    FOR ALL TO authenticated USING (company_id = public.get_user_company_id()) WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY tenant_isolation ON public.bank_accounts
    FOR ALL TO authenticated USING (company_id = public.get_user_company_id()) WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY tenant_isolation ON public.financial_transactions
    FOR ALL TO authenticated USING (company_id = public.get_user_company_id()) WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY tenant_isolation ON public.service_contracts
    FOR ALL TO authenticated USING (company_id = public.get_user_company_id()) WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY tenant_isolation ON public.service_orders
    FOR ALL TO authenticated USING (company_id = public.get_user_company_id()) WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY tenant_isolation ON public.fiscal_documents
    FOR ALL TO authenticated USING (company_id = public.get_user_company_id()) WITH CHECK (company_id = public.get_user_company_id());

-- ============================================================================
-- 10. SYSTEM AUTH TRIGGERS
-- ============================================================================

-- Function to handle new user sync from auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', 'Novo Usuário'),
        'admin' -- Defaults first profile registered as admin
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger execution
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 11. AUTOMATED ERP DATABASE TRIGGERS
-- ============================================================================

-------------------------------------------------------------------------------
-- A. AUTOMATION: UPDATE CUSTOMER TRANSACTION METRICS
-------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_customer_stats_on_sale()
RETURNS TRIGGER AS $$
BEGIN
    -- Detect if status has transitioned to approved or invoiced
    IF (NEW.status IN ('approved', 'invoiced') AND (OLD.status IS NULL OR OLD.status NOT IN ('approved', 'invoiced'))) THEN
        UPDATE public.customers
        SET total_purchases = total_purchases + NEW.total_amount,
            last_purchase_date = NEW.updated_at,
            status = 'active'
        WHERE id = NEW.customer_id;
    
    -- If order transitions back or gets cancelled, deduct
    ELSIF (NEW.status = 'cancelled' AND OLD.status IN ('approved', 'invoiced')) THEN
        UPDATE public.customers
        SET total_purchases = GREATEST(0, total_purchases - NEW.total_amount)
        WHERE id = NEW.customer_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trg_update_customer_stats
    AFTER UPDATE OF status ON public.sales_orders
    FOR EACH ROW EXECUTE FUNCTION public.update_customer_stats_on_sale();

-------------------------------------------------------------------------------
-- B. AUTOMATION: MANAGE STOCK ON APPROVED/CANCELLED SALES
-------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.auto_manage_stock_on_sales()
RETURNS TRIGGER AS $$
DECLARE
    item RECORD;
    v_product_name VARCHAR;
BEGIN
    -- Deduct stock on Sale Approval
    IF (NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status <> 'approved')) THEN
        FOR item IN 
            SELECT product_id, quantity FROM public.sales_items WHERE order_id = NEW.id
        LOOP
            -- Check product type, only decrement stock for inventory items (not services)
            SELECT name INTO v_product_name FROM public.products WHERE id = item.product_id AND type <> 'service';
            
            IF FOUND THEN
                -- Deduct inventory
                UPDATE public.products
                SET stock_quantity = stock_quantity - item.quantity,
                    updated_at = now()
                WHERE id = item.product_id;

                -- Log stock movement
                INSERT INTO public.stock_movements (company_id, product_id, quantity, type, description, reference_id)
                VALUES (NEW.company_id, item.product_id, -item.quantity, 'sale', 'Saída automática por faturamento de Venda #' || NEW.id, NEW.id);
            END IF;
        END LOOP;
        
    -- Restore stock on Sale Cancellation
    ELSIF (NEW.status = 'cancelled' AND OLD.status = 'approved') THEN
        FOR item IN 
            SELECT product_id, quantity FROM public.sales_items WHERE order_id = NEW.id
        LOOP
            SELECT name INTO v_product_name FROM public.products WHERE id = item.product_id AND type <> 'service';
            
            IF FOUND THEN
                -- Restore inventory
                UPDATE public.products
                SET stock_quantity = stock_quantity + item.quantity,
                    updated_at = now()
                WHERE id = item.product_id;

                -- Log stock movement
                INSERT INTO public.stock_movements (company_id, product_id, quantity, type, description, reference_id)
                VALUES (NEW.company_id, item.product_id, item.quantity, 'adjustment', 'Estorno de estoque por Cancelamento de Venda #' || NEW.id, NEW.id);
            END IF;
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trg_manage_stock_on_sales
    AFTER UPDATE OF status ON public.sales_orders
    FOR EACH ROW EXECUTE FUNCTION public.auto_manage_stock_on_sales();

-------------------------------------------------------------------------------
-- C. AUTOMATION: PRODUCTION MANUFACTURING EXECUTION
-------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.execute_production_on_completion()
RETURNS TRIGGER AS $$
DECLARE
    component RECORD;
    v_comp_name VARCHAR;
    v_comp_stock DECIMAL;
BEGIN
    -- Trigger on completion
    IF (NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status <> 'completed')) THEN
        
        -- 1. Verify availability of components
        FOR component IN 
            SELECT c.component_product_id, c.quantity_needed, p.name, p.stock_quantity
            FROM public.product_components c
            JOIN public.products p ON p.id = c.component_product_id
            WHERE c.parent_product_id = NEW.product_id
        LOOP
            IF component.stock_quantity < (component.quantity_needed * NEW.quantity) THEN
                RAISE EXCEPTION 'Estoque insuficiente para a matéria-prima % (Possui: %, Necessário: %)', 
                                component.name, component.stock_quantity, (component.quantity_needed * NEW.quantity);
            END IF;
        END LOOP;

        -- 2. Consume Components
        FOR component IN 
            SELECT component_product_id, quantity_needed 
            FROM public.product_components 
            WHERE parent_product_id = NEW.product_id
        LOOP
            -- Deduct stock
            UPDATE public.products
            SET stock_quantity = stock_quantity - (component.quantity_needed * NEW.quantity)
            WHERE id = component.component_product_id;

            -- Log movement
            INSERT INTO public.stock_movements (company_id, product_id, quantity, type, description, reference_id)
            VALUES (NEW.company_id, component.component_product_id, -(component.quantity_needed * NEW.quantity), 'production', 'Consumo de insumo na Ordem de Produção #' || NEW.id, NEW.id);
        END LOOP;

        -- 3. Produce Finished Product
        UPDATE public.products
        SET stock_quantity = stock_quantity + NEW.quantity
        WHERE id = NEW.product_id;

        -- Log production entry
        INSERT INTO public.stock_movements (company_id, product_id, quantity, type, description, reference_id)
        VALUES (NEW.company_id, NEW.product_id, NEW.quantity, 'production', 'Entrada de produto acabado por Ordem de Produção #' || NEW.id, NEW.id);

    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trg_execute_production_completion
    AFTER UPDATE OF status ON public.production_orders
    FOR EACH ROW EXECUTE FUNCTION public.execute_production_on_completion();

-------------------------------------------------------------------------------
-- D. AUTOMATION: AUTOMATIC LEDGER RECEIVABLE ON SALES
-------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.provision_receivable_on_sale_approval()
RETURNS TRIGGER AS $$
DECLARE
    v_customer_name VARCHAR;
BEGIN
    IF (NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status <> 'approved')) THEN
        SELECT name INTO v_customer_name FROM public.customers WHERE id = NEW.customer_id;
        
        -- Automatically insert Accounts Receivable transaction
        INSERT INTO public.financial_transactions (
            company_id, 
            type, 
            status, 
            description, 
            amount, 
            due_date, 
            category, 
            sale_order_id
        ) VALUES (
            NEW.company_id,
            'receivable',
            'pending',
            'Recebível gerado a partir do faturamento da Venda para: ' || COALESCE(v_customer_name, 'Cliente'),
            NEW.total_amount,
            (current_date + INTERVAL '30 days')::DATE, -- Default net 30 payment terms
            'Vendas de Mercadorias',
            NEW.id
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trg_provision_receivable_on_sale
    AFTER UPDATE OF status ON public.sales_orders
    FOR EACH ROW EXECUTE FUNCTION public.provision_receivable_on_sale_approval();
