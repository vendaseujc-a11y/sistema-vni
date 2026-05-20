export const dashboardHTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VNI - Console de CRM & ERP Modular</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090b14;
      --panel: rgba(17, 20, 38, 0.65);
      --border: rgba(255, 255, 255, 0.07);
      --primary: #3b82f6;
      --primary-glow: rgba(59, 130, 246, 0.15);
      --secondary: #8b5cf6;
      --secondary-glow: rgba(139, 92, 246, 0.15);
      --success: #10b981;
      --success-glow: rgba(16, 185, 129, 0.15);
      --warning: #f59e0b;
      --danger: #ef4444;
      --text: #f3f4f6;
      --text-muted: #9ca3af;
      --font-sans: 'Inter', sans-serif;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg);
      background-image: 
        radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.08) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.08) 0px, transparent 50%);
      font-family: var(--font-sans);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      padding: 2rem 1rem;
      flex-grow: 1;
    }

    /* HEADER */
    header {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--border);
    }

    @media (min-width: 768px) {
      header {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .logo-badge {
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-weight: 700;
      letter-spacing: 1px;
      box-shadow: 0 4px 15px var(--primary-glow);
    }

    h1 {
      font-size: 1.5rem;
      font-weight: 700;
      background: linear-gradient(to right, #ffffff, #9ca3af);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .auth-status-bar {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .status-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(239, 68, 68, 0.05);
      border: 1px solid rgba(239, 68, 68, 0.2);
      padding: 0.35rem 0.85rem;
      border-radius: 2rem;
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--danger);
    }

    .status-badge.connected {
      background: rgba(16, 185, 129, 0.05);
      border: 1px solid rgba(16, 185, 129, 0.2);
      color: var(--success);
    }

    .status-dot {
      width: 8px;
      height: 8px;
      background-color: var(--danger);
      border-radius: 50%;
    }

    .status-badge.connected .status-dot {
      background-color: var(--success);
      box-shadow: 0 0 8px var(--success);
    }

    /* NAVIGATION TABS */
    .tabs-nav {
      display: flex;
      gap: 0.5rem;
      overflow-x: auto;
      margin-bottom: 2rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--border);
    }

    .tab-btn {
      background: none;
      border: none;
      color: var(--text-muted);
      padding: 0.6rem 1.2rem;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      border-radius: 0.5rem;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .tab-btn:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.04);
    }

    .tab-btn.active {
      color: #ffffff;
      background: var(--primary-glow);
      border: 1px solid var(--primary);
    }

    /* CARD STRUCTURES */
    .card {
      background: var(--panel);
      backdrop-filter: blur(12px);
      border: 1px solid var(--border);
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      margin-bottom: 1.5rem;
      display: none;
    }

    .card.active {
      display: block;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .card-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    /* GRID CONTROLS */
    .form-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.25rem;
      margin-bottom: 1.5rem;
    }

    @media (min-width: 768px) {
      .form-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .form-grid.triple {
        grid-template-columns: repeat(3, 1fr);
      }
      .span-2 {
        grid-column: span 2;
      }
    }

    /* FORM INPUTS */
    .input-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    label {
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--text-muted);
    }

    input, select, textarea {
      background: rgba(0, 0, 0, 0.25);
      border: 1px solid var(--border);
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      color: #ffffff;
      font-family: var(--font-sans);
      font-size: 0.9rem;
      outline: none;
      transition: all 0.2s ease;
      width: 100%;
    }

    input:focus, select:focus, textarea:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
    }

    .btn-submit {
      background: linear-gradient(135deg, var(--primary), #2563eb);
      border: none;
      color: #ffffff;
      font-weight: 600;
      font-size: 0.9rem;
      padding: 0.85rem 1.75rem;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 4px 12px var(--primary-glow);
    }

    .btn-submit:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 15px var(--primary-glow);
    }

    /* TABLE */
    .table-container {
      overflow-x: auto;
      margin-top: 1.5rem;
      border: 1px solid var(--border);
      border-radius: 0.75rem;
      background: rgba(0, 0, 0, 0.15);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
      text-align: left;
    }

    th, td {
      padding: 1rem 1.25rem;
      border-bottom: 1px solid var(--border);
    }

    th {
      background: rgba(0, 0, 0, 0.3);
      color: #ffffff;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.5px;
    }

    tr:last-child td {
      border-bottom: none;
    }

    tr:hover td {
      background: rgba(255, 255, 255, 0.02);
    }

    /* BADGES */
    .badge {
      display: inline-block;
      padding: 0.2rem 0.6rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .badge.info { background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); color: #93c5fd; }
    .badge.success { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); color: #34d399; }
    .badge.warning { background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.2); color: #fcd34d; }
    .badge.danger { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); color: #fca5a5; }

    /* ACTION BUTTONS */
    .btn-action {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border);
      color: #ffffff;
      padding: 0.35rem 0.75rem;
      border-radius: 4px;
      font-size: 0.8rem;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .btn-action:hover {
      background: var(--success-glow);
      border-color: var(--success);
      color: #ffffff;
    }

    /* SALES CART */
    .cart-section {
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid var(--border);
      border-radius: 0.75rem;
      padding: 1.25rem;
      margin-top: 1rem;
      margin-bottom: 1.5rem;
    }

    .cart-title {
      font-size: 0.9rem;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 1rem;
      display: flex;
      justify-content: space-between;
    }

    .cart-items-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .cart-item-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--border);
      padding: 0.5rem 0.75rem;
      border-radius: 0.35rem;
      font-size: 0.85rem;
    }

    .cart-remove-btn {
      color: var(--danger);
      background: none;
      border: none;
      cursor: pointer;
      font-weight: bold;
    }

    /* NOTIFICATION TOAST */
    .toast {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: #121420;
      border: 1px solid var(--border);
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      z-index: 1000;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.3s ease;
    }

    .toast.show {
      transform: translateY(0);
      opacity: 1;
    }

    .toast-success { border-color: var(--success); color: #ffffff; }
    .toast-error { border-color: var(--danger); color: #ffffff; }

    /* FOOTER */
    footer {
      text-align: center;
      padding: 2rem 0;
      font-size: 0.8rem;
      color: var(--text-muted);
      border-top: 1px solid var(--border);
      margin-top: auto;
    }
  </style>
</head>
<body>
  
  <div class="container">
    
    <!-- HEADER -->
    <header>
      <div class="logo-container">
        <div class="logo-badge">VNI</div>
        <div>
          <h1>Sistema ERP & CRM Corporativo</h1>
          <p id="company-name-subtitle" style="font-size: 0.75rem; color: var(--text-muted);">Isolamento Multitenant Ativo (Carregando...)</p>
        </div>
      </div>
      <div class="auth-status-bar">
        <div id="connection-badge" class="status-badge">
          <div class="status-dot"></div>
          <span id="connection-text">Desconectado</span>
        </div>
      </div>
    </header>

    <!-- NAVIGATION TABS -->
    <div class="tabs-nav">
      <button class="tab-btn active" onclick="switchTab('auth')">🔐 Sessão & Empresa</button>
      <button class="tab-btn" onclick="switchTab('crm')">👥 Clientes (CRM)</button>
      <button class="tab-btn" onclick="switchTab('stock')">📦 Produtos & Estoque</button>
      <button class="tab-btn" onclick="switchTab('sales')">🛒 Pedidos & Vendas</button>
      <button class="tab-btn" onclick="switchTab('financial')">💰 Caixa & Financeiro</button>
    </div>

    <!-- TAB 1: AUTH & COMPANY -->
    <div id="tab-auth" class="card active">
      <span class="card-title">🔐 Controle de Acesso e Perfil Corporativo</span>
      
      <!-- NOT SIGNED IN VIEW -->
      <div id="auth-signed-out">
        <p class="muted" style="margin-bottom: 1.5rem;">Cadastre-se ou entre em sua conta administrativa para inicializar o seu ERP dedicado e isolado por Row Level Security.</p>
        <div class="form-grid">
          <div class="input-group">
            <label>E-mail Corporativo</label>
            <input type="email" id="auth-email" placeholder="nome@empresa.com" value="ecortesbr@gmail.com">
          </div>
          <div class="input-group">
            <label>Senha de Acesso</label>
            <input type="password" id="auth-password" placeholder="Sua senha secreta">
          </div>
        </div>
        <div style="display: flex; gap: 1rem;">
          <button class="btn-submit" onclick="handleAuth('signin')">Entrar na Conta</button>
          <button class="btn-submit" style="background: rgba(255, 255, 255, 0.05); border: 1px solid var(--border);" onclick="handleAuth('signup')">Criar Nova Conta</button>
        </div>
      </div>

      <!-- SIGNED IN VIEW -->
      <div id="auth-signed-in" style="display: none;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem;">
          <div>
            <h3 style="color: #ffffff;" id="user-welcome-title">Bem-vindo, Administrador!</h3>
            <p class="muted" id="user-email-subtitle">ecortesbr@gmail.com</p>
          </div>
          <button class="btn-action" style="color: var(--danger);" onclick="handleSignOut()">Sair da Conta</button>
        </div>

        <!-- NO COMPANY DETECTED VIEW -->
        <div id="company-provision-box" style="display: none; background: rgba(139, 92, 246, 0.05); border: 1px solid rgba(139, 92, 246, 0.2); padding: 1.5rem; border-radius: 0.75rem;">
          <h4 style="color: #ffffff; margin-bottom: 0.5rem;">🏢 Vincular Nova Empresa (Locatário ERP)</h4>
          <p class="muted" style="margin-bottom: 1rem;">Sua conta de usuário foi autenticada, mas ela ainda não possui uma Empresa (Tenant) vinculada no PostgreSQL. Crie uma agora para habilitar as políticas de RLS e começar a cadastrar dados.</p>
          <div class="form-grid">
            <div class="input-group">
              <label>Nome Comercial / Razão Social</label>
              <input type="text" id="company-name" placeholder="VNI Distribuidora Ltda">
            </div>
            <div class="input-group">
              <label>CNPJ da Empresa</label>
              <input type="text" id="company-cnpj" placeholder="00.000.000/0001-00">
            </div>
          </div>
          <button class="btn-submit" style="background: linear-gradient(135deg, var(--secondary), #7c3aed);" onclick="handleCreateCompany()">Inicializar Empresa ERP</button>
        </div>

        <!-- COMPANY DETAILS ACTIVE VIEW -->
        <div id="company-details-box" style="display: none; background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.2); padding: 1.5rem; border-radius: 0.75rem;">
          <h4 style="color: #ffffff; margin-bottom: 0.5rem;">🏢 Empresa Vinculada com Sucesso</h4>
          <p class="muted" style="margin-bottom: 1rem;">O seu ERP local está conectado à sua empresa em nuvem no Supabase. Os dados de todos os módulos estão isolados.</p>
          <div class="form-grid triple">
            <div>
              <label>ID da Empresa (PostgreSQL UUID)</label>
              <p style="font-family: monospace; font-size: 0.8rem; margin-top: 0.25rem; color: #ffffff;" id="company-uuid-label">-</p>
            </div>
            <div>
              <label>Nome / Razão Social</label>
              <p style="font-size: 0.9rem; font-weight: 600; margin-top: 0.25rem; color: #ffffff;" id="company-name-label">-</p>
            </div>
            <div>
              <label>CNPJ Registrado</label>
              <p style="font-size: 0.9rem; margin-top: 0.25rem; color: #ffffff;" id="company-cnpj-label">-</p>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- TAB 2: CRM & CLIENTES -->
    <div id="tab-crm" class="card">
      <span class="card-title">👥 Gestão de Clientes e Interações CRM</span>
      
      <!-- CREATE CUSTOMER FORM -->
      <h3 style="font-size: 1rem; color: #ffffff; margin-bottom: 1rem;">Cadastrar Novo Cliente</h3>
      <div class="form-grid">
        <div class="input-group">
          <label>Nome / Razão Social</label>
          <input type="text" id="cust-name" placeholder="Ex: JC Distribuidora Ltda">
        </div>
        <div class="input-group">
          <label>Tipo de Pessoa</label>
          <select id="cust-type">
            <option value="PJ">Pessoa Jurídica (PJ)</option>
            <option value="PF">Pessoa Física (PF)</option>
          </select>
        </div>
        <div class="input-group">
          <label>CPF ou CNPJ</label>
          <input type="text" id="cust-doc" placeholder="12.345.678/0001-99">
        </div>
        <div class="input-group">
          <label>E-mail de Contato</label>
          <input type="email" id="cust-email" placeholder="financeiro@empresa.com">
        </div>
        <div class="input-group">
          <label>Telefone / WhatsApp</label>
          <input type="text" id="cust-phone" placeholder="(11) 99999-8888">
        </div>
        <div class="input-group">
          <label>Cidade / UF</label>
          <div style="display: grid; grid-template-columns: 3fr 1fr; gap: 0.5rem;">
            <input type="text" id="cust-city" placeholder="São Paulo">
            <input type="text" id="cust-state" placeholder="SP" maxlength="2">
          </div>
        </div>
      </div>
      <button class="btn-submit" onclick="handleCreateCustomer()">Cadastrar Cliente no CRM</button>

      <!-- CUSTOMERS LIST -->
      <h3 style="font-size: 1rem; color: #ffffff; margin-top: 2rem; margin-bottom: 0.5rem;">Clientes Cadastrados</h3>
      <div class="table-container">
        <table id="customers-table">
          <thead>
            <tr>
              <th>Nome / Razão Social</th>
              <th>Documento</th>
              <th>E-mail</th>
              <th>Contato</th>
              <th>Status</th>
              <th>Compras Totais</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="6" style="text-align: center; color: var(--text-muted);">Nenhum cliente cadastrado ainda.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 3: PRODUCTS & STOCK -->
    <div id="tab-stock" class="card">
      <span class="card-title">📦 Catálogo de Mercadorias e Controle de Estoque</span>
      
      <!-- CREATE PRODUCT FORM -->
      <h3 style="font-size: 1rem; color: #ffffff; margin-bottom: 1rem;">Cadastrar Nova Mercadoria / Insumo</h3>
      <div class="form-grid triple">
        <div class="input-group">
          <label>Código SKU (Único)</label>
          <input type="text" id="prod-sku" placeholder="SKU-PROD-100">
        </div>
        <div class="input-group">
          <label>Nome do Produto</label>
          <input type="text" id="prod-name" placeholder="Coca Cola 2L">
        </div>
        <div class="input-group">
          <label>Unidade de Medida</label>
          <select id="prod-unit">
            <option value="UN">Unidade (UN)</option>
            <option value="KG">Quilo (KG)</option>
            <option value="L">Litro (L)</option>
            <option value="CX">Caixa (CX)</option>
            <option value="M">Metro (M)</option>
          </select>
        </div>
        <div class="input-group">
          <label>Preço de Custo (R$)</label>
          <input type="number" id="prod-cost" placeholder="2.50" step="0.01">
        </div>
        <div class="input-group">
          <label>Preço de Venda (R$)</label>
          <input type="number" id="prod-price" placeholder="6.90" step="0.01">
        </div>
        <div class="input-group">
          <label>Saldo Inicial de Estoque</label>
          <input type="number" id="prod-stock" placeholder="50">
        </div>
        <div class="input-group">
          <label>Estoque Mínimo (Alerta)</label>
          <input type="number" id="prod-min" placeholder="5">
        </div>
        <div class="input-group">
          <label>Tipo de Item</label>
          <select id="prod-type">
            <option value="product">Produto Acabado (Venda)</option>
            <option value="raw_material">Matéria-Prima (Consumo)</option>
            <option value="service">Prestação de Serviço</option>
          </select>
        </div>
      </div>
      <button class="btn-submit" onclick="handleCreateProduct()">Cadastrar Produto no Estoque</button>

      <!-- PRODUCTS LIST -->
      <h3 style="font-size: 1rem; color: #ffffff; margin-top: 2rem; margin-bottom: 0.5rem;">Inventário e Saldo de Estoque</h3>
      <div class="table-container">
        <table id="products-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Nome</th>
              <th>Tipo</th>
              <th>Unidade</th>
              <th>Custo (R$)</th>
              <th>Venda (R$)</th>
              <th>Estoque Disponível</th>
              <th>Status Estoque</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="8" style="text-align: center; color: var(--text-muted);">Nenhum produto cadastrado ainda.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 4: SALES ORDERS -->
    <div id="tab-sales" class="card">
      <span class="card-title">🛒 Emissão de Vendas e Faturamento</span>
      
      <div class="form-grid">
        <!-- CUSTOMER SELECT -->
        <div class="input-group">
          <label>Selecione o Cliente</label>
          <select id="sale-customer-select">
            <option value="">Selecione um cliente cadastrado...</option>
          </select>
        </div>
        
        <!-- PRODUCT ADDER -->
        <div class="input-group" style="background: rgba(255,255,255,0.02); border: 1px dashed var(--border); padding: 1rem; border-radius: 0.5rem;">
          <label style="color: #ffffff; font-weight: 600; margin-bottom: 0.5rem;">Adicionar Item ao Carrinho</label>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <select id="sale-product-select" onchange="updateProductUnitPrice()">
              <option value="">Selecione um produto...</option>
            </select>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
              <input type="number" id="sale-product-qty" placeholder="Qtd" value="1">
              <input type="number" id="sale-product-price" placeholder="Preço (R$)" step="0.01">
            </div>
            <button class="btn-action" style="text-align: center; justify-content: center; background: rgba(59,130,246,0.1); border-color: rgba(59,130,246,0.3);" onclick="addCartItem()">Adicionar Item</button>
          </div>
        </div>
      </div>

      <!-- CART CONTAINER -->
      <div class="cart-section">
        <div class="cart-title">
          <span>Carrinho de Vendas</span>
          <span id="cart-total-label">Total: R$ 0,00</span>
        </div>
        <div class="cart-items-list" id="cart-items-container">
          <p class="muted" style="text-align: center; margin: 1rem 0;">Seu carrinho está vazio. Escolha um produto e adicione.</p>
        </div>
        <button class="btn-submit" style="width: 100%;" onclick="handleCreateSalesOrder()">Salvar Pedido de Venda (Orçamento)</button>
      </div>

      <!-- SALES ORDERS LIST -->
      <h3 style="font-size: 1rem; color: #ffffff; margin-top: 2rem; margin-bottom: 0.5rem;">Pedidos de Vendas Registrados</h3>
      <div class="table-container">
        <table id="sales-table">
          <thead>
            <tr>
              <th>Criação</th>
              <th>Cliente</th>
              <th>Valor do Pedido</th>
              <th>Status Venda</th>
              <th>NF-e Status</th>
              <th>Ações de Faturamento</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="6" style="text-align: center; color: var(--text-muted);">Nenhuma venda registrada ainda.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- TAB 5: FINANCIAL & LEDGER -->
    <div id="tab-financial" class="card">
      <span class="card-title">💰 Caixa Financeiro e Livro-Razão</span>
      <p class="muted" style="margin-bottom: 1.5rem;">Este módulo representa o livro-razão financeiro do seu ERP. Quando você clica em <b>"Faturar/Aprovar"</b> na aba de Vendas, a automação por trigger do PostgreSQL gera automaticamente uma conta a receber aqui.</p>
      
      <!-- BALANCES -->
      <div class="form-grid triple" style="margin-bottom: 1.5rem;">
        <div style="background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.2); padding: 1rem; border-radius: 0.5rem; text-align: center;">
          <label>Receita Recebida</label>
          <h4 style="font-size: 1.5rem; font-weight: 700; color: var(--success); margin-top: 0.25rem;">R$ 0,00</h4>
        </div>
        <div style="background: rgba(59, 130, 246, 0.05); border: 1px solid rgba(59, 130, 246, 0.2); padding: 1rem; border-radius: 0.5rem; text-align: center;">
          <label>Recebíveis Pendentes (A Receber)</label>
          <h4 id="financial-receivables-label" style="font-size: 1.5rem; font-weight: 700; color: var(--primary); margin-top: 0.25rem;">R$ 0,00</h4>
        </div>
        <div style="background: rgba(245, 158, 11, 0.05); border: 1px solid rgba(245, 158, 11, 0.2); padding: 1rem; border-radius: 0.5rem; text-align: center;">
          <label>Despesas (Contas a Pagar)</label>
          <h4 style="font-size: 1.5rem; font-weight: 700; color: var(--warning); margin-top: 0.25rem;">R$ 0,00</h4>
        </div>
      </div>

      <!-- TRANSACTIONS LIST -->
      <h3 style="font-size: 1rem; color: #ffffff; margin-bottom: 0.5rem;">Lançamentos de Contas a Pagar & Receber (Fluxo de Caixa)</h3>
      <div class="table-container">
        <table id="transactions-table">
          <thead>
            <tr>
              <th>Vencimento</th>
              <th>Descrição</th>
              <th>Valor (R$)</th>
              <th>Fluxo</th>
              <th>Status Lançamento</th>
              <th>Categoria</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="6" style="text-align: center; color: var(--text-muted);">Nenhum lançamento no fluxo de caixa ainda.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- TOAST NOTIFICATION -->
    <div id="toast" class="toast">
      <span id="toast-message">Mensagem...</span>
    </div>

    <!-- FOOTER -->
    <footer>
      <p>VNI CRM & ERP - Sistema de Próxima Geração com PostgreSQL e RLS.</p>
    </footer>

  </div>

  <!-- LOAD SUPABASE JS FROM CDN -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  
  <script>
    // Configuration dynamically injected by Node.js server!
    const SUPABASE_URL = "__SUPABASE_URL__";
    const SUPABASE_ANON_KEY = "__SUPABASE_ANON_KEY__";

    let supabase = null;
    let userSession = null;
    let activeCompany = null;
    let currentCart = [];
    
    // Loaded lists for dropdown selections
    let customerList = [];
    let productList = [];

    // Initialize Supabase Client
    if (SUPABASE_URL !== "__SUPABASE_URL__" && SUPABASE_ANON_KEY !== "__SUPABASE_ANON_KEY__") {
      try {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      } catch (err) {
        console.error("Falha ao inicializar o Supabase client:", err);
      }
    }

    // Initialize application sessions
    window.addEventListener('load', async () => {
      if (!supabase) {
        showToast("⚠️ Supabase não configurado. Adicione as chaves no .env e suba novamente na Vercel.", "error");
        return;
      }

      // Check current auth session
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        userSession = session;
        updateConnectionBadge(true, session.user.email);
        document.getElementById('auth-signed-out').style.display = 'none';
        document.getElementById('auth-signed-in').style.display = 'block';
        document.getElementById('user-email-subtitle').innerText = session.user.email;
        
        // Fetch linked company profile
        await fetchCompanyProfile();
      } else {
        updateConnectionBadge(false);
      }
      
      // Auto listen to session updates
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (session) {
          userSession = session;
          updateConnectionBadge(true, session.user.email);
          document.getElementById('auth-signed-out').style.display = 'none';
          document.getElementById('auth-signed-in').style.display = 'block';
          document.getElementById('user-email-subtitle').innerText = session.user.email;
          await fetchCompanyProfile();
        } else {
          userSession = null;
          activeCompany = null;
          updateConnectionBadge(false);
          document.getElementById('auth-signed-out').style.display = 'block';
          document.getElementById('auth-signed-in').style.display = 'none';
          document.getElementById('company-name-subtitle').innerText = "Isolamento Multitenant Ativo (Desconectado)";
        }
      });
    });

    // switch UI Tabs
    async function switchTab(tabId) {
      // Deactivate all
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.card').forEach(card => card.classList.remove('active'));

      // Activate selected
      const activeBtn = Array.from(document.querySelectorAll('.tab-btn')).find(btn => btn.getAttribute('onclick').includes(tabId));
      if (activeBtn) activeBtn.classList.add('active');
      document.getElementById('tab-' + tabId).classList.add('active');

      // Prevent queries if not authenticated
      if (!userSession && tabId !== 'auth') {
        showToast("🔑 Por favor, faça login ou cadastre-se na aba Sessão primeiro.", "error");
        switchTab('auth');
        return;
      }

      if (userSession && !activeCompany && tabId !== 'auth') {
        showToast("🏢 Vincule uma empresa na aba Sessão para habilitar o ERP.", "error");
        switchTab('auth');
        return;
      }

      // Fetch fresh data based on tab
      if (userSession && activeCompany) {
        if (tabId === 'crm') await fetchCustomers();
        if (tabId === 'stock') await fetchProducts();
        if (tabId === 'sales') {
          await fetchCustomers();
          await fetchProducts();
          await fetchSalesOrders();
        }
        if (tabId === 'financial') await fetchFinancialTransactions();
      }
    }

    // Helper to send HTTP requests to our Node backend
    async function apiRequest(endpoint, method = 'GET', body = null) {
      if (!userSession) throw new Error("Usuário não autenticado no cliente.");
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + userSession.access_token
      };

      const options = {
        method,
        headers
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(endpoint, options);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || data.message || "Erro na chamada de API.");
      }

      return data;
    }

    // TOAST NOTIFICATIONS
    function showToast(message, type = "success") {
      const toast = document.getElementById('toast');
      const msgSpan = document.getElementById('toast-message');
      
      toast.className = 'toast show ' + (type === 'success' ? 'toast-success' : 'toast-error');
      msgSpan.innerText = message;

      setTimeout(() => {
        toast.classList.remove('show');
      }, 3500);
    }

    // CONNECTION BADGE
    function updateConnectionBadge(connected, email = "") {
      const badge = document.getElementById('connection-badge');
      const text = document.getElementById('connection-text');
      if (connected) {
        badge.className = 'status-badge connected';
        text.innerText = "Sessão Ativa: " + email;
      } else {
        badge.className = 'status-badge';
        text.innerText = "Desconectado";
      }
    }

    // AUTHENTICATION OPERATIONS
    async function handleAuth(type) {
      const email = document.getElementById('auth-email').value;
      const password = document.getElementById('auth-password').value;

      if (!email || !password) {
        showToast("Preencha todos os campos corporativos.", "error");
        return;
      }

      try {
        if (type === 'signup') {
          const { data, error } = await supabase.auth.signUp({ email, password });
          if (error) throw error;
          showToast("Conta criada! Confirme seu e-mail ou faça login.", "success");
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          showToast("Autenticado com sucesso!", "success");
        }
      } catch (err) {
        showToast(err.message, "error");
      }
    }

    async function handleSignOut() {
      try {
        await supabase.auth.signOut();
        showToast("Sessão encerrada.");
      } catch (err) {
        showToast(err.message, "error");
      }
    }

    // MULTI-TENANT COMPANY DATA LOADER
    async function fetchCompanyProfile() {
      try {
        const response = await apiRequest('/api/companies/me');
        if (response.data) {
          activeCompany = response.data;
          document.getElementById('company-name-subtitle').innerText = "Isolamento Multitenant: " + activeCompany.name;
          document.getElementById('company-provision-box').style.display = 'none';
          document.getElementById('company-details-box').style.display = 'block';
          document.getElementById('company-uuid-label').innerText = activeCompany.id;
          document.getElementById('company-name-label').innerText = activeCompany.name;
          document.getElementById('company-cnpj-label').innerText = activeCompany.cnpj || "Não cadastrado";
        } else {
          activeCompany = null;
          document.getElementById('company-name-subtitle').innerText = "Isolamento Multitenant: Sem Empresa Vinculada";
          document.getElementById('company-provision-box').style.display = 'block';
          document.getElementById('company-details-box').style.display = 'none';
        }
      } catch (err) {
        console.error("Erro ao buscar empresa:", err);
      }
    }

    async function handleCreateCompany() {
      const name = document.getElementById('company-name').value;
      const cnpj = document.getElementById('company-cnpj').value;

      if (!name) {
        showToast("O nome comercial da empresa é obrigatório.", "error");
        return;
      }

      try {
        const response = await apiRequest('/api/companies', 'POST', { name, cnpj });
        showToast(response.message);
        await fetchCompanyProfile();
      } catch (err) {
        showToast(err.message, "error");
      }
    }

    // CRM OPERATIONS
    async function fetchCustomers() {
      try {
        const response = await apiRequest('/api/crm/customers');
        customerList = response.data;
        
        // Populate Sales Customer Select dropdown
        const select = document.getElementById('sale-customer-select');
        select.innerHTML = '<option value="">Selecione um cliente cadastrado...</option>';
        customerList.forEach(c => {
          select.innerHTML += '<option value="' + c.id + '">' + c.name + ' (' + c.cpf_cnpj + ')</option>';
        });

        // Render Customers Table
        const tbody = document.querySelector('#customers-table tbody');
        if (customerList.length === 0) {
          tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">Nenhum cliente cadastrado ainda.</td></tr>';
          return;
        }

        tbody.innerHTML = '';
        customerList.forEach(c => {
          const statusBadge = c.status === 'active' ? '<span class="badge success">Ativo</span>' : (c.status === 'inactive' ? '<span class="badge danger">Inativo</span>' : '<span class="badge info">Lead</span>');
          const formattedPurchases = 'R$ ' + parseFloat(c.total_purchases).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          
          tbody.innerHTML += '<tr>' +
            '<td><b>' + c.name + '</b>' + (c.trade_name ? '<br><span style="font-size:0.75rem;color:var(--text-muted);">' + c.trade_name + '</span>' : '') + '</td>' +
            '<td>' + c.cpf_cnpj + '</td>' +
            '<td>' + (c.email || '-') + '</td>' +
            '<td>' + (c.phone || '-') + '</td>' +
            '<td>' + statusBadge + '</td>' +
            '<td>' + formattedPurchases + '</td>' +
            '</tr>';
        });
      } catch (err) {
        console.error("Erro ao buscar clientes:", err);
      }
    }

    async function handleCreateCustomer() {
      const name = document.getElementById('cust-name').value;
      const person_type = document.getElementById('cust-type').value;
      const cpf_cnpj = document.getElementById('cust-doc').value;
      const email = document.getElementById('cust-email').value;
      const phone = document.getElementById('cust-phone').value;
      const city = document.getElementById('cust-city').value;
      const state = document.getElementById('cust-state').value;

      if (!name || !cpf_cnpj) {
        showToast("Nome e documento CPF/CNPJ são obrigatórios.", "error");
        return;
      }

      try {
        const response = await apiRequest('/api/crm/customers', 'POST', {
          name, person_type, cpf_cnpj, email, phone,
          address_city: city, address_state: state
        });
        showToast(response.message);
        
        // Reset fields
        document.getElementById('cust-name').value = '';
        document.getElementById('cust-doc').value = '';
        document.getElementById('cust-email').value = '';
        document.getElementById('cust-phone').value = '';
        document.getElementById('cust-city').value = '';
        document.getElementById('cust-state').value = '';
        
        await fetchCustomers();
      } catch (err) {
        showToast(err.message, "error");
      }
    }

    // STOCK OPERATIONS
    async function fetchProducts() {
      try {
        const response = await apiRequest('/api/stock/products');
        productList = response.data;

        // Populate Sales Product Select dropdown
        const select = document.getElementById('sale-product-select');
        select.innerHTML = '<option value="">Selecione um produto...</option>';
        productList.forEach(p => {
          if (p.type !== 'raw_material') {
            select.innerHTML += '<option value="' + p.id + '">' + p.name + ' (' + p.sku + ' - R$ ' + parseFloat(p.price).toFixed(2) + ')</option>';
          }
        });

        // Render Products Table
        const tbody = document.querySelector('#products-table tbody');
        if (productList.length === 0) {
          tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: var(--text-muted);">Nenhum produto cadastrado ainda.</td></tr>';
          return;
        }

        tbody.innerHTML = '';
        productList.forEach(p => {
          const typeLabel = p.type === 'service' ? '<span class="badge info">Serviço</span>' : (p.type === 'raw_material' ? '<span class="badge warning">Insumo</span>' : '<span class="badge success">Produto</span>');
          const cost = 'R$ ' + parseFloat(p.cost_price).toFixed(2);
          const price = 'R$ ' + parseFloat(p.price).toFixed(2);
          const stock = parseFloat(p.stock_quantity).toFixed(0);
          
          let stockStatus = '<span class="badge success">Normal</span>';
          if (p.type !== 'service') {
            if (p.stock_quantity <= p.min_stock) {
              stockStatus = '<span class="badge danger">Mínimo / Alerta</span>';
            }
          } else {
            stockStatus = '<span class="badge info">Ilimitado</span>';
          }

          tbody.innerHTML += '<tr>' +
            '<td><code>' + p.sku + '</code></td>' +
            '<td><b>' + p.name + '</b></td>' +
            '<td>' + typeLabel + '</td>' +
            '<td>' + p.unit + '</td>' +
            '<td>' + cost + '</td>' +
            '<td>' + price + '</td>' +
            '<td>' + (p.type === 'service' ? '∞' : stock) + '</td>' +
            '<td>' + stockStatus + '</td>' +
            '</tr>';
        });
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
      }
    }

    async function handleCreateProduct() {
      const sku = document.getElementById('prod-sku').value;
      const name = document.getElementById('prod-name').value;
      const unit = document.getElementById('prod-unit').value;
      const cost_price = document.getElementById('prod-cost').value;
      const price = document.getElementById('prod-price').value;
      const stock_quantity = document.getElementById('prod-stock').value;
      const min_stock = document.getElementById('prod-min').value;
      const type = document.getElementById('prod-type').value;

      if (!sku || !name || !price) {
        showToast("SKU, Nome e Preço de Venda são obrigatórios.", "error");
        return;
      }

      try {
        const response = await apiRequest('/api/stock/products', 'POST', {
          sku, name, unit, cost_price, price, stock_quantity, min_stock, type
        });
        showToast(response.message);

        // Reset
        document.getElementById('prod-sku').value = '';
        document.getElementById('prod-name').value = '';
        document.getElementById('prod-cost').value = '';
        document.getElementById('prod-price').value = '';
        document.getElementById('prod-stock').value = '';
        document.getElementById('prod-min').value = '';

        await fetchProducts();
      } catch (err) {
        showToast(err.message, "error");
      }
    }

    // SALES CART & TRANS-ACTION LOGS
    function updateProductUnitPrice() {
      const prodId = document.getElementById('sale-product-select').value;
      if (!prodId) return;

      const product = productList.find(p => p.id === prodId);
      if (product) {
        document.getElementById('sale-product-price').value = parseFloat(product.price).toFixed(2);
      }
    }

    function addCartItem() {
      const prodId = document.getElementById('sale-product-select').value;
      const qty = parseFloat(document.getElementById('sale-product-qty').value);
      const price = parseFloat(document.getElementById('sale-product-price').value);

      if (!prodId || isNaN(qty) || qty <= 0 || isNaN(price) || price < 0) {
        showToast("Preencha o produto, a quantidade e o valor unitário corretos.", "error");
        return;
      }

      const product = productList.find(p => p.id === prodId);
      if (!product) return;

      // Add to array
      currentCart.push({
        product_id: prodId,
        name: product.name,
        quantity: qty,
        unit_price: price
      });

      renderCart();
    }

    function removeCartItem(index) {
      currentCart.splice(index, 1);
      renderCart();
    }

    function renderCart() {
      const container = document.getElementById('cart-items-container');
      const totalLabel = document.getElementById('cart-total-label');

      if (currentCart.length === 0) {
        container.innerHTML = '<p class="muted" style="text-align: center; margin: 1rem 0;">Seu carrinho está vazio. Escolha um produto e adicione.</p>';
        totalLabel.innerText = 'Total: R$ 0,00';
        return;
      }

      container.innerHTML = '';
      let grandTotal = 0;

      currentCart.forEach((item, index) => {
        const itemTotal = item.quantity * item.unit_price;
        grandTotal += itemTotal;

        container.innerHTML += '<div class="cart-item-row">' +
          '<span><b>' + item.name + '</b> (x' + item.quantity + ')</span>' +
          '<span>R$ ' + itemTotal.toFixed(2) + ' <button class="cart-remove-btn" onclick="removeCartItem(' + index + ')">×</button></span>' +
          '</div>';
      });

      totalLabel.innerText = 'Total: R$ ' + grandTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    async function handleCreateSalesOrder() {
      const customerId = document.getElementById('sale-customer-select').value;

      if (!customerId) {
        showToast("Por favor, selecione um cliente.", "error");
        return;
      }

      if (currentCart.length === 0) {
        showToast("O carrinho de itens deve conter no mínimo 1 produto.", "error");
        return;
      }

      try {
        const response = await apiRequest('/api/sales/orders', 'POST', {
          customer_id: customerId,
          items: currentCart
        });
        showToast(response.message);

        // Clear cart
        currentCart = [];
        renderCart();

        await fetchSalesOrders();
      } catch (err) {
        showToast(err.message, "error");
      }
    }

    async function fetchSalesOrders() {
      try {
        const response = await apiRequest('/api/sales/orders');
        const orders = response.data;

        const tbody = document.querySelector('#sales-table tbody');
        if (orders.length === 0) {
          tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">Nenhuma venda registrada ainda.</td></tr>';
          return;
        }

        tbody.innerHTML = '';
        orders.forEach(o => {
          const date = new Date(o.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
          const customerName = o.customers?.name || "Cliente Excluído";
          const amount = 'R$ ' + parseFloat(o.total_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
          
          let statusBadge = '';
          if (o.status === 'draft') statusBadge = '<span class="badge info">Orçamento</span>';
          if (o.status === 'approved') statusBadge = '<span class="badge success">Aprovado</span>';
          if (o.status === 'invoiced') statusBadge = '<span class="badge success">Faturado (NF-e)</span>';
          if (o.status === 'cancelled') statusBadge = '<span class="badge danger">Cancelado</span>';

          let nfeBadge = '';
          if (o.nfe_status === 'not_issued') nfeBadge = '<span class="badge info">Não Emitida</span>';
          if (o.nfe_status === 'issued') nfeBadge = '<span class="badge success">Emitida</span>';
          if (o.nfe_status === 'error') nfeBadge = '<span class="badge danger">Erro Sefaz</span>';

          let actionBtn = '';
          if (o.status === 'draft') {
            actionBtn = '<button class="btn-action" onclick="handleInvoiceSale(\\'' + o.id + '\\')">Faturar Venda</button>';
          } else if (o.status === 'approved') {
            actionBtn = '<button class="btn-action" style="color:var(--danger);border-color:var(--border);" onclick="handleCancelSale(\\'' + o.id + '\\')">Cancelar Faturamento</button>';
          } else {
            actionBtn = '<span style="font-size:0.75rem;color:var(--text-muted);">Transação Finalizada</span>';
          }

          tbody.innerHTML += '<tr>' +
            '<td>' + date + '</td>' +
            '<td><b>' + customerName + '</b></td>' +
            '<td>' + amount + '</td>' +
            '<td>' + statusBadge + '</td>' +
            '<td>' + nfeBadge + '</td>' +
            '<td>' + actionBtn + '</td>' +
            '</tr>';
        });
      } catch (err) {
        console.error("Erro ao buscar vendas:", err);
      }
    }

    async function handleInvoiceSale(orderId) {
      try {
        const response = await apiRequest('/api/sales/orders/' + orderId + '/status', 'PUT', { status: 'approved' });
        showToast("Pedido faturado! Estoque atualizado e contas a receber geradas no financeiro.");
        await fetchSalesOrders();
      } catch (err) {
        showToast(err.message, "error");
      }
    }

    async function handleCancelSale(orderId) {
      try {
        const response = await apiRequest('/api/sales/orders/' + orderId + '/status', 'PUT', { status: 'cancelled' });
        showToast("Pedido de venda cancelado. Estoque estornado.");
        await fetchSalesOrders();
      } catch (err) {
        showToast(err.message, "error");
      }
    }

    // FINANCIAL LEDGER CASH FLOW VIEW
    async function fetchFinancialTransactions() {
      try {
        const response = await apiRequest('/api/financial/transactions');
        const txs = response.data;

        let totalReceivables = 0;

        const tbody = document.querySelector('#transactions-table tbody');
        if (txs.length === 0) {
          tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">Nenhum lançamento no fluxo de caixa ainda.</td></tr>';
          document.getElementById('financial-receivables-label').innerText = 'R$ 0,00';
          return;
        }

        tbody.innerHTML = '';
        txs.forEach(t => {
          const date = new Date(t.due_date).toLocaleDateString('pt-BR');
          const amountVal = parseFloat(t.amount);
          const amount = 'R$ ' + amountVal.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
          
          if (t.type === 'receivable' && t.status === 'pending') {
            totalReceivables += amountVal;
          }

          const typeLabel = t.type === 'receivable' ? '<span class="badge success">Entrada (Receber)</span>' : '<span class="badge danger">Saída (Pagar)</span>';
          const statusBadge = t.status === 'paid' ? '<span class="badge success">Pago</span>' : (t.status === 'cancelled' ? '<span class="badge danger">Cancelado</span>' : '<span class="badge warning">Aguardando Pagamento</span>');

          tbody.innerHTML += '<tr>' +
            '<td>' + date + '</td>' +
            '<td><b>' + t.description + '</b></td>' +
            '<td>' + amount + '</td>' +
            '<td>' + typeLabel + '</td>' +
            '<td>' + statusBadge + '</td>' +
            '<td><code>' + t.category + '</code></td>' +
            '</tr>';
        });

        // Update financial widget header
        document.getElementById('financial-receivables-label').innerText = 'R$ ' + totalReceivables.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      } catch (err) {
        console.error("Erro ao buscar transações financeiras:", err);
      }
    }
  </script>
</body>
</html>`;
