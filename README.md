# VibeColor - Projeto Vite + React + TypeScript + Tailwind CSS

Este é um projeto moderno configurado com Vite, React, TypeScript, Tailwind CSS, ESLint e Prettier.

## 🚀 Tecnologias Utilizadas

- **Vite** - Build tool e dev server
- **React 19** - Biblioteca de UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **ESLint** - Linter para JavaScript/TypeScript
- **Prettier** - Formatador de código
- **pnpm** - Gerenciador de pacotes

## 📦 Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd vibecolor

# Instale as dependências
pnpm install
```

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev          # Inicia o servidor de desenvolvimento

# Build
pnpm build        # Compila para produção
pnpm preview      # Visualiza o build de produção

# Qualidade de Código
pnpm lint         # Executa o ESLint
pnpm lint:fix     # Corrige problemas do ESLint automaticamente
pnpm format       # Formata o código com Prettier
pnpm format:check # Verifica se o código está formatado
pnpm type-check   # Verifica tipos TypeScript
```

## 🎨 Tailwind CSS

O projeto está configurado com Tailwind CSS v3.4+ com:

- **JIT (Just-In-Time) compilation** habilitada
- **Purga automática** para otimização em produção
- **Animações personalizadas** (ex: `animate-spin-slow`)

### Estrutura de Arquivos CSS

```
src/
├── index.css          # Arquivo principal com diretivas do Tailwind
└── App.tsx           # Componente principal usando classes Tailwind
```

## 🔧 Configurações

### ESLint

- Configurado para React + TypeScript
- Integração com Prettier
- Regras recomendadas para hooks do React

### Prettier

- Configuração otimizada para React/TypeScript
- Arquivo `.prettierignore` para excluir arquivos desnecessários

### TypeScript

- Configuração estrita
- Verificação de tipos em tempo de compilação

## 📁 Estrutura do Projeto

```
vibecolor/
├── public/           # Arquivos estáticos
├── src/              # Código fonte
│   ├── assets/       # Assets (imagens, etc.)
│   ├── App.tsx       # Componente principal
│   ├── main.tsx      # Ponto de entrada
│   └── index.css     # Estilos globais
├── .prettierrc       # Configuração do Prettier
├── .prettierignore   # Arquivos ignorados pelo Prettier
├── eslint.config.js  # Configuração do ESLint
├── tailwind.config.js # Configuração do Tailwind CSS
├── postcss.config.js # Configuração do PostCSS
├── tsconfig.json     # Configuração do TypeScript
└── vite.config.ts    # Configuração do Vite
```

## 🚀 Deploy

O projeto está configurado para deploy em produção com:

- Build otimizado com Vite
- CSS purgado automaticamente
- Assets otimizados

## 📝 Licença

Este projeto está sob a licença MIT.
