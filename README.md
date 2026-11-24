# 📦 LogiSync

Sistema integrado de gestão e logística inteligente.

---

## 🏗️ Estrutura do Projeto

O projeto está dividido entre cliente (frontend) e servidor (backend):

```text
LogiSync/
├── client/          # Frontend SPA (React + Vite + TypeScript)
│   ├── src/         # Componentes, estilos e lógica da interface
│   ├── public/      # Assets públicos
│   └── package.json # Dependências e scripts do client
│
├── server/          # Backend REST API (Node.js + Express + TypeScript)
│   ├── src/         # Rotas, controladores e serviços da API
│   ├── .env         # Variáveis de ambiente locais
│   └── package.json # Dependências e scripts do server
│
├── package.json     # Scripts unificados da raiz do repositório
└── README.md        # Documentação do projeto
```

---

## 🚀 Como Executar

### 1. Pré-requisitos
- [Node.js](https://nodejs.org/) v18+ instalado
- npm ou yarn

### 2. Instalação de Dependências
Você pode instalar tudo de uma vez a partir da raiz:
```bash
npm run install:all
```
*(Ou individualmente com `npm install` dentro das pastas `client` e `server`)*

### 3. Rodando o Backend (Server)
Em um terminal na raiz:
```bash
npm run dev:server
```
> O servidor iniciará em **http://localhost:3001**

### 4. Rodando o Frontend (Client)
Em outro terminal na raiz:
```bash
npm run dev:client
```
> O frontend iniciará em **http://localhost:5173**

> Para o backend acessar o banco em desenvolvimento, suba só o MySQL com `docker compose up -d db` e crie `server/.env` com `DB_HOST=localhost`, `DB_PORT=3307`, `DB_USER=logisync` e `DB_PASSWORD=logisync_dev`.

---

## 🐳 Ambiente com Docker (homologação)

Sobe banco de dados, API e aplicação web em containers, sem instalar Node.js ou MySQL na máquina.

```bash
cp .env.example .env        # opcional: ajuste senhas e portas
docker compose up --build -d
```

| Container | Imagem | Acesso |
|---|---|---|
| `logisync-web` | Nginx com o build do React | http://localhost:8080 |
| `logisync-api` | Node.js 22 + Express | http://localhost:3001/api/health |
| `logisync-db` | MySQL 8.4 | `localhost:3307` |

- Na primeira inicialização, o MySQL executa `database/schema.sql` e `database/seed.sql` automaticamente.
- Os dados ficam no volume `db_data`; para recriar o banco do zero: `docker compose down -v`.
- O Nginx encaminha `/api/*` para a API, então a aplicação web e a API respondem no mesmo endereço.
- Se o `npm ci` falhar com `certificate verify failed` durante o build (antivírus ou proxy inspecionando HTTPS), veja `certs/README.md`.

---

## 🧭 Rotas da Aplicação

| Rota | Descrição | Comportamento |
|---|---|---|
| `/` | Raiz da Aplicação | **Protegida**. Redireciona para `/login` (se não autenticado) ou para `/dashboard`. |
| `/login` | Autenticação | Login de **Empresa** e **Usuário** com abas dinâmicas. Redireciona para `/dashboard`. |
| `/cadastro` | Cadastro | Cadastro de **Empresa** (CNPJ) e **Usuário** (CPF). Redireciona para `/dashboard`. |
| `/dashboard` | **Dashboard (Ativo: Visão de Usuário)** | **Protegida**. Painel do cliente final com background gradiente lilás/roxo moderno, barra de rastreamento com busca por código de encomenda, cards centralizados de envios e entregas concluídas, lista de envios com status em trânsito e atalhos rápidos (Suporte, Calcular Frete, Histórico e Perfil). |
| `/pedidos` | **Gestão de Pedidos (Lista de Pacotes)** | **Protegida**. Busca por código/cliente/cidade, filtros rápidos por status (Todos, Pendentes, Preparando), modal de Novo Pedido, ações de edição/exclusão e paginação completa. |
| `/entregas` | **Gestão de Entregas (Monitoramento)** | **Protegida**. Cards de métricas operacionais (Aguardando Coleta, Em Trânsito, Concluídos, Atrasados), busca dinâmica, filtros por status, status coloridos, previsão e ação de contato direto por telefone. |
| `/veiculos` | **Gestão de Veículos / Frotas** | **Protegida**. Cards de métricas da frota (Total, Disponíveis, Em Trânsito, Manutenção), busca e filtros, grid de cards de veículos com tag de tipo (Caminhão, Van, etc.), status operacional, dados do motorista, capacidade, última manutenção e ações (Editar, Manutenção, Excluir). Modal de cadastro integrado. |
| `/motoristas` | **Gestão de Motoristas** | **Protegida**. Nova aba com lista de condutores, contatos, status (em rota, disponível, folga) e veículos vinculados. |


---

## 🛠️ Tecnologias Utilizadas

- **Frontend (`client`)**:
  - React 19
  - Vite
  - TypeScript
  - **Styled Components** (Componentes estilizados e responsivos)
  - **React Router Dom** (Rotas declarativas e proteção de rotas)
  - Lucide React (Ícones corporativos)


- **Backend (`server`)**:
  - Node.js
  - Express
  - TypeScript
  - tsx (Hot reload em desenvolvimento)
  - CORS & Dotenv
