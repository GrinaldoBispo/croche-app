# Croche App

App mobile-first para artesã de crochê cadastrar linhas, dificuldades e receitas, e calcular preço de peças. Dados 100% no Google Sheets da cliente, sem banco próprio.

## 🚀 Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| Frontend | Next.js 16 (App Router), React 19 |
| UI | CSS inline mobile-first (sem framework) |
| Backend | Google Apps Script (Web App) |
| Banco | Google Sheets (Drive da cliente) |
| Auth | Sessão própria via cookie + hash SHA-256 |
| Hospedagem | Vercel (https://croche-app-one.vercel.app/) |

## 📁 Estrutura

```
croche-app/
├── src/app/            (páginas + API routes)
├── src/components/     (nav)
├── src/lib/            (proxy Sheets)
├── apps-script/Code.gs (backend Sheets)
└── docs/               (ARQUITETURA, ROTAS, PROGRESSO, PLANO, CHECKPOINT)
```

## 🛠️ Configuração

### 1. Instale as dependências
```bash
npm install
```

### 2. Configure .env
Copie `.env.example` para `.env` e preencha `APPS_SCRIPT_URL` com a URL `/exec` do Apps Script.

### 3. Inicie o servidor
```bash
npm run dev
```

## 🔧 Comandos Úteis
```bash
npm run dev      # Desenvolvimento
npm run build    # Build produção
npm run start    # Iniciar produção
npm run lint     # Lint
```

## 📚 Documentação

- [ARQUITETURA.md](docs/ARQUITETURA.md) — Stack e decisões técnicas
- [ROTAS.md](docs/ROTAS.md) — Mapeamento de rotas
- [PROGRESSO.md](docs/PROGRESSO.md) — Status do projeto
- [PLANO.md](docs/PLANO.md) — Próximos passos
- [CHECKPOINT.md](docs/CHECKPOINT.md) — Última sessão
