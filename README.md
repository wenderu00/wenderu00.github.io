# Márcio Wendell · Portfólio

Portfólio pessoal de **Márcio Wendell**, desenvolvedor full-stack em Recife (PE).

**No ar:** [wenderu00.github.io](https://wenderu00.github.io)

![Página inicial do portfólio](docs/screenshot.png)

## Stack

- [Next.js 16](https://nextjs.org) (App Router) com exportação estática (`output: "export"`)
- React 19 e TypeScript
- Tailwind CSS 4 com tokens de tema em `app/globals.css`
- [Motion](https://motion.dev) para animações de interface, [PixiJS 8](https://pixijs.com) para as cenas em canvas e [GSAP](https://gsap.com) (com MorphSVG e DrawSVG) para os personagens em SVG do minijogo
- Vitest e [Stryker](https://stryker-mutator.io) para a lógica do minijogo, Playwright com [playwright-bdd](https://vitalets.github.io/playwright-bdd) para testes E2E e `node:test` para testes do build
- GitHub Actions e GitHub Pages para CI e deploy

## Decisões

- **Site 100% estático.** Sem servidor nem banco: o build gera HTML, CSS e imagens em `out/`, publicados no GitHub Pages.
- **Conteúdo separado do layout.** Textos, projetos, stack e contatos ficam em `app/content.ts`; `app/page.tsx` só cuida da apresentação.
- **Motion para a interface, PixiJS para o canvas.** Motion cuida do que é DOM: reveals no scroll (em qualquer navegador), barra de progresso com mola, sublinhado do menu, filtro da stack, pipeline, nome que "decodifica", botões magnéticos e cards com inclinação. PixiJS desenha o que o DOM não aguenta: o campo de partículas do hero, o jardim da semeadura e o jogo de caçar mutantes da 404. O Pixi só é baixado depois que a página carrega, pausa fora da tela e, com `prefers-reduced-motion`, fica desligado (o hero volta à grade de pontos em CSS).
- **Mate o mutante.** Na seção "O que faço", um minijogo ensina teste de mutação: um operador do código é trocado e os guardiões (um por teste) tentam pegar o mutante. A lógica fica em `lib/mutante/` (TypeScript puro, testada com Vitest e com 100% de mutation score no Stryker), a cena em `components/mutante/CenaGsap.tsx` e o jogo em `JogoMutante.tsx`. O jogo e o GSAP só são baixados quando a seção se aproxima da tela; com `prefers-reduced-motion` a cena usa só transições de opacidade.
- **Acessibilidade como requisito.** Link para pular ao conteúdo, foco visível, menu mobile com `aria-expanded` e contraste alto no tema escuro.
- **Currículo gerado pelo próprio site.** A rota `/curriculo` monta o CV a partir de `app/content.ts`, e `npm run cv` imprime essa página em PDF (`out/curriculo-marcio-wendell.pdf`) com o Playwright. O PDF nunca fica desatualizado em relação ao site.
- **SEO.** Metadados Open Graph e Twitter, dados estruturados `Person` (JSON-LD), `sitemap.xml` e `robots.txt` gerados no build.

## Estrutura

```
app/
  content.ts        conteúdo do site (contato, serviços, stack, projetos)
  page.tsx          página única com as seções
  section-nav.tsx   menu de seções (hambúrguer no mobile)
  motion.tsx        componentes de animação com Motion
  stack-filter.tsx  filtro animado da stack
  seed-garden.tsx   jardim da semeadura (canvas)
  mutant-hunt.tsx   jogo da página 404 (canvas)
  pixi/             cenas PixiJS e o componente que as carrega sob demanda
  curriculo/        currículo para impressão (base do PDF)
  layout.tsx        fontes e metadados
  sitemap.ts        sitemap.xml
  robots.ts         robots.txt
components/mutante/
  MateOMutante.tsx  card da seção 02, carrega o jogo sob demanda
  JogoMutante.tsx   liga lógica, cena, placar e controles
  Quadro.tsx        layout compartilhado pelo jogo e pelo placeholder
  CenaGsap.tsx      cena em SVG animada com GSAP (troque por outra cena aqui)
  Guardiao.tsx      guardião (um por teste)
  Mutante.tsx       mutante
lib/mutante/        regras do jogo em TypeScript puro, com testes Vitest
scripts/
  generate-cv.mjs   gera o PDF do currículo a partir de out/curriculo.html
e2e/                testes Playwright (navegação, animações, CV, 404, minijogo)
  features/         cenários BDD em Gherkin, em português
  steps/            passos dos cenários (playwright-bdd)
tests/              testes do HTML exportado
```

## Trocando a cena do minijogo

A cena só conhece `CenaProps` (`components/mutante/CenaGsap.tsx`): recebe `rodada` (`{ id, desfecho, guardiao }` ou `null`) e `guardioes`, e chama `onAnimacaoTerminou(id)` quando termina a rodada. Para usar Rive ou PixiJS, escreva outro componente com essas props (por exemplo, `CenaRive.tsx` disparando inputs de uma state machine a cada `rodada.id` novo e chamando o callback no evento de fim) e troque o import em `JogoMutante.tsx`. A lógica, o placar, os controles e os testes não mudam.

## Rodando localmente

Requer Node.js 24.

```bash
npm ci
npm run dev        # http://localhost:3000
```

## Testes

```bash
npm run lint       # ESLint
npm run test:unit  # Vitest na lógica do minijogo
npm run test:mutation # Stryker na lógica do minijogo (relatório em reports/mutation/)
npm test           # faz o build e valida o HTML exportado em out/
npm run cv         # gera o PDF do currículo em out/ (rode npm test antes)
npm run test:e2e   # gera os specs BDD e roda o Playwright contra out/ (rode npm test e npm run cv antes)
```

Na primeira execução dos testes E2E, instale o navegador com `npx playwright install chromium`.

## Deploy

- Todo PR para `main` roda lint, testes unitários, testes de mutação, testes do build, geração do currículo e testes E2E (`.github/workflows/ci.yml`).
- Todo push na `main` repete as verificações e publica `out/`, com o PDF do currículo, no GitHub Pages (`.github/workflows/deploy.yml`).

## Contato

- E-mail: [marcio.wendell.contact@gmail.com](mailto:marcio.wendell.contact@gmail.com)
- LinkedIn: [marcio-wendell](https://www.linkedin.com/in/marcio-wendell)
- GitHub: [@wenderu00](https://github.com/wenderu00)
- YouTube: [@MW_JS_Testing](https://www.youtube.com/@MW_JS_Testing)
