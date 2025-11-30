# Globo Residência - Sistema de Identificação de Músicas

Sistema completo para upload e identificação de músicas em arquivos de áudio/vídeo (MXF, WAV, MP3) utilizando a API AudD. O projeto consiste em um backend Fastify + TypeScript e um frontend Next.js com interface moderna.

## 📋 Índice

- [Requisitos](#requisitos)
- [Instalação](#instalação)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Como Rodar](#como-rodar)
- [Como Iniciar o Servidor](#como-iniciar-o-servidor)
- [Como Conectar ao Banco](#como-conectar-ao-banco)
- [Dependências](#dependências)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Endpoints da API](#endpoints-da-api)
- [Problemas Comuns](#problemas-comuns)

---

## 🔧 Requisitos

### Software Necessário

- **Node.js** v18 ou superior
- **npm** (vem com Node.js) ou **yarn**
- **ffmpeg** (deve estar disponível no PATH do sistema)
- **Git** (para clonar o repositório)

### Verificando Instalações

```powershell
# Verificar Node.js
node --version

# Verificar npm
npm --version

# Verificar ffmpeg
ffmpeg -version
```

### Instalando FFmpeg

**Windows:**
1. Baixe o FFmpeg em: https://ffmpeg.org/download.html
2. Extraia e adicione o diretório `bin` ao PATH do sistema
3. Reinicie o terminal e verifique com `ffmpeg -version`

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install ffmpeg
```

**macOS:**
```bash
brew install ffmpeg
```

---

## 📦 Instalação

### 1. Clonar o Repositório

```powershell
git clone https://github.com/GustavoLino728/globo-residencia.git
cd globo-residencia
```

### 2. Instalar Dependências

O projeto utiliza um workspace com scripts automatizados. Você pode instalar tudo de uma vez:

```powershell
# Instalar todas as dependências (backend + frontend)
npm install
```

Ou instalar separadamente:

```powershell
# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..
```

---

## 🔐 Variáveis de Ambiente

### Backend

Crie um arquivo `.env` na raiz do diretório `backend/`:

```env
# Porta do servidor (padrão: 3000)
PORT=8000

# Ambiente (development | production)
NODE_ENV=development

# Token da API AudD (obtenha em https://audd.io/)
AUDD_TOKEN=seu_token_aqui

# Configurações do Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_KEY=sua_service_key_aqui

# Autenticação (true para desabilitar em desenvolvimento)
SKIP_AUTH=false
```

### Frontend

Crie um arquivo `.env.local` na raiz do diretório `frontend/` (opcional):

```env
# URL da API Backend (usado apenas em produção)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Ambiente
NODE_ENV=development
```

### Arquivo .env de Exemplo

Você pode criar um arquivo `.env.example` como referência:

**backend/.env.example:**
```env
PORT=8000
NODE_ENV=development
AUDD_TOKEN=your_audd_token_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_key_here
SKIP_AUTH=false
```

**⚠️ Importante:** Nunca commite arquivos `.env` com credenciais reais. Eles devem estar no `.gitignore`.

---

## 🚀 Como Rodar

### Modo Desenvolvimento (Recomendado)

Execute backend e frontend simultaneamente:

```powershell
# Na raiz do projeto
npm run dev
```

Isso iniciará:
- **Backend** na porta `8000` (ou a porta definida em `PORT`)
- **Frontend** na porta `3000` (Next.js padrão)

### Rodar Separadamente

**Backend apenas:**
```powershell
cd backend
npm run dev
```

**Frontend apenas:**
```powershell
cd frontend
npm run dev
```

### Modo Produção

```powershell
# Build de ambos
npm run build

# Iniciar em produção
npm run start
```

---

## 🖥️ Como Iniciar o Servidor

### Backend (Fastify)

O servidor backend pode ser iniciado de três formas:

#### 1. Modo Desenvolvimento (com hot-reload)
```powershell
cd backend
npm run dev
```

#### 2. Build e Execução Manual
```powershell
cd backend
npm run build
node dist/server.js
```

#### 3. Execução Direta (produção)
```powershell
cd backend
npm run start
```

**Verificando se o servidor está rodando:**

Acesse no navegador ou via curl:
- **Health Check:** `http://localhost:8000/`
- **Documentação Swagger:** `http://localhost:8000/docs`

### Frontend (Next.js)

#### 1. Modo Desenvolvimento
```powershell
cd frontend
npm run dev
```

Acesse: `http://localhost:3000`

#### 2. Build e Produção
```powershell
cd frontend
npm run build
npm run start
```

---

## 🗄️ Como Conectar ao Banco

O projeto utiliza **Supabase** (PostgreSQL) como banco de dados.

### 1. Criar Projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Crie uma conta ou faça login
3. Crie um novo projeto
4. Anote a **URL do projeto** e a **Service Role Key**

### 2. Configurar Variáveis de Ambiente

No arquivo `backend/.env`:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Verificar Conexão

O servidor verifica automaticamente a conexão ao iniciar. Você verá no console:

```
📋 Variáveis carregadas:
  - SUPABASE_URL: ✅ Configurado
  - SUPABASE_SERVICE_KEY: ✅ Configurado
```

### 4. Estrutura do Banco

O Supabase gerencia automaticamente as tabelas através do código. As principais tabelas são:

- **arquivos**: Armazena informações dos arquivos enviados
- **musicas**: Armazena músicas identificadas
- **usuarios**: Armazena dados de autenticação (se aplicável)

### 5. Storage (Buckets)

O projeto utiliza o Supabase Storage para armazenar arquivos:

- **Bucket:** `mxf-files` (configurado em `backend/src/config/supabase.ts`)

Certifique-se de criar este bucket no painel do Supabase com as políticas de acesso adequadas.

---

## 📚 Dependências

### Backend

**Principais Dependências:**
- `fastify` - Framework web rápido
- `@fastify/multipart` - Upload de arquivos
- `@fastify/cors` - CORS
- `@fastify/swagger` - Documentação da API
- `@supabase/supabase-js` - Cliente Supabase
- `fluent-ffmpeg` - Processamento de áudio/vídeo
- `axios` - Cliente HTTP
- `dotenv` - Gerenciamento de variáveis de ambiente
- `p-queue` - Fila de processamento

**DevDependencies:**
- `typescript` - TypeScript
- `ts-node` - Executar TypeScript diretamente
- `@types/node` - Tipos do Node.js

### Frontend

**Principais Dependências:**
- `next` - Framework React
- `react` / `react-dom` - Biblioteca React
- `@heroui/*` - Componentes UI (HeroUI)
- `framer-motion` - Animações
- `next-themes` - Gerenciamento de temas
- `lucide-react` - Ícones

**DevDependencies:**
- `typescript` - TypeScript
- `tailwindcss` - Framework CSS
- `eslint` - Linter
- `prettier` - Formatador

### Workspace (Raiz)

- `concurrently` - Executar scripts em paralelo

---

## 📁 Estrutura do Projeto

```
globo-residencia/
│
├── backend/                    # Backend Fastify + TypeScript
│   ├── src/
│   │   ├── config/            # Configurações
│   │   │   └── supabase.ts    # Cliente Supabase
│   │   ├── controllers/       # Controladores (lógica de negócio)
│   │   │   └── audioController.ts
│   │   ├── middleware/        # Middlewares
│   │   │   ├── authMiddleware.ts
│   │   │   └── conditionalAuth.ts
│   │   ├── routes/            # Rotas da API
│   │   │   ├── authRoutes.ts
│   │   │   └── fileRoutes.ts
│   │   ├── schemas/           # Schemas de validação
│   │   │   ├── authSchemas.ts
│   │   │   ├── fileSchemas.ts
│   │   │   └── components.ts
│   │   ├── services/          # Serviços (lógica de negócio)
│   │   │   ├── auddService.ts      # Integração com AudD
│   │   │   ├── audioService.ts     # Processamento de áudio
│   │   │   ├── authService.ts      # Autenticação
│   │   │   ├── databaseService.ts  # Operações de banco
│   │   │   ├── fileService.ts      # Gerenciamento de arquivos
│   │   │   └── queueService.ts     # Fila de processamento
│   │   ├── types/             # Definições de tipos TypeScript
│   │   │   ├── auth.d.ts
│   │   │   └── fluent-ffmpeg.d.ts
│   │   ├── integrations/      # Integrações externas
│   │   ├── jobs/              # Jobs/Background tasks
│   │   ├── models/            # Modelos de dados
│   │   ├── plugins/           # Plugins do Fastify
│   │   ├── tests/             # Testes
│   │   └── server.ts          # Arquivo principal do servidor
│   ├── tmp_audio/             # Arquivos temporários de áudio
│   ├── uploads/               # Arquivos enviados
│   ├── dist/                  # Build compilado (gerado)
│   ├── .env                   # Variáveis de ambiente (não commitado)
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── frontend/                   # Frontend Next.js
│   ├── app/                   # App Router do Next.js
│   │   ├── (login-routes)/    # Rotas de login
│   │   │   ├── home/
│   │   │   └── layout.tsx
│   │   ├── (navbar-routes)/   # Rotas com navbar
│   │   │   ├── dashboard/
│   │   │   ├── upload/
│   │   │   ├── relatorios/
│   │   │   └── layout.tsx
│   │   ├── layout.tsx         # Layout raiz
│   │   ├── page.tsx           # Página inicial
│   │   ├── providers.tsx      # Providers React
│   │   └── error.tsx          # Página de erro
│   ├── components/            # Componentes React
│   │   ├── videoPlayer.tsx
│   │   ├── musicPlayer.tsx
│   │   ├── navbar.tsx
│   │   ├── validationCard.tsx
│   │   └── ... (outros componentes)
│   ├── config/                # Configurações
│   │   ├── api.ts             # Configuração da API
│   │   ├── fonts.ts
│   │   └── site.ts
│   ├── data/                  # Dados mockados
│   │   ├── musicMock.ts
│   │   └── videoMocks.ts
│   ├── public/                # Arquivos estáticos
│   │   ├── fonts/
│   │   └── ... (imagens, ícones)
│   ├── styles/                # Estilos globais
│   │   └── globals.css
│   ├── types/                 # Tipos TypeScript
│   │   └── index.ts
│   ├── .env.local             # Variáveis de ambiente (não commitado)
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── package.json
│
├── package.json               # Workspace root
├── README.md                  # Este arquivo
└── POSTMAN_TESTS.md          # Documentação de testes
```

### Princípios de Arquitetura

- **Separação de Responsabilidades**: Cada camada tem uma responsabilidade específica
- **Modularidade**: Código organizado em módulos reutilizáveis
- **Type Safety**: TypeScript em todo o projeto
- **Configuração Centralizada**: Variáveis de ambiente e configurações em arquivos dedicados
- **Service Layer**: Lógica de negócio isolada em serviços
- **Middleware Pattern**: Autenticação e validação via middlewares

---

## 🔌 Endpoints da API

### Documentação Interativa

Acesse a documentação Swagger em: `http://localhost:8000/docs`

### Principais Endpoints

#### 1. Health Check
```
GET /
```
Retorna status do servidor.

#### 2. Upload e Processamento
```
POST /upload
```
Upload de arquivo MXF/WAV/MP3 para processamento.

**Body:** `multipart/form-data` com campo `file`

#### 3. Busca AudD (Legado)
```
POST /buscaAudD
```
Processa arquivo e identifica músicas via AudD.

**Body:** 
- `multipart/form-data` (campo `file`)
- `application/octet-stream` (raw binary)
- `application/json` com base64

#### 4. Listar Arquivos
```
GET /arquivos/:status
```
Lista arquivos por status (Não Finalizado, Em Processamento, Finalizado, Erro).

#### 5. Obter Arquivo
```
GET /arquivo/:id
```
Retorna detalhes de um arquivo específico com suas músicas identificadas.

#### 6. Autenticação
```
POST /auth/login
POST /auth/register
```
Endpoints de autenticação (se habilitado).

---

## ⚠️ Problemas Comuns

### FFmpeg não encontrado

**Erro:** `ffmpeg not found` ou `spawn ffmpeg ENOENT`

**Solução:**
1. Instale o FFmpeg
2. Adicione ao PATH do sistema
3. Reinicie o terminal
4. Verifique com `ffmpeg -version`

### Porta já em uso

**Erro:** `EADDRINUSE: address already in use`

**Solução:**
```powershell
# Windows - Encontrar processo na porta 8000
netstat -ano | findstr :8000

# Matar processo (substitua PID pelo número encontrado)
taskkill /PID <PID> /F

# Ou altere a porta no .env
PORT=8001
```

### Variáveis de ambiente não carregadas

**Erro:** `Variáveis de ambiente não configuradas`

**Solução:**
1. Verifique se o arquivo `.env` existe em `backend/`
2. Verifique se as variáveis estão corretas (sem espaços extras)
3. Reinicie o servidor após alterar o `.env`

### Erro de conexão com Supabase

**Erro:** `Variáveis de ambiente do Supabase não configuradas`

**Solução:**
1. Verifique `SUPABASE_URL` e `SUPABASE_SERVICE_KEY` no `.env`
2. Certifique-se de usar a **Service Role Key** (não a anon key)
3. Verifique se o projeto Supabase está ativo

### Timeout no Postman/Cliente HTTP

**Problema:** Requisição demora muito e dá timeout

**Solução:**
- **Postman:** Settings → General → Request timeout → 0 (infinito)
- **Código:** Aumente o timeout da requisição
- Arquivos grandes podem levar vários minutos para processar

### CORS Error no Frontend

**Erro:** `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solução:**
1. Verifique se o backend está rodando
2. Verifique a URL da API em `frontend/config/api.ts`
3. O CORS está configurado para aceitar todas as origens em desenvolvimento

---

## 📝 Próximos Passos

- [ ] Adicionar testes automatizados (Jest/Mocha)
- [ ] Implementar cache de resultados
- [ ] Adicionar rate limiting
- [ ] Melhorar tratamento de erros
- [ ] Adicionar logging estruturado
- [ ] Implementar CI/CD
- [ ] Adicionar monitoramento e métricas

---

## 📄 Licença

ISC

---

## 👥 Contribuindo

Contribuições são bem-vindas! Por favor, abra uma issue ou pull request.

---

## 📞 Suporte

Para problemas ou dúvidas, abra uma issue no repositório: [GitHub Issues](https://github.com/GustavoLino728/globo-residencia/issues)
