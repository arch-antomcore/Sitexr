# COLECIONA — Compra em Grupo para Colecionadores

## Problem Statement (original, PT-BR)
Criar um site (estilo nerdofertas.com/compraemgrupo) focado em miniaturas/figures/carrinhos de colecionar. O usuário cola o link de compra em grupo do AliExpress e isso vira um "post" clicável (com imagem) que leva ao grupo do AliExpress. Design de ponta, React, com animações. Tentar extrair imagem/título/preço automaticamente do link. Feed inicial sucinto: nome do produto, preço atual e preço anterior (maior). Sem backend de cadastro/login por enquanto, mas deve funcionar.

## Architecture
- **Frontend**: React 19 + CRA, Tailwind, framer-motion, shadcn/ui, sonner. Fonts: Unbounded (display), Outfit (body), JetBrains Mono (prices). Dark "elite collector" theme com acentos neon (amarelo #F5D90A / ciano #00E5FF).
- **Backend**: FastAPI + MongoDB (motor). Best-effort scraping com requests + BeautifulSoup (OG meta tags + JSON de preço do AliExpress).
- Routes: `/` (Home feed) e `/produto/:id` (detalhe).

## Core Requirements (static)
- Postagem livre (sem login).
- Auto-extração via link (com fallback manual editável).
- Feed sucinto: imagem, nome, preço de grupo, preço anterior, % desconto.
- Detalhe: categoria, descrição, contador de entradas, curtidas, CTA para o grupo.
- Categorias: Figures, Carrinhos, Anime, Games, Outros.

## Implemented (2026-06-04)
- Backend endpoints: GET/POST /api/posts, GET /api/posts/{id}, POST /api/scrape, POST /api/posts/{id}/join, POST /api/posts/{id}/like, GET /api/stats. Discount auto-computed; numeric price fields para ordenação. Seed de 6 posts.
- Frontend: Home (hero animado, marquee ticker, stats, filtros de categoria, ordenação, busca, grid de cards, empty state, seção "Como funciona"), ProductDetail (join/like, abrir grupo), AddDealModal (scrape + publicar).
- Testado: 19/19 backend pytest, 100% dos fluxos frontend. A11y do Dialog corrigido.

## Backlog / Next
- **P1**: Surface visual de "preencher manualmente" quando o scrape volta vazio (hoje só toast).
- **P1**: Scraping mais robusto de AliExpress (anti-bot) — considerar API de afiliado / endpoint JSON dedicado.
- **P2**: Paginação/"Mostrar mais", links de afiliado, moderação/denúncia de posts, contagem de cliques real.
- **P2**: Compartilhamento social (OG tags por produto), PWA.

## Notes
- Sem autenticação por decisão do usuário (qualquer um pode postar/curtir/entrar).
- AliExpress é anti-bot: scrape pode retornar campos nulos (esperado) — formulário manual cobre isso.
