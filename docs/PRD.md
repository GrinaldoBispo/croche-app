# PRD — croche-app

## 1. Visão Geral
App simples para artesã de crochê cadastrar linhas (marca, peso, preço pago), cadastrar dificuldades (fator de mão de obra) e calcular preço de venda de peças (ex: trilho de mesa) com base no custo por grama + mão de obra por peso e dificuldade.

## 2. Objetivos
1. Cadastrar linha em < 1 min com cálculo automático de R$/g
2. Cadastrar e ajustar dificuldades (fator) sem mexer no código
3. Calcular preço de peça em < 30s a partir da linha + peso + dificuldade
4. Manter 100% dos dados na planilha da cliente (Drive dela), sem banco próprio

## 3. Público-Alvo
- **Primário:** artesã (cliente) que produz e precifica
- **Secundário:** cliente final que recebe o orçamento

## 4. Funcionalidades
| # | Funcionalidade | Prioridade | Descrição |
|---|----------------|------------|-----------|
| 1 | Cadastro de linhas com id | Alta | marca, nome_linha, cor, peso_novelo_g, preco_pago, preco_por_g auto, id único |
| 2 | Cadastro de dificuldades | Alta | id, nome (ex: Fácil/Médio/Difícil/Extra), fator_multiplicador (ex: 1.0/1.3/1.6), descricao. Editável pela artesã |
| 3 | Listagem/filtro de linhas | Alta | tabela + busca por marca/nome, via GET com limit default 200 |
| 4 | Cadastro de receitas/modelos | Alta | nome_item, linha_usada (id), peso_necessario_g, dificuldade_id, valor_base_g, margem_pct |
| 5 | Calculadora de preço | Alta | custo_material = peso_necessario_g * preco_por_g; mao_obra = valor_base_g * peso_necessario_g * fator_dificuldade; preco_final = (custo_material + mao_obra) * (1 + margem_pct) |
| 6 | Persistência via Sheets com id estável | Alta | create/update/delete por `id`, nunca por nº da linha. `_lineIndex` só interno |

## 5. Requisitos Não-Funcionais
- **Performance:** cálculo < 1s, leitura lista < 3s com até 500 linhas
- **Segurança:** api_key e sheet_id só em env server-side na Vercel, nunca no browser; chave em PropertiesService, não hardcoded
- **Escalabilidade:** MVP até 1 artesã, ~500 linhas, ~200 receitas. Sem multi-tenant agora
- **Disponibilidade:** depende de Google + Vercel free (best-effort)
- **Compliance:** dados ficam com a titular (LGPD simplificado)

## 6. Restrições e Dependências
- Backend Apps Script Web App (cotas: ~20k req/dia, timeout 30s) — leitura com `limit/offset`
- Front chama `/api/*` na Vercel que faz proxy pro Apps Script (GET não tem body, então front manda body pra Vercel, Vercel monta URL)
- Cliente pode quebrar schema se renomear aba/coluna — MVP sem proteção total
- `line_index=1` (cabeçalho) deve ser bloqueado no backend
- Abas previstas: `LINHAS`, `DIFICULDADES`, `RECEITAS` (PEDIDOS fica para v2)

## 7. Stack Tecnológica (se definida)
| Camada | Tecnologia |
|--------|------------|
| Front + API proxy | Next.js na Vercel |
| Backend leve | Google Apps Script (Web App) |
| Banco | Google Sheets (Drive da cliente) |

## 8. Fora de Escopo
- Módulo de Pedidos/clientes/status (v2)
- Auth multi-usuária, controle de acesso por papel
- Upload de fotos, PDF de orçamento
- Pagamento, estoque com baixa automática

## 9. Métricas de Sucesso
| Métrica | Meta |
|---------|------|
| Tempo cadastro linha | < 1 min |
| Tempo cálculo peça | < 30s |
| Erro de precificação | zero uso de nº de linha como id, 100% por id |
| Adoção | 1 artesã usando semanalmente por 30 dias |

## 10. Próximos Passos
1. Definir stack técnica → `docs/ARQUITETURA.md`
2. Criar estrutura do projeto → skill `novo-projeto`
3. Definir progresso e fases → `docs/PROGRESSO.md`
