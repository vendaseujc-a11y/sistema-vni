import app from './app.js';
import { env } from './config/env.js';

const PORT = env.PORT;

const server = app.listen(PORT, () => {
  console.log('================================================================');
  console.log(`🚀 SERVIDOR CRM & ERP INICIADO COM SUCESSO`);
  console.log(`📡 Porta de escuta: http://localhost:${PORT}`);
  console.log(`⚙️  Modo de execução: ${env.NODE_ENV}`);
  console.log('================================================================');
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Recebido sinal SIGTERM. Encerrando servidor HTTP...');
  server.close(() => {
    console.log('💤 Servidor HTTP encerrado com sucesso.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 Recebido sinal SIGINT. Encerrando servidor HTTP...');
  server.close(() => {
    console.log('💤 Servidor HTTP encerrado com sucesso.');
    process.exit(0);
  });
});
