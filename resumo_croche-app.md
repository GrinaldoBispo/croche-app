# Resumo da Sessão — croche-app

Data: 2026-10-01
Projeto/Pasta: C:\AEG_Automacao\croche-app
Sessão/Comando: /resumo

## Objetivo (Goal)
- Construir do zero o Croche App: backend Sheets + web Next.js na Vercel com auth, cadastros mobile-first e menu por papel.

## Restrições e Contexto (Constraints / Critical context)
- Etapas simples, uma por vez; mudança cirúrgica; sem copiar auth-base completo.
- Fonte da verdade: cabeçalho físico da planilha + `C:\AEG_Automacao\croche-app\apps-script\Code.gs`.
- Mobile-first: container 480px, inputs 44px, botões 48px.
- Produção: `https://croche-app-one.vercel.app/`, backend `/exec` no Apps Script.

## Progresso (Progress)
- `C:\AEG_Automacao\croche-app\apps-script\Code.gs`: v3 validado (seed/migrate, CRUD por id, preco_por_g auto) + USUARIOS/LOG_ACESSOS/MARCAS.
- Web Next root: `/login`, `/register`, `/linhas`, `/marcas`, `/dificuldades`, `/receitas`, `/usuarios`, `/api/*` proxy, middleware de sessão, menu por papel.
- GitHub `GrinaldoBispo/croche-app` + Vercel linkado com `APPS_SCRIPT_URL`.
- Docs: README, ROTAS, PLANO criados; ARQUITETURA/PROGRESSO atualizados.

## Decisões-chave (Key decisions)
- Script por conta do cliente no futuro; TEMPLATE_MASTER local por enquanto.
- Sem auth-base: web mínima sem Prisma/NextAuth.
- Senha em hash SHA-256, nunca texto puro; papel admin/user; user vê só cadastros.

## Próximos passos (Next steps)
- [ ] Colar Code.gs com MARCAS no Apps Script + `?action=seed` (pendência aberta).
- [ ] Calculadora de preço da peça.
- [ ] Filtro admin refinado + onboarding por URL.

## Arquivos relevantes
- `C:\AEG_Automacao\croche-app\apps-script\Code.gs`
- `C:\AEG_Automacao\croche-app\src\app\api\login\route.ts`
- `C:\AEG_Automacao\croche-app\src\app\api\usuarios\route.ts`
- `C:\AEG_Automacao\croche-app\src\middleware.ts`
- `C:\AEG_Automacao\croche-app\docs\PROGRESSO.md`

---

# Resumo da Sessão — croche-app (continuação)

Data: 2026-10-01
Projeto/Pasta: C:\AEG_Automacao\croche-app
Sessão/Comando: documentar

## Objetivo (Goal)
- Registrar docs, seed MARCAS e menu inferior mobile.

## Progresso (Progress)
- Seed `MARCAS:criada` no Apps Script (demais abas preservadas).
- `C:\AEG_Automacao\croche-app\src\components\nav.tsx`: rodapé fixo mobile + topo só marca.
- `C:\AEG_Automacao\croche-app\src\app\mais\page.tsx`: hub criado.
- Docs: README/ROTAS/PLANO/PROGRESSO atualizados.

## Decisões-chave (Key decisions)
- Navegação mobile por rodapé com ícones; cadastros auxiliares no `/mais`.

## Próximos passos (Next steps)
- [ ] Calculadora de preço da peça.
- [ ] Filtro admin refinado + onboarding por URL.

## Arquivos relevantes
- `C:\AEG_Automacao\croche-app\src\components\nav.tsx`
- `C:\AEG_Automacao\croche-app\src\app\mais\page.tsx`
- `C:\AEG_Automacao\croche-app\docs\ROTAS.md`

---

# Resumo da Sessão — croche-app (continuação)

Data: 2026-10-02
Sessão: clone + linhas/precificação

## Objetivo (Goal)
- Clonar `GrinaldoBispo/croche-app`, tornar listas editáveis no modelo clean (toque p/ editar) e criar `/precificacao` por cor.

## Progresso (Progress)
- Clone em `C:\AEG_Automacao\croche-app` + migrate `/exec` OK (`LINHAS:+ textura,quantidade`, `nome_linha->textura copiado`); CRUD create/update/delete por id validado.
- `apps-script/Code.gs`: LINHAS `["id","marca","textura","cor","peso_novelo_g","preco_pago","preco_por_g","quantidade"]` + migrate copia `nome_linha->textura`.
- `/linhas`, `/marcas`, `/dificuldades`, `/receitas`: modelo clean igual `/usuarios` (clique no card, `Atualizar/Cancelar/Excluir` no form).
- `/linhas`: card `Cor · Textura · Marca` + `Preço · Peso · Qtd` + `R$/g`; `/dificuldades`: card `nome - fator`, vírgula `1,3` corrigida (`numBR`); `/receitas`: multi-cor checkbox (`linha_usada` csv) + receita enxuta (só nome+linhas obrig).
- `/precificacao` (nova, só calcula): peso usado por cor, `custo_cor = R$/g_efetivo × peso`, `final = (material + MO) / fator × (1+margem)` — dificuldade DIVIDE, MO/margem/R$/g simulado opcionais; card mostra `Rolo: Xg por R$Y`.
- Docs: PRD 1/4/5 + ROTAS + CHECKPOINT atualizados.
- Commits: `956f8c9`, `757add4`, `7baa3e5`, `b6e7cdf`, `900be73`, `cdb3c08`, `eded1aa` push na `main`.

## Decisões-chave (Key decisions)
- Rename total `nome_linha->textura` com cópia automática no migrate (coluna antiga preservada).
- Receita guarda quais cores; gasto por cor só na `/precificacao` (sem salvar, MVP).
- Dificuldade divide (ajuste do fator feito pelo usuário); média arredondada não serve p/ conferência — usar R$/g exato.

## Próximos passos (Next steps)
- [ ] Commit+push docs (PRD/CHECKPOINT/resumo).
- [ ] Testar precificação 3 cores (ex: 26g+113g+...=294g, ÷1,16).
- [ ] Melhorias futuras: salvar PRECIFICACOES, histórico COMPRAS, filtro admin.

## Arquivos relevantes
- `C:\AEG_Automacao\croche-app\src\app\precificacao\page.tsx`
- `C:\AEG_Automacao\croche-app\src\app\linhas\page.tsx`
- `C:\AEG_Automacao\croche-app\src\app\receitas\page.tsx`
- `C:\AEG_Automacao\croche-app\src\app\marcas\page.tsx`
- `C:\AEG_Automacao\croche-app\src\app\dificuldades\page.tsx`
- `C:\AEG_Automacao\croche-app\apps-script\Code.gs`
- `C:\AEG_Automacao\croche-app\docs\PRD.md`
