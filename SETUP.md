# FitMeta — Guia de Setup Rápido 🚀

## 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/fitmeta-app.git
cd fitmeta-app
```

## 2. Instalar Dependências

```bash
npm install
# ou
pnpm install
```

## 3. Configurar Variáveis de Ambiente

Copie `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Edite `.env.local` com suas chaves:

```
VITE_CLAUDE_API_KEY=sk-ant-...
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

## 4. Obter as Chaves

### Claude API Key
1. Acesse [console.anthropic.com](https://console.anthropic.com)
2. Crie uma API key em "API Keys"
3. Copie a chave para `.env.local`

### Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Copie URL e Anon Key de "Project Settings" → "API"

## 5. Rodar Local

```bash
npm run dev
```

O app abre em `http://localhost:5173`

## 6. Deploy no Vercel

### Opção A: Git + Vercel Dashboard
```bash
# 1. Push para GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 2. Conecte no Vercel: https://vercel.com/new
# 3. Selecione o repositório
# 4. Adicione variáveis de ambiente
# 5. Deploy!
```

### Opção B: Vercel CLI
```bash
npm install -g vercel
vercel login
vercel

# Responda as perguntas durante o setup
# Adicione variáveis de ambiente quando solicitado
```

## 7. Estrutura de Pastas

```
fitmeta-app/
├── src/
│   ├── pages/              # Páginas principais
│   │   ├── Landing.tsx     # Home
│   │   ├── Onboarding.tsx  # Setup
│   │   ├── Dashboard.tsx   # App principal
│   │   ├── WorkoutDetail.tsx
│   │   └── Progress.tsx
│   ├── services/           # Integrações
│   │   └── claudeService.ts
│   ├── context/            # Estado global
│   ├── types/              # TypeScript
│   ├── index.css           # Estilos (Nino design)
│   └── App.tsx
├── public/
├── tailwind.config.ts
├── vite.config.ts
└── package.json
```

## 8. Desenvolvimento

### Adicionar Nova Página

```tsx
// src/pages/MinhaPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

const MinhaPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      <h1 className="text-4xl font-bold text-foreground">Hello FitMeta</h1>
    </div>
  );
};

export default MinhaPage;
```

Depois adicione em `src/App.tsx`:

```tsx
import MinhaPage from "@/pages/MinhaPage";

// No Routes:
<Route path="/minha-page" element={<MinhaPage />} />
```

### Usar o Componente AppContext

```tsx
import { useApp } from "@/context/AppContext";

const MyComponent = () => {
  const { user, plan } = useApp();
  
  return <div>{user?.goal}</div>;
};
```

### Chamar Claude API

```tsx
import { generateWorkoutPlan } from "@/services/claudeService";

const response = await generateWorkoutPlan(userProfile);
```

## 9. Variáveis CSS (Design Nino)

Em qualquer arquivo CSS ou `className`:

```tsx
// Cores
className="bg-primary text-foreground border border-border"

// Componentes
className="surface-card"
className="btn-brand"
className="input-base"

// Gradientes
className="bg-gradient-brand"
className="text-gradient-brand"
```

Ver `src/index.css` para lista completa.

## 10. Build para Produção

```bash
npm run build

# Resulta em: dist/
# Pronto para upload em Vercel/Netlify
```

## 11. Troubleshooting

**Port 5173 em uso?**
```bash
npm run dev -- --port 3000
```

**Erro de imports?**
Certifique-se que os caminhos em `tsconfig.json` estão corretos (alias `@/*`).

**Supabase não conecta?**
Verifique `.env.local` — copie exatamente as chaves sem espaços.

**Claude API falha?**
- Verifique chave de API
- Veja console do navegador (F12)
- Certifique-se de créditos na conta Anthropic

## 12. Next Steps

- [ ] Conectar Supabase (banco de dados)
- [ ] Implementar autenticação
- [ ] Adicionar treinos salvos
- [ ] Integrar histórico de progresso
- [ ] Deploy no Vercel

---

**Dúvidas?** Abra uma issue no GitHub! 🚀
