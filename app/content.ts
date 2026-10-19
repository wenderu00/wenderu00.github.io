export const site = {
  url: "https://wenderu00.github.io",
  name: "Márcio Wendell",
  title: "Márcio Wendell · Portfólio",
  description:
    "Desenvolvedor full-stack em Recife (PE). Sistemas web de ponta a ponta, do Next.js ao banco de dados, com foco em testes e arquitetura.",
};

export const contact: {
  email: string;
  github: string;
  youtube: string;
  linkedin?: string;
  cv?: string;
} = {
  email: "marcio.wendell.contact@gmail.com",
  github: "https://github.com/wenderu00",
  youtube: "https://www.youtube.com/@MW_JS_Testing",
};

export type ServiceIcon = "terminal" | "shield" | "flow" | "spark";

export const services: { icon: ServiceIcon; title: string; text: string }[] = [
  {
    icon: "terminal",
    title: "Desenvolvimento full-stack",
    text: "Interfaces em Next.js e Tailwind, APIs em NestJS e Effect-TS, banco PostgreSQL. Do layout ao deploy.",
  },
  {
    icon: "shield",
    title: "Qualidade e testes",
    text: "BDD com playwright-bdd, testes E2E, testes de mutação com Stryker, testes de carga com Artillery e análise com SonarQube e CodeScene.",
  },
  {
    icon: "flow",
    title: "Infraestrutura e CI/CD",
    text: "Docker, pipelines no GitLab CI e GitHub Actions, deploy em Vercel, Render e Nomad, documentação de topologia.",
  },
  {
    icon: "spark",
    title: "Arquitetura e IA aplicada",
    text: "Clean Architecture, DDD, ADRs e C4 Model. Fluxos com Claude Code, skills e times de agentes para requisitos.",
  },
];

export const stack = [
  { group: "Front-end", items: ["Next.js", "React", "TypeScript", "Tailwind CSS"] },
  { group: "Back-end", items: ["NestJS", "Effect-TS", "PostgreSQL", "Supabase", "Elixir / Phoenix", "Python"] },
  { group: "Qualidade", items: ["Playwright", "Stryker"] },
  { group: "Infra/CI", items: ["Docker", "GitLab CI", "GitHub Actions", "n8n"] },
];

export type ProjectLink = { label: string; href: string };

export const highlights = [
  { label: "Formação", value: "Sistemas de Informação, CIn/UFPE" },
  { label: "Objetivo", value: "Arquiteto de software especialista" },
];

export const featuredProjects: {
  kicker: string;
  title: string;
  summary: string;
  points: string[];
  tech: string;
  links?: ProjectLink[];
}[] = [
  {
    kicker: "PRODUTO PRÓPRIO · COFUNDADOR",
    title: "BioQuest",
    summary:
      "Plataforma de questões de biologia, criada em sociedade com um professor com público de estudantes em Pernambuco e ambição de escala nacional.",
    points: [
      "Front-end em Next.js na Vercel e back-end próprio em Effect-TS com PostgreSQL no Render, depois de migrar do Supabase.",
      "Modelo de carteira de créditos para viabilizar micropagamentos sem pagar taxa de gateway por transação.",
      "Cenários BDD em Gherkin escrito em português, testes de mutação com Stryker e testes de carga com Artillery.",
      "Pipeline de CI/CD no GitHub Actions e guias de arquitetura (CLAUDE.md) para desenvolvimento assistido por IA.",
    ],
    tech: "Next.js · Effect-TS · PostgreSQL · playwright-bdd · Stryker · Artillery",
  },
  {
    kicker: "IA NO DESENVOLVIMENTO · CÓDIGO ABERTO",
    title: "Semeadura de agentes",
    summary:
      "Plugins do Claude Code com times de subagentes que levam um pedido em texto livre até requisitos formais e testes E2E.",
    points: [
      "requisitos-pipeline: 7 subagentes transformam texto livre em user stories, casos de uso, regras de negócio e RNFs em YAML, com auditoria e validação por schema.",
      "bdd-e2e-tester: 6 subagentes transformam os cartões do requisitos-pipeline em testes E2E BDD (Gherkin, Page Objects e Playwright), sem inventar seletores.",
    ],
    tech: "Claude Code · Subagentes · YAML · Gherkin · Playwright",
    links: [
      { label: "requisitos-pipeline", href: "https://github.com/wenderu00/requisitos-pipeline" },
      { label: "bdd-e2e-tester", href: "https://github.com/wenderu00/bdd-e2e-tester" },
    ],
  },
  {
    kicker: "SETOR PÚBLICO · JOIN TECNOLOGIA",
    title: "Sistemas da Secretaria da Mulher de PE",
    summary: "Observatório da Mulher, Empreende e Protege Mulher, sistemas do Governo de Pernambuco.",
    points: [
      "Desenvolvimento front-end com Next.js e Tailwind, incluindo a arquitetura do monorepo do Observatório da Mulher.",
      "Testes E2E com Playwright integrados a BDD, com tratamento de reCAPTCHA e gravação de vídeo.",
      "Pipelines no GitLab CI, imagens Docker, deploy em Nomad e análise de qualidade com SonarQube e CodeScene.",
      "Documentação da topologia de infraestrutura e análise de usabilidade do fluxo de boletim de ocorrência.",
    ],
    tech: "Next.js · NestJS · Playwright · Docker · GitLab CI · Nomad",
  },
];

export const otherProjects: {
  kicker: string;
  title: string;
  text: string;
  tech: string;
  links?: ProjectLink[];
}[] = [
  {
    kicker: "FERRAMENTA",
    title: "mutcli",
    text: "CLI que coleta métricas de testes de mutação de vários projetos, com histórico em SQLite e painel de gráficos.",
    tech: "Python · Typer · SQLite · Chart.js",
  },
  {
    kicker: "APP PESSOAL",
    title: "XPomodoro",
    text: "Timer pomodoro com o ciclo de feedback do Extreme Programming: feedback por ciclo, retrospectiva e XP.",
    tech: "React · TypeScript",
    links: [
      { label: "Código", href: "https://github.com/wenderu00/XPomodoro" },
      { label: "Ver online", href: "https://wenderu00.github.io/XPomodoro/" },
    ],
  },
  {
    kicker: "CLI DE ESTUDOS",
    title: "prova-cli",
    text: "REPL de terminal que mede retenção de conteúdo para provas usando repetição espaçada (SM-2), com estado persistente.",
    tech: "TypeScript · Node.js · SM-2",
  },
  {
    kicker: "JOGO WEB",
    title: "The Galadur",
    text: "Jogo incremental de estratégia medieval no navegador, com engine em TypeScript puro separada da UI e testada.",
    tech: "TypeScript · Vitest · Playwright",
    links: [
      { label: "Código", href: "https://github.com/wenderu00/the-galadur" },
      { label: "Jogar online", href: "https://wenderu00.github.io/the-galadur/" },
    ],
  },
  {
    kicker: "EXPLORAÇÃO",
    title: "SpatialDev",
    text: "Conceito de terminal espacial em realidade virtual para Meta Quest 2, com Node-RED como runtime.",
    tech: "WebXR · Three.js · Node-RED",
  },
];
