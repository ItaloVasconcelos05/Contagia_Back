# Contagia Backend - API de Identificação com AudD

Backend desenvolvido em Fastify + TypeScript que recebe arquivos MXF (ou áudio bruto), converte para WAV, divide em trechos, chama o serviço AudD para identificar música em cada trecho, e retorna um JSON com o cronograma de trechos onde foram encontrados matches.

## 📋 Índice

- [Como Instalar](#como-instalar)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Como Conectar ao Banco](#como-conectar-ao-banco)
- [Dependências](#dependências)
- [Como Iniciar o Servidor](#como-iniciar-o-servidor)
- [Como Rodar](#como-rodar)
- [Estrutura de Pastas](#estrutura-de-pastas)

## 🚀 Como Instalar

### Pré-requisitos

- **Node.js** (versão 18 ou superior recomendada)
- **npm** ou **pnpm** para gerenciamento de dependências
- **ffmpeg** instalado e disponível no PATH do sistema
- **Conta no Supabase** para banco de dados
- **Token da API AudD** para identificação de músicas

### Passos de Instalação

1. **Navegue até a pasta do backend:**
```powershell
cd Contagia_Back
```

2. **Instale as dependências:**
```powershell
npm install
```

ou com pnpm:
```powershell
pnpm install
```

3. **Instale o ffmpeg** (se ainda não tiver):
   - **Windows**: Baixe de [ffmpeg.org](https://ffmpeg.org/download.html) e adicione ao PATH
   - **Linux**: `sudo apt-get install ffmpeg`
   - **macOS**: `brew install ffmpeg`

4. **Crie o arquivo `.env`** na raiz da pasta `Contagia_Back` (veja seção de Variáveis de Ambiente)

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz da pasta `Contagia_Back` com as seguintes variáveis:

```env
# Porta do servidor (padrão: 8000)
PORT=8000

# Ambiente de execução
NODE_ENV=development

# Token da API AudD para identificação de músicas
AUDD_TOKEN=seu_token_audd_aqui

# Configurações do Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_KEY=sua_service_key_aqui
```

### Onde Obter as Variáveis

- **AUDD_TOKEN**: Obtenha em [audd.io](https://audd.io/) após criar uma conta
- **SUPABASE_URL**: Encontre no dashboard do seu projeto Supabase em Settings → API
- **SUPABASE_SERVICE_KEY**: Encontre no dashboard do Supabase em Settings → API (Service Role Key - mantenha segredo!)

⚠️ **IMPORTANTE**: Nunca commite o arquivo `.env` no repositório. Ele já está no `.gitignore`.

## 🗄️ Como Conectar ao Banco

O projeto utiliza **Supabase** (PostgreSQL) como banco de dados. A conexão é configurada automaticamente através das variáveis de ambiente.

### Configuração Automática

A conexão é estabelecida automaticamente ao iniciar o servidor através do arquivo `src/config/database.ts`. Certifique-se de que as variáveis `SUPABASE_URL` e `SUPABASE_SERVICE_KEY` estão configuradas corretamente no arquivo `.env`.

### Verificação da Conexão

Ao iniciar o servidor, você verá no console:
- ✅ `SUPABASE_URL: Configurado` - Conexão OK
- ❌ `SUPABASE_URL: Não encontrado` - Verifique o `.env`

### Estrutura do Banco

O projeto espera as seguintes tabelas no Supabase (consulte `src/services/databaseService.ts` para detalhes):
- Tabela de arquivos
- Tabela de músicas identificadas
- Relacionamentos entre arquivos e músicas

## 📦 Dependências

### Dependências Principais

- **fastify** (^5.6.1) - Framework web rápido e eficiente
- **@fastify/cors** (^11.1.0) - Suporte a CORS
- **@fastify/multipart** (^9.2.1) - Upload de arquivos
- **@fastify/swagger** (^9.5.2) - Documentação da API
- **@fastify/swagger-ui** (^5.2.3) - Interface Swagger UI
- **@supabase/supabase-js** (^2.80.0) - Cliente Supabase
- **axios** (^1.6.0) - Cliente HTTP
- **chokidar** (^5.0.0) - Monitoramento de arquivos
- **dotenv** (^17.2.3) - Gerenciamento de variáveis de ambiente
- **fluent-ffmpeg** (^2.1.2) - Processamento de áudio/vídeo
- **form-data** (^4.0.0) - Envio de formulários multipart
- **p-queue** (^7.4.0) - Gerenciamento de filas

### Dependências de Desenvolvimento

- **typescript** (^5.9.3) - Linguagem TypeScript
- **ts-node** (^10.9.2) - Execução de TypeScript
- **@types/node** (^24.6.2) - Tipos do Node.js
- **@types/express** (^5.0.5) - Tipos do Express
- **@types/multer** (^2.0.0) - Tipos do Multer

## 🖥️ Como Iniciar o Servidor

### Modo Desenvolvimento

```powershell
npm run dev
```

Este comando:
- Carrega as variáveis de ambiente do arquivo `.env`
- Executa o servidor usando `ts-node` (sem necessidade de build)
- Habilita hot-reload automático

### Modo Produção

1. **Compile o TypeScript:**
```powershell
npm run build
```

2. **Inicie o servidor:**
```powershell
npm start
```

O servidor estará disponível em `http://localhost:8000` (ou na porta configurada no `.env`).

### Verificação

Após iniciar, você verá no console:
```
🚀 Servidor rodando na porta 8000
📚 Documentação Swagger: http://localhost:8000/docs
📋 Variáveis carregadas:
  - NODE_ENV: development
  - AUDD_TOKEN: ✅ Configurado
  - SUPABASE_URL: ✅ Configurado
  - SUPABASE_SERVICE_KEY: ✅ Configurado
```

## 🏃 Como Rodar

### Endpoints Disponíveis

#### 1. Health Check
```
GET http://localhost:8000/
```

#### 2. Upload de Arquivo (Multipart)
```
POST http://localhost:8000/api/upload
Content-Type: multipart/form-data
Body: form-data com campo 'file'
```

#### 3. Busca AudD
```
POST http://localhost:8000/buscaAudD
Content-Type: multipart/form-data
Body: form-data com campo 'file'
```

#### 4. Documentação Swagger
```
GET http://localhost:8000/docs
```

### Exemplo de Uso com PowerShell

```powershell
# Upload de arquivo
$filePath = "caminho/para/seu/arquivo.mxf"
$uri = "http://localhost:8000/api/upload"

$form = @{
    file = Get-Item $filePath
}

Invoke-RestMethod -Uri $uri -Method Post -Form $form
```

### Exemplo de Uso com cURL

```bash
curl -X POST http://localhost:8000/api/upload \
  -F "file=@/caminho/para/arquivo.mxf"
```

## 📁 Estrutura de Pastas

```
Contagia_Back/
├── src/
│   ├── config/           # Configurações do projeto
│   │   └── database.ts   # Configuração do Supabase
│   ├── controllers/      # Controladores das rotas
│   │   ├── audioController.ts
│   │   └── watchController.ts
│   ├── routes/           # Definição das rotas
│   │   ├── fileRoutes.ts
│   │   ├── uploadRoutes.ts
│   │   └── watchRoutes.ts
│   ├── schemas/          # Schemas de validação
│   │   ├── components.ts
│   │   └── fileSchemas.ts
│   ├── services/         # Lógica de negócio
│   │   ├── auddService.ts      # Integração com AudD
│   │   ├── audioService.ts     # Processamento de áudio
│   │   ├── databaseService.ts   # Operações no banco
│   │   ├── fileService.ts       # Gerenciamento de arquivos
│   │   ├── queueService.ts      # Gerenciamento de filas
│   │   └── uploaderService.ts   # Serviço de upload
│   ├── tests/            # Testes automatizados
│   ├── types/            # Definições de tipos TypeScript
│   │   └── fluent-ffmpeg.d.ts
│   ├── utils/            # Funções utilitárias
│   │   └── watchUtils.ts
│   ├── global.d.ts       # Tipos globais
│   └── server.ts         # Arquivo principal do servidor
├── dist/                 # Código compilado (gerado)
├── tmp_audio/            # Arquivos temporários de áudio
├── .env                  # Variáveis de ambiente (não versionado)
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

### Descrição das Pastas

- **config/**: Configurações centralizadas (banco de dados, APIs externas)
- **controllers/**: Lógica de controle das requisições HTTP
- **routes/**: Definição e registro das rotas da API
- **schemas/**: Validação de dados usando schemas
- **services/**: Lógica de negócio e integrações externas
- **tests/**: Testes unitários e de integração
- **types/**: Definições de tipos TypeScript customizados
- **utils/**: Funções auxiliares reutilizáveis

## 🔧 Problemas Comuns

### ffmpeg não encontrado
**Erro**: `ffmpeg: command not found`

**Solução**: 
- Instale o ffmpeg e adicione ao PATH do sistema
- Verifique com: `ffmpeg -version`

### Variáveis de ambiente não carregadas
**Erro**: `Variáveis SUPABASE_URL e SUPABASE_SERVICE_KEY são obrigatórias`

**Solução**: 
- Verifique se o arquivo `.env` existe na raiz de `Contagia_Back`
- Confirme que as variáveis estão escritas corretamente

### Timeout no Postman/Requisições
**Problema**: Requisições demoradas falham

**Solução**: 
- Aumente o timeout no cliente HTTP
- Para Postman: Settings → General → Request timeout (ms) → 0 (infinito)

### Porta já em uso
**Erro**: `EADDRINUSE: address already in use`

**Solução**: 
- Altere a porta no arquivo `.env`: `PORT=8001`
- Ou encerre o processo que está usando a porta 8000

## 📚 Documentação Adicional

- **Swagger UI**: Acesse `http://localhost:8000/docs` após iniciar o servidor
- **Fastify**: [Documentação oficial](https://www.fastify.io/)
- **Supabase**: [Documentação oficial](https://supabase.com/docs)
- **AudD API**: [Documentação oficial](https://docs.audd.io/)

## 🚧 Próximos Passos Recomendados

- [ ] Adicionar testes automatizados (Jest/Mocha)
- [ ] Implementar autenticação e autorização
- [ ] Adicionar rate limiting
- [ ] Melhorar tratamento de erros
- [ ] Adicionar logging estruturado
- [ ] Implementar cache para requisições frequentes
