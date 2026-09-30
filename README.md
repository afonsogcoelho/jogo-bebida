# Joga o jogo · Portugal vs Dinamarca

Companion game para ver futebol com amigos. Next.js (App Router) + TypeScript + Tailwind.
Site **100% estático** (`output: "export"` → `out/`): sem backend, estado em `localStorage`.

## Correr

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm run build      # gera out/
npm run preview    # build + Cloudflare Pages local (npx wrangler pages dev out)
```

## Como funciona

- **Qualquer altura (também antes do jogo):** Criar jogo → nº de jogadores (2–8) → nomes → Sortear Ronda 1.
- Cada jogador recebe, por ronda, **1 desafio principal (3x–6x) + 1 evento raro (6x)**.
- Rondas: 0'–22' · 23'–45'+ · 46'–67' · 68'–90'+. Os desafios de uma ronda só contam no seu intervalo.
- As rondas 2–4 só podem ser sorteadas perto da hora prevista (kickoff + minuto da ronda, +15 min de intervalo na 2.ª parte, com 3 min de margem), e pedem sempre confirmação manual ("Já vão nos 23'?").
- Refresh nunca volta a sortear.

## Testar modos

- `/?modo=pre`: força o modo pré-jogo (rondas 2–4 bloqueadas por hora)
- `/?modo=jogo`: força o dia do jogo **e desbloqueia todas as rondas** (para testar o fluxo completo)
- `/?modo=fim`: jogo já passou

O override fica guardado na sessão do browser. Fecha o separador para limpar.

## Conteúdo

- Jogo atual: `data/matches/portugal-dinamarca.ts` (kickoff, 4 rondas, eventos raros, regras gerais).
- Cada ronda tem 5 desafios principais (`challenges`, canónicos) + 3 `alternatives`. Com 2–5 jogadores só se sorteiam principais; com 6–8 entram os 5 principais + as alternativas necessárias.
- `rareEvents`: pool comum (6x). Únicos dentro da ronda, podem repetir entre rondas, nunca aparecem na landing.
- O teaser da landing mostra os 5 principais da Ronda 1.
- Em dev, `assertValidMatch` valida ids únicos, ≥ 8 desafios por ronda, ≥ 8 raros e valores entre 3x e 6x.
- Imagem de partilha e ícones: `app/opengraph-image.png`, `app/icon.png`, `app/apple-icon.png` (PNG estáticos; num jogo novo, trocar a imagem).
- Novo jogo: criar `data/matches/<slug>.ts` e trocar `CURRENT_MATCH` em `data/matches/index.ts`.

## Deploy: Cloudflare Pages

**Via Git (recomendado):** ligar o repositório em Cloudflare → Workers & Pages → Create → Pages.
- Framework preset: *None*
- Build command: `npm run build`
- Build output directory: `out`
- Variável de ambiente: `NEXT_PUBLIC_SITE_URL=https://<o-teu-dominio>` (URL absoluta para o preview no WhatsApp; sem ela usa o `CF_PAGES_URL` do deploy)

**Direto do computador:** `npm run deploy` (faz o build e `npx wrangler pages deploy out --project-name jogo-bebida`; pede login no Cloudflare na primeira vez).

**Analytics:** ativar *Web Analytics* no projeto do Cloudflare Pages (visitas, sem código). Os eventos (`lib/analytics.ts`) estão preparados mas sem ferramenta ligada.

Ficheiros específicos do Cloudflare em `public/`: `_headers` (cache longo para `/_next/static/*`) e `_redirects` (liga o nome do payload de navegação do Next 16 ao ficheiro exportado).
