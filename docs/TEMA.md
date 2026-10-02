# TEMA — croche-app

Padrão Craft / Aconchegante. Fonte da verdade: `src/app/globals.css` importado em `src/app/layout.tsx`.

## Tokens (`:root`)
- `--bg:#FDF8F5` `--surface:#fff` `--text:#292524` `--muted:#78716C` `--border:#E7E5E4`
- `--primary:#E07A5F` `--primary-dark:#C75F45` `--accent:#D97706` `--accent-soft:#FEF3C7`
- `--success:#15803D` `--success-bg:#DCFCE7` `--gold-bg:#FFFBEB`
- `--radius:16px` `--radius-sm:8px` `--shadow:0 4px 12px rgba(0,0,0,0.05)`
- `--font:'Plus Jakarta Sans',system-ui` via Google Fonts `@import`

## Regras mobile-first (obrigatórias)
- `.container`: máx 480px, grid gap 12, padding 16
- `.input` mín 44px, fonte 16px (sem zoom iOS) / `.btn` mín 48px
- `@media (max-width:760px)` só empilha (`.row-2` → 1col). Nunca `display:none` na marca.

## Componentes
- `.card`: branco, radius 16, shadow suave, padding 16 / `.card-click` p/ edição por toque
- `.btn` + `.btn-primary` (terracota, active `primary-dark`)
- `.badge` + `-primary` (marca) / `-accent` (textura) / `-success` (estoque)
- `.novelo`: círculo 40px, cor via `--novelo-c` inline / `.price`: 20px 800
- `.result-banner`: gradiente verde→dourado, strong 28px (preço final) / `.ratio-bar`: flex 10px
- `.welcome`: gradiente primary→accent, `.actions` 2 col botões brancos 44px

## Uso
- Páginas usam `className="container"` + `card/input/btn/badge`. Inline só p/ valor dinâmico (ex: `style={{--novelo-c: cor}}`).
- Header/Nav (Passo 2): pill papel + SVG sem emoji, aba ativa `--primary`.
- Reuso: copiar `globals.css` + este arquivo para próximo projeto, trocar só `primary/accent/bg`.
