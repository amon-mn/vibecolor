# VibeColor - Projeto Vite + React + TypeScript + Tailwind CSS

Este é um projeto moderno configurado com Vite, React, TypeScript, Tailwind CSS, ESLint e Prettier.

## ✨ Funcionalidades Principais

- **Verificador de contraste de cores** com interface moderna, preview visual e ajuste inteligente de contraste (inclui menu de correção com sugestões automáticas).
- **Geração de paletas de cores** baseada em emoção/estilo, com edição visual, preview e salvamento local.
- **Edição de paletas**: adicione, remova e edite cores, nome e descrição, com interface intuitiva.
- **Ajuste inteligente de contraste**: menu dropdown com opções para melhorar contraste do texto, fundo ou ambos, sugerindo tons similares e maximizando a acessibilidade.
- **Acessibilidade**: segue as diretrizes WCAG para contraste, com simulação de daltonismo e feedback visual.
- **UX aprimorada**: navegação fluida, feedback visual, toasts de sucesso/erro e responsividade.

## 🖼️ Exemplos de Uso

### Verificador de Contraste
- Compare cores de texto e fundo.
- Veja a nota de contraste, estrelas, avaliação AA/AAA e preview de citação.
- Use o menu "Clique para corrigir" para sugestões automáticas de contraste.

### Geração e Edição de Paletas
- Gere paletas por emoção/estilo (ex: Calma, Energética, Vintage).
- Edite nome, descrição e cores da paleta.
- Adicione novas cores com base em emoção/estilo.
- Salve e visualize suas paletas favoritas.

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
git clone https://github.com/amon-mn/vibecolor.git
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

## 🔥 Diferenciais e Melhorias Recentes

- Interface inspirada em ferramentas modernas de acessibilidade e design.
- Menu de correção de contraste com opções inteligentes e ajuste automático de tons.
- Feedback visual aprimorado para contraste ruim, regular, bom e excelente.
- Preview de citações de filósofos famosos, alternando a cada acesso.
- Navegação aprimorada: após editar/salvar, o histórico é limpo para evitar loops.
- Responsividade e acessibilidade em todas as telas.

## 🚀 Deploy

O projeto está configurado para deploy em produção com:

- Build otimizado com Vite
- CSS purgado automaticamente
- Assets otimizados

## 📝 Licença

Este projeto está sob a licença MIT.
