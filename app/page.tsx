import Image from "next/image";
import type { ReactNode } from "react";
import {
  contact,
  featuredProjects,
  highlights,
  otherProjects,
  services,
  stack,
  type ServiceIcon,
} from "./content";

const container = "mx-auto max-w-[1200px] px-6";

const navItems = [
  { href: "#quem-sou", label: "01 Quem sou eu" },
  { href: "#o-que-faco", label: "02 O que faço" },
  { href: "#trabalhos", label: "03 Trabalhos" },
];

const iconPaths: Record<ServiceIcon, ReactNode> = {
  terminal: (
    <>
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M8 21h8M12 18v3M7 9l3 2-3 2M12 13h4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z" />
      <path d="M8.5 12l2.5 2.5 4.5-5" />
    </>
  ),
  flow: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <path d="M10 6.5h4a3 3 0 0 1 3 3V14M7 10v4a3 3 0 0 0 3 3h4" />
    </>
  ),
  spark: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
    </>
  ),
};

function PrimaryLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex min-h-12 items-center rounded-md bg-accent px-6 font-semibold text-ground no-underline hover:bg-accent-hover"
    >
      {children}
    </a>
  );
}

function SecondaryLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex min-h-12 items-center rounded-md border border-line-strong px-5 font-medium text-ink no-underline hover:border-accent"
    >
      {children}
    </a>
  );
}

function SectionTitle({ index, children }: { index: string; children: ReactNode }) {
  return (
    <>
      <p className="mb-2 font-mono text-sm text-accent">{index}</p>
      <h2 className="font-display text-[44px] leading-[1.05] font-bold tracking-[-0.02em]">{children}</h2>
    </>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-ground text-ink">
      <header className={`${container} flex flex-wrap items-center justify-between gap-4 border-b border-line py-6`}>
        <a href="#topo" className="font-mono text-[15px] text-ink no-underline">
          márcio<span className="text-accent">.</span>wendell
        </a>
        <nav aria-label="Seções" className="flex flex-wrap gap-2">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="p-3 font-mono text-sm text-ink-muted no-underline hover:text-accent"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <main>
        <section id="topo" className={`${container} flex flex-wrap items-center gap-14 pt-[88px] pb-24`}>
          <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-7">
            <p className="font-mono text-sm tracking-[0.04em] text-accent">
              DESENVOLVEDOR FULL-STACK · CAMPINA GRANDE, PB
            </p>
            <h1 className="font-display text-[clamp(48px,7vw,92px)] leading-[0.98] font-extrabold tracking-[-0.03em]">Márcio Wendell</h1>
            <p className="max-w-[620px] text-[21px] leading-normal text-ink-soft">
              Construo sistemas web de ponta a ponta, do Next.js ao banco de dados, com uma obsessão saudável por
              testes, arquitetura bem documentada e código que continua fácil de mudar.
            </p>
            <p className="text-base text-ink-muted">Graduando em Sistemas de Informação no CIn/UFPE</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <PrimaryLink href="#trabalhos">Ver trabalhos</PrimaryLink>
              <SecondaryLink href={`mailto:${contact.email}`}>{contact.email}</SecondaryLink>
              <SecondaryLink href={contact.github}>GitHub</SecondaryLink>
            </div>
          </div>
          <div className="relative max-w-[400px] flex-[1_1_300px]">
            <Image
              src="/foto-marcio.jpg"
              alt="Foto de Márcio Wendell"
              width={720}
              height={828}
              priority
              className="block aspect-[720/828] h-auto w-full rounded-[10px] border border-line object-cover"
            />
            <p className="mt-3 font-mono text-[13px] text-ink-muted">{"// disponível para projetos full-stack"}</p>
          </div>
        </section>

        <section id="quem-sou" className="border-t border-line">
          <div className={`${container} flex flex-wrap gap-12 py-[88px]`}>
            <div className="flex-[1_1_260px]">
              <SectionTitle index="01">Quem sou eu?</SectionTitle>
            </div>
            <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-5 text-ink-soft">
              <p>
                Sou desenvolvedor full-stack, moro em Campina Grande (PB) e curso Sistemas de Informação no Centro de
                Informática da UFPE. Meu ponto mais forte é o front-end com Next.js e Tailwind, e venho ampliando de
                forma consistente o back-end e a qualidade de software.
              </p>
              <p>
                Gosto de entender o porquê das coisas. Isso me levou a estudar arquitetura funcional com Effect-TS,
                Elixir e Phoenix, DDD e documentação com arc42, C4 Model e ADRs. Também levo a sério a qualidade:
                escrevo cenários BDD em Gherkin (em português), uso testes de mutação para medir se os testes realmente
                protegem o código e faço testes de carga antes de lançar.
              </p>
              <p>
                Hoje também exploro como usar agentes de IA de forma eficiente no desenvolvimento. Criei o conceito de
                &quot;semeadura&quot;: investir esforço em artefatos reutilizáveis (testes, guias de arquitetura,
                pipelines e geradores) que continuam gerando valor sem custo recorrente.
              </p>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3 pt-3">
                {highlights.map((item) => (
                  <div key={item.label} className="rounded-lg border border-line bg-surface p-5">
                    <p className="font-mono text-[13px] text-ink-muted">{item.label}</p>
                    <p className="mt-1.5 font-semibold text-ink">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="o-que-faco" className="border-t border-line bg-band">
          <div className={`${container} flex flex-col gap-12 py-[88px]`}>
            <div className="flex flex-wrap gap-12">
              <div className="flex-[1_1_260px]">
                <SectionTitle index="02">O que faço?</SectionTitle>
              </div>
              <p className="min-w-0 flex-[999_1_560px] text-ink-soft">
                Atuo como desenvolvedor full-stack (PJ) na JOIN Tecnologia, alocado no time da Secretaria de
                Desenvolvimento Tecnológico de Pernambuco, onde cuido de sistemas da Secretaria da Mulher. Em paralelo,
                sou cofundador e responsável técnico da BioQuest.
              </p>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="flex flex-col gap-3 rounded-[10px] border border-line bg-ground p-7"
                >
                  <svg
                    aria-hidden="true"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-accent"
                  >
                    {iconPaths[service.icon]}
                  </svg>
                  <h3 className="font-display text-[22px] font-bold">{service.title}</h3>
                  <p className="text-base text-ink-muted">{service.text}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3.5">
              <p className="font-mono text-[13px] text-ink-muted">STACK</p>
              <ul aria-label="Tecnologias" className="flex flex-wrap gap-2 font-mono text-sm">
                {stack.map((tech) => (
                  <li key={tech} className="rounded-full border border-line-strong px-3.5 py-2">
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="trabalhos" className="border-t border-line">
          <div className={`${container} flex flex-col gap-10 py-[88px]`}>
            <div>
              <SectionTitle index="03">Trabalhos já feitos</SectionTitle>
            </div>

            {featuredProjects.map((project) => (
              <article
                key={project.title}
                className="flex flex-wrap gap-8 rounded-xl border border-line bg-surface p-9"
              >
                <div className="flex flex-[1_1_280px] flex-col gap-2.5">
                  <p className="font-mono text-[13px] text-accent">{project.kicker}</p>
                  <h3 className="font-display text-[34px] font-extrabold tracking-[-0.02em]">{project.title}</h3>
                  <p className="text-base text-ink-muted">{project.summary}</p>
                </div>
                <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-3.5 text-ink-soft">
                  <ul className="flex list-disc flex-col gap-2 pl-5">
                    {project.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  <p className="font-mono text-[13px] text-ink-muted">{project.tech}</p>
                </div>
              </article>
            ))}

            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
              {otherProjects.map((project) => (
                <article key={project.title} className="flex flex-col gap-2.5 rounded-xl border border-line p-7">
                  <p className="font-mono text-[13px] text-accent">{project.kicker}</p>
                  <h3 className="font-display text-2xl font-bold">{project.title}</h3>
                  <p className="text-base text-ink-soft">{project.text}</p>
                  <p className="mt-auto pt-2 font-mono text-[13px] text-ink-muted">{project.tech}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-band">
        <div className={`${container} flex flex-wrap items-end justify-between gap-8 py-[72px]`}>
          <div className="flex flex-col gap-3">
            <h2 className="font-display text-[40px] font-bold tracking-[-0.02em]">Vamos conversar?</h2>
            <p className="text-ink-muted">Aberto a oportunidades full-stack, projetos e parcerias.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <PrimaryLink href={`mailto:${contact.email}`}>Enviar e-mail</PrimaryLink>
            <SecondaryLink href={contact.github}>GitHub</SecondaryLink>
          </div>
        </div>
      </footer>
    </div>
  );
}
