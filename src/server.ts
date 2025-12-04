import * as dotenv from 'dotenv';

dotenv.config();

import Fastify from 'fastify';
import multipart from '@fastify/multipart';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import uploadRoutes from "./routes/uploadRoutes";
import fileRoutes from './routes/fileRoutes';
import watchRoutes from "./routes/watchRoutes";

const PORT = Number(process.env.PORT) || 8000;
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1';

console.log('🔧 Configuração do servidor:');
console.log('  - NODE_ENV:', process.env.NODE_ENV);
console.log('  - PORT:', PORT);
console.log('  - HOST:', HOST);
console.log('  - HOST será:', process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1');

const fastify = Fastify({ 
  logger: true, 
  bodyLimit: 1024 * 1024 * 1024
});

fastify.register(cors, {
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: false,
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
});

fastify.addContentTypeParser('application/octet-stream', { parseAs: 'buffer' }, function (req, body, done) {
  done(null, body);
});
fastify.addContentTypeParser(/^audio\/.*/, { parseAs: 'buffer' }, function (req, body, done) {
  done(null, body);
});
fastify.addContentTypeParser(/^video\/.*/, { parseAs: 'buffer' }, function (req, body, done) {
  done(null, body);
});

fastify.register(multipart, {
  attachFieldsToBody: false, 
  limits: {
    fileSize: 1024 * 1024 * 1024,
    files: 10
  }
});

fastify.register(swagger, {
  openapi: {
    info: {
      title: 'Globo Residência API',
      description: 'API para upload de arquivos MXF e identificação de músicas',
      version: '1.0.0'
    },
    servers: [
      {
        url: `http://localhost:${PORT}`, 
        description: 'Desenvolvimento'
      }
    ],
    tags: [
      { name: 'Files', description: 'Endpoints de upload e processamento de arquivos' },
      { name: 'Music', description: 'Endpoints de catálogo de músicas' },
      { name: 'Reports', description: 'Endpoints de relatórios EDL' }
    ]
  }
});

fastify.register(swaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: true
  },
  staticCSP: true
});

fastify.get('/', async (request, reply) => {
  return { 
    status: 'ok', 
    message: 'Servidor backend funcionando',
    docs: '/docs',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  };
});

fastify.register(fileRoutes);
fastify.register(uploadRoutes, { prefix: "/api/upload" });
fastify.register(watchRoutes, { prefix: "/api/watch" });

fastify.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 Servidor rodando em ${address}`);
  console.log(`📚 Documentação Swagger: ${address}/docs`);
  console.log('📋 Variáveis carregadas:');
  console.log('  - NODE_ENV:', process.env.NODE_ENV || 'development');
  console.log('  - AUDD_TOKEN:', process.env.AUDD_TOKEN ? '✅ Configurado' : '❌ Não encontrado');
  console.log('  - SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Configurado' : '❌ Não encontrado');
  console.log('  - SUPABASE_SERVICE_KEY:', (process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY) ? '✅ Configurado' : '❌ Não encontrado');
});