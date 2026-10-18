export const contact = {
  email: "marcio.wendell.contact@gmail.com",
  github: "https://github.com/wenderu00",
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
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "NestJS",
  "Effect-TS",
  "PostgreSQL",
  "Supabase",
  "Elixir / Phoenix",
  "Python",
  "Playwright",
  "Stryker",
  "Docker",
  "GitLab CI",
  "GitHub Actions",
  "n8n",
];

export const highlights = [
  { label: "Formação", value: "Sistemas de Informação, CIn/UFPE" },
  { label: "Em formação", value: "Certificação CTFL (ISTQB)" },
  { label: "Objetivo", value: "Arquiteto de software especialista" },
];

export const featuredProjects = [
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
  {
    kicker: "IOT INDUSTRIAL · ARQUITETURA",
    title: "COLI Sense",
    summary:
      "MVP de plataforma de monitoramento e telemetria geotécnica, pensado para contratação por licitação pública.",
    points: [
      "Arquitetura do produto como único desenvolvedor responsável.",
      "Proposta técnico-comercial elaborada para concorrer no mercado de monitoramento geotécnico.",
      "Especificação de controle de acesso em BDD: 5 perfis por 5 módulos, com cenários em playwright-bdd.",
    ],
    tech: "IoT · RBAC · BDD/Gherkin · Proposta técnica",
  },
];

export const otherProjects = [
  {
    kicker: "FERRAMENTA",
    title: "mutcli",
    text: "CLI que coleta métricas de testes de mutação de vários projetos, com histórico em SQLite e painel de gráficos.",
    tech: "Python · Typer · SQLite · Chart.js",
  },
  {
    kicker: "APP PESSOAL",
    title: "XPomodoro",
    text: "Timer Pomodoro com ciclos de XP e revisão de desempenho, modelado com DDD.",
    tech: "Elixir · Phoenix LiveView · Ecto · Oban",
  },
  {
    kicker: "CLI DE ESTUDOS",
    title: "prova-cli",
    text: "REPL de terminal que mede retenção de conteúdo para provas usando repetição espaçada (SM-2), com estado persistente.",
    tech: "TypeScript · Node.js · SM-2",
  },
  {
    kicker: "IA NO DESENVOLVIMENTO",
    title: "Semeadura de agentes",
    text: "Fluxo de trabalho com Claude Code e um time de agentes que classifica e formaliza requisitos (user stories, regras de negócio, RNFs).",
    tech: "Claude Code · Skills · MCP · ADRs",
  },
  {
    kicker: "JOGO WEB",
    title: "RTS no navegador",
    text: "Jogo de estratégia em tempo real feito com DOM puro, com unidades de exército e sistema de batalha em game loop.",
    tech: "JavaScript · HTML/CSS",
  },
  {
    kicker: "EXPLORAÇÃO",
    title: "SpatialDev",
    text: "Conceito de terminal espacial em realidade virtual para Meta Quest 2, com Node-RED como runtime.",
    tech: "WebXR · Three.js · Node-RED",
  },
];
