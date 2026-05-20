export const dashboardHTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sistema VNI - Console de Administração & ERP</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0b0d19;
      --panel: rgba(17, 20, 38, 0.7);
      --border: rgba(255, 255, 255, 0.08);
      --primary: #3b82f6;
      --primary-glow: rgba(59, 130, 246, 0.15);
      --secondary: #8b5cf6;
      --secondary-glow: rgba(139, 92, 246, 0.15);
      --success: #10b981;
      --success-glow: rgba(16, 185, 129, 0.2);
      --warning: #f59e0b;
      --text: #f3f4f6;
      --text-muted: #9ca3af;
      --font-sans: 'Inter', sans-serif;
      --font-mono: 'Fira Code', monospace;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg);
      background-image: 
        radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.1) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.1) 0px, transparent 50%);
      font-family: var(--font-sans);
      color: var(--text);
      min-height: 100vh;
      line-height: 1.5;
      padding: 2rem 1rem;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    /* HEADER */
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--border);
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

    .status-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(16, 185, 129, 0.05);
      border: 1px solid rgba(16, 185, 129, 0.2);
      padding: 0.35rem 0.85rem;
      border-radius: 2rem;
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--success);
    }

    .status-pulse {
      width: 8px;
      height: 8px;
      background-color: var(--success);
      border-radius: 50%;
      box-shadow: 0 0 0 0 var(--success-glow);
      animation: pulse 1.8s infinite;
    }

    @keyframes pulse {
      0% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
      }
      70% {
        transform: scale(1);
        box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
      }
      100% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
      }
    }

    /* GRID LAYOUT */
    .grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    @media (min-width: 768px) {
      .grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    /* CARDS */
    .card {
      background: var(--panel);
      backdrop-filter: blur(12px);
      border: 1px solid var(--border);
      border-radius: 1rem;
      padding: 1.5rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      transition: transform 0.2s ease, border-color 0.2s ease;
    }

    .card:hover {
      border-color: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .card-title {
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--text-muted);
      font-weight: 600;
    }

    .card-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 0.5rem;
    }

    .card-indicator {
      font-size: 0.8rem;
      color: var(--success);
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .card-indicator.alert {
      color: var(--warning);
    }

    /* TEST CONSOLE AREA */
    .console-card {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    @media (min-width: 992px) {
      .console-card {
        grid-template-columns: 2fr 3fr;
      }
    }

    .console-controls {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .section-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .section-title::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 1rem;
      background: var(--primary);
      border-radius: 2px;
    }

    p.muted {
      font-size: 0.875rem;
      color: var(--text-muted);
      margin-bottom: 1rem;
    }

    .btn-group {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    button {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border);
      color: var(--text);
      padding: 0.75rem 1.25rem;
      border-radius: 0.5rem;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s ease;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    button:hover {
      background: var(--primary-glow);
      border-color: var(--primary);
      color: #ffffff;
    }

    button.secondary-btn:hover {
      background: var(--secondary-glow);
      border-color: var(--secondary);
    }

    .btn-arrow {
      font-size: 1.1rem;
      opacity: 0.5;
      transition: transform 0.2s ease;
    }

    button:hover .btn-arrow {
      opacity: 1;
      transform: translateX(3px);
    }

    /* CODE TERMINAL DISPLAY */
    .terminal-container {
      display: flex;
      flex-direction: column;
      background: #05060b;
      border: 1px solid var(--border);
      border-radius: 0.75rem;
      overflow: hidden;
      min-height: 320px;
    }

    .terminal-header {
      background: #0e1017;
      padding: 0.6rem 1rem;
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .terminal-dots {
      display: flex;
      gap: 0.35rem;
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .dot-red { background-color: #ef4444; }
    .dot-yellow { background-color: #f59e0b; }
    .dot-green { background-color: #10b981; }

    .terminal-title {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .terminal-body {
      flex-grow: 1;
      padding: 1.25rem;
      font-family: var(--font-mono);
      font-size: 0.85rem;
      overflow-y: auto;
      white-space: pre-wrap;
      word-break: break-all;
      color: #a7f3d0; /* Soft neon green */
    }

    /* INFRASTRUCTURE EXPLAINER */
    .info-grid {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    @media (min-width: 768px) {
      .info-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    .feature-tag {
      display: inline-block;
      font-size: 0.75rem;
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border);
      margin-bottom: 0.5rem;
    }

    .feature-tag.blue { background: rgba(59, 130, 246, 0.1); border-color: rgba(59, 130, 246, 0.2); color: #93c5fd; }
    .feature-tag.purple { background: rgba(139, 92, 246, 0.1); border-color: rgba(139, 92, 246, 0.2); color: #c084fc; }

    ul.features-list {
      list-style-type: none;
      font-size: 0.875rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      color: var(--text-muted);
    }

    ul.features-list li::before {
      content: '✓';
      color: var(--success);
      margin-right: 0.5rem;
      font-weight: bold;
    }

    footer {
      text-align: center;
      margin-top: 3rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border);
      font-size: 0.8rem;
      color: var(--text-muted);
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
          <h1>Sistema CRM & ERP Modular</h1>
          <p style="font-size: 0.75rem; color: var(--text-muted);">Console de Administração & Testes</p>
        </div>
      </div>
      <div class="status-container">
        <div class="status-pulse"></div>
        <span>Servidor Ativo</span>
      </div>
    </header>

    <!-- OVERVIEW METRIC CARDS -->
    <div class="grid">
      <!-- CRM -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Módulo CRM / Clientes</span>
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="color: var(--primary);"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        </div>
        <div class="card-value">Ativo</div>
        <div class="card-indicator">
          <span>✓ RLS Isolado por Empresa</span>
        </div>
      </div>

      <!-- Financeiro -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Módulo Financeiro</span>
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="color: var(--secondary);"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <div class="card-value">Ledger Integrado</div>
        <div class="card-indicator">
          <span>✓ Contas a Receber Automático</span>
        </div>
      </div>

      <!-- Estoque -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Estoque & Produção</span>
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="color: var(--warning);"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
        </div>
        <div class="card-value">Monitorado</div>
        <div class="card-indicator alert">
          <span>⚠ Triggers de Baixa no Faturamento</span>
        </div>
      </div>
    </div>

    <!-- MAIN CONSOLE INTERACTION -->
    <div class="card console-card">
      
      <!-- CONTROLS -->
      <div class="console-controls">
        <div>
          <span class="section-title">Sandbox de Desenvolvimento</span>
          <p class="muted">Você pode disparar chamadas para as rotas da sua API Express e ver as respostas e simulações em tempo real.</p>
        </div>

        <div class="btn-group">
          <!-- Button 1 -->
          <button onclick="testHealth()">
            <span>📡 Testar Rota de Saúde (/health)</span>
            <span class="btn-arrow">→</span>
          </button>
          
          <!-- Button 2 -->
          <button class="secondary-btn" onclick="simulateClientCreate()">
            <span>👥 Simular Requisição de Cliente (POST)</span>
            <span class="btn-arrow">→</span>
          </button>

          <!-- Button 3 -->
          <button onclick="simulateNFeXML()">
            <span>📝 Gerar & Assinar XML NF-e (Simulado A1)</span>
            <span class="btn-arrow">→</span>
          </button>
        </div>
      </div>

      <!-- TERMINAL DISPLAY -->
      <div class="terminal-container">
        <div class="terminal-header">
          <div class="terminal-dots">
            <div class="dot dot-red"></div>
            <div class="dot dot-yellow"></div>
            <div class="dot dot-green"></div>
          </div>
          <span class="terminal-title" id="terminal-title">api-console.log</span>
        </div>
        <div class="terminal-body" id="terminal-output">// Clique em um dos botões do painel lateral para testar a resposta do seu servidor.</div>
      </div>

    </div>

    <!-- SUB-MODULES DOCUMENTATION -->
    <div class="info-grid" style="margin-top: 1.5rem;">
      
      <!-- Database Info -->
      <div class="card">
        <span class="feature-tag blue">PostgreSQL + Supabase Cloud</span>
        <h3 style="margin-bottom: 0.5rem; color: #ffffff;">Banco de Dados Inteligente</h3>
        <p class="muted" style="margin-bottom: 1rem;">O banco de dados do seu projeto está totalmente estruturado e ativo. Suas chaves de segurança foram vinculadas localmente, habilitando:</p>
        <ul class="features-list">
          <li>Políticas de RLS por <code>company_id</code> (Multitenancy Seguro)</li>
          <li>Trigger de criação automática de Perfis para novos logins</li>
          <li>Auto-dedução de estoque sob faturamento de vendas</li>
          <li>Integração da Ficha Técnica (BOM) para manufatura de produtos</li>
        </ul>
      </div>

      <!-- Zero Cost NF-e Info -->
      <div class="card">
        <span class="feature-tag purple">Arquitetura de Custo Zero (SPED / NF-e)</span>
        <h3 style="margin-bottom: 0.5rem; color: #ffffff;">Emissão de Notas sem Intermediários</h3>
        <p class="muted" style="margin-bottom: 1rem;">O sistema de faturamento foi estruturado para evitar mensalidades de APIs pagas, implementando a assinatura digital local em nível de backend:</p>
        <ul class="features-list">
          <li>Leitura e validação de certificados digitais do cliente (.pfx / .p12)</li>
          <li>Assinatura de XML nativa com a chave privada usando o módulo <code>crypto</code></li>
          <li>Envio e recepção SOAP direta para o webservice SEFAZ do respectivo estado</li>
          <li>Exportação automática de repositório XML consolidado mensal para a Contabilidade</li>
        </ul>
      </div>

    </div>

    <!-- FOOTER -->
    <footer>
      <p>Sistema VNI CRM & ERP - Desenvolvido em Node.js, TypeScript & Supabase PostgreSQL.</p>
    </footer>

  </div>

  <script>
    const baseUrl = window.location.origin;

    function setTerminalTitle(title) {
      document.getElementById('terminal-title').innerText = title;
    }

    function printTerminal(content, isError = false) {
      const output = document.getElementById('terminal-output');
      output.style.color = isError ? '#f87171' : '#a7f3d0';
      output.innerText = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
    }

    async function testHealth() {
      setTerminalTitle('GET /health');
      printTerminal('Enviando requisição de teste para o servidor...');
      try {
        const response = await fetch('/health');
        const data = await response.json();
        printTerminal(data);
      } catch (err) {
        printTerminal('Erro ao conectar com a API Vercel:\\n' + err.message, true);
      }
    }

    function simulateClientCreate() {
      setTerminalTitle('POST /api/crm/customers [Simulado]');
      const mockPayload = {
        person_type: "PJ",
        name: "JC Distribuidora Ltda",
        trade_name: "Distribuidora JC",
        email: "financeiro@distribuidorajc.com",
        phone: "(11) 99999-8888",
        cpf_cnpj: "12.345.678/0001-99",
        status: "active"
      };

      const mockResponse = {
        message: "Simulação de Requisição Segura",
        endpoint: "/api/crm/customers",
        status: "Pendente de Token de Autorização (JWT)",
        description: "Esta rota está blindada com o middleware requireAuth. Para realizar escrituras no banco, o aplicativo cliente deve enviar o Bearer JWT do Supabase Auth no cabeçalho Authorization.",
        request_body_enviado: mockPayload,
        response_esperada_ao_estar_autenticado: {
          success: true,
          data: {
            id: "73da872c-b51f-49ff-88df-b9cf6e9e4f21",
            company_id: "get_user_company_id() [Injetado automaticamente pelo RLS]",
            ...mockPayload,
            total_purchases: "0.00",
            created_at: new Date().toISOString()
          }
        }
      };

      printTerminal(mockResponse);
    }

    function simulateNFeXML() {
      setTerminalTitle('NF-e XML Generator [A1 Certificate Simulator]');
      
      const xmlString = \`<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe35260512345678000199550010000001231234567891" versao="4.00">
    <ide>
      <cUF>35</cUF>
      <cNF>123456789</cNF>
      <natOp>Venda de mercadoria</natOp>
      <mod>55</mod>
      <serie>1</serie>
      <nNF>123</nNF>
      <dhEmi>\` + new Date().toISOString() + \`</dhEmi>
      <tpNF>1</tpNF>
      <idDest>1</idDest>
      <cMunFG>3550308</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
    </ide>
    <emit>
      <CNPJ>12345678000199</CNPJ>
      <xNome>JC Distribuidora de Alimentos Ltda</xNome>
      <enderEmit>
        <xLgr>Avenida Paulista</xLgr>
        <nro>1000</nro>
        <xBairro>Bela Vista</xBairro>
        <cMun>3550308</cMun>
        <xMun>Sao Paulo</xMun>
        <UF>SP</UF>
        <CEP>01310100</CEP>
      </enderEmit>
    </emit>
    <dest>
      <CNPJ>98765432000100</CNPJ>
      <xNome>Supermercado do Bairro EIRELI</xNome>
    </dest>
    <det nItem="1">
      <prod>
        <cProd>SKU-PROD-001</cProd>
        <xProd>Produto Acabado Exemplo VNI</xProd>
        <NCM>10063021</NCM>
        <CFOP>5102</CFOP>
        <uCom>UN</uCom>
        <qCom>10.0000</qCom>
        <vUnCom>15.0000</vUnCom>
        <vProd>150.00</vProd>
      </prod>
    </det>
    <total>
      <ICMSTot>
        <vProd>150.00</vProd>
        <vNF>150.00</vNF>
      </ICMSTot>
    </total>
  </infNFe>
  <!-- ASSINATURA DIGITAL A1 (Gerada nativamente via xml-crypto / Node native crypto) -->
  <Signature xmlns="http://www.w3.org/2000/09/xmldsig#">
    <SignedInfo>
      <CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>
      <SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/>
      <Reference URI="#NFe35260512345678000199550010000001231234567891">
        <Transforms>
          <Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>
        </Transforms>
        <DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/>
        <DigestValue>signedHashDigestBase64StringExample==</DigestValue>
      </Reference>
    </SignedInfo>
    <SignatureValue>base64SignedXMLBinaryStringHereGeneratedByCryptoPrivateSignKey==</SignatureValue>
    <KeyInfo>
      <X509Data>
        <X509Certificate>MIIE3DCCA8SgAwIBAgIQDJl0vjB9W2K58XoE1y/vTzANBgkqhkiG9w0BAQsFADCB...</X509Certificate>
      </X509Data>
    </KeyInfo>
  </Signature>
</NFe>\`;

      printTerminal(xmlString);
    }
  </script>
</body>
</html>`;
