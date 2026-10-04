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

---

## 🧭 Rotas da Aplicação

| Rota | Descrição | Comportamento |
|---|---|---|
| `/` | Painel Principal (Dashboard) | **Protegida**. Redireciona para `/login` se o usuário não estiver logado. |
| `/login` | Página de Autenticação | Suporta login de **Empresa** e **Usuário** com query param `?tipo=empresa` ou `?tipo=usuario`. |
| `/cadastro` | Página de Cadastro | Suporta cadastro de **Empresa** (CNPJ) e **Usuário** (CPF). |

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
