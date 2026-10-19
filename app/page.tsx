import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { ConsoleGreeting } from "./console-greeting";
import {
  contact,
  featuredProjects,
  highlights,
  otherProjects,
  services,
  site,
  stack,
  type ProjectLink,
  type ServiceIcon,
} from "./content";
import { HeroBackdrop, Marquee, Pipeline, ScrollProgress } from "./motion";
import { SectionNav } from "./section-nav";

const container = "mx-auto max-w-[1200px] px-6";

const availability = "// disponível para projetos full-stack";

const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  image: `${site.url}/foto-marcio.jpg`,
  email: `mailto:${contact.email}`,
  jobTitle: "Desenvolvedor full-stack",
  description: site.description,
  address: { "@type": "PostalAddress", addressLocality: "Recife", addressRegion: "PE", addressCountry: "BR" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Centro de Informática da UFPE" },
  knowsAbout: stack.flatMap((group) => group.items),
  sameAs: [contact.github, contact.youtube, contact.linkedin].filter(Boolean),
};

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;
const stagger = (index: number) => ({ "--i": index }) as CSSProperties;

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
      className="inline-flex min-h-12 items-center rounded-md bg-accent px-6 font-semibold text-ground no-underline transition-colors duration-200 hover:bg-accent-hover"
    >
      {children}
    </a>
  );
}

function SecondaryLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex min-h-12 items-center rounded-md border border-line-strong px-5 font-medium text-ink no-underline transition-colors duration-200 hover:border-accent hover:text-accent"
    >
      {children}
    </a>
  );
}

function ProfileLinks() {
  return (
    <>
      {contact.linkedin && <SecondaryLink href={contact.linkedin}>LinkedIn</SecondaryLink>}
      <SecondaryLink href={contact.github}>GitHub</SecondaryLink>
      <SecondaryLink href={contact.youtube}>YouTube</SecondaryLink>
      {contact.cv && <SecondaryLink href={contact.cv}>Baixar CV</SecondaryLink>}
    </>
  );
}

function ProjectLinks({ links }: { links?: ProjectLink[] }) {
  if (!links) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="inline-flex min-h-11 items-center rounded-md border border-line-strong px-4 font-mono text-sm text-ink no-underline transition-colors duration-200 hover:border-accent hover:text-accent"
        >
          {link.label} ↗
        </a>
      ))}
    </div>
  );
}

function SectionTitle({ index, children }: { index: string; children: ReactNode }) {
  return (
    <div className="reveal flex flex-col gap-2">
      <p className="flex items-center gap-4 font-mono text-sm text-accent">
        {index}
        <span aria-hidden="true" className="title-line h-px flex-1 bg-line" />
      </p>
      <h2 className="font-display text-[clamp(36px,5vw,52px)] leading-[1.05] font-bold tracking-[-0.02em]">
        {children}
      </h2>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-ground text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, "\\u003c") }}
      />
      <ConsoleGreeting />
      <a
        href="#conteudo"
        className="sr-only z-20 bg-accent px-4 py-3 font-semibold text-ground focus:not-sr-only focus:fixed focus:top-[calc(env(safe-area-inset-top)+0.75rem)] focus:left-3"
      >
        Pular para o conteúdo
      </a>
      <header className="sticky top-0 z-10 border-b border-line bg-ground pt-[env(safe-area-inset-top)]">
        <div className={`${container} flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3`}>
          <a
            href="#topo"
            aria-label="Márcio Wendell, início"
            className="inline-flex min-h-11 items-center bg-accent px-3 font-display text-xl font-extrabold text-ground no-underline"
          >
            MW
          </a>
          <SectionNav />
        </div>
        <ScrollProgress />
      </header>

      <main id="conteudo">
        <section id="topo" className={`${container} relative isolate flex scroll-mt-20 flex-wrap items-center gap-14 pt-[88px] pb-24`}>
          <HeroBackdrop />
          <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-7">
            <p className="hero-rise font-mono text-sm tracking-[0.04em] text-accent">
              DESENVOLVEDOR FULL-STACK · RECIFE, PE
            </p>
            <h1 className="hero-lift font-display text-[clamp(48px,7vw,92px)] leading-[0.98] font-extrabold tracking-[-0.03em]">Márcio Wendell</h1>
            <p style={delay(150)} className="hero-rise max-w-[620px] text-[21px] leading-normal text-ink-soft">
              Construo sistemas web de ponta a ponta, do Next.js ao banco de dados, com uma obsessão saudável por
              testes, arquitetura bem documentada e código que continua fácil de mudar.
            </p>
            <p style={delay(250)} className="hero-rise text-base text-ink-muted">Graduando em Sistemas de Informação no CIn/UFPE</p>
            <div style={delay(350)} className="hero-rise flex flex-wrap gap-3 pt-2">
              <PrimaryLink href="#trabalhos">Ver trabalhos</PrimaryLink>
              <SecondaryLink href={`mailto:${contact.email}`}>E-mail</SecondaryLink>
              <ProfileLinks />
            </div>
          </div>
          <div style={delay(450)} className="hero-rise relative max-w-[400px] flex-[1_1_300px]">
            <Image
              src="/foto-marcio.jpg"
              alt="Foto de Márcio Wendell"
              width={720}
              height={828}
              priority
              className="block aspect-[720/828] h-auto w-full border-4 border-accent object-cover"
            />
            <p
              style={{ "--chars": availability.length } as CSSProperties}
              className="typing mt-3 text-[13px] text-ink-muted"
            >
              {availability}
            </p>
          </div>
        </section>

        <section id="quem-sou" className="scroll-mt-20 border-t border-line">
          <div className={`${container} flex flex-col gap-10 py-[88px]`}>
            <SectionTitle index="01">Quem sou eu?</SectionTitle>
            <div className="flex max-w-[820px] flex-col gap-5 text-ink-soft">
              <p>
                Sou desenvolvedor full-stack, moro em Recife (PE) e curso Sistemas de Informação no Centro de
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
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
              {highlights.map((item, i) => (
                <div key={item.label} style={stagger(i)} className="reveal rounded-lg border border-line bg-surface p-5">
                  <p className="font-mono text-[13px] text-ink-muted">{item.label}</p>
                  <p className="mt-1.5 font-semibold text-ink">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="o-que-faco" className="scroll-mt-20 border-t border-line bg-band">
          <div className={`${container} flex flex-col gap-10 py-[88px]`}>
            <SectionTitle index="02">O que faço?</SectionTitle>
            <p className="max-w-[820px] text-ink-soft">
              Atuo como desenvolvedor full-stack (PJ) na JOIN Tecnologia, alocado no time da Secretaria de
              Desenvolvimento Tecnológico de Pernambuco, onde cuido de sistemas da Secretaria da Mulher. Em paralelo,
              sou cofundador e responsável técnico da BioQuest.
            </p>
            <Pipeline />
            <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
              {services.map((service, i) => (
                <div
                  key={service.title}
                  style={stagger(i)}
                  className="reveal flex flex-col gap-3 rounded-[10px] border border-line bg-surface p-7 transition duration-200 hover:-translate-y-1 hover:border-accent"
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
          </div>
        </section>

        <section id="stack" className="scroll-mt-20 border-t border-line">
          <div className={`${container} flex flex-col gap-10 py-[88px]`}>
            <SectionTitle index="03">Stack de tecnologias</SectionTitle>
            <p className="max-w-[820px] text-ink-soft">
              As ferramentas que uso no dia a dia, do front-end à infraestrutura.
            </p>
            <Marquee items={stack.flatMap((group) => group.items)} />
            <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
              {stack.map((group, i) => (
                <div key={group.group} style={stagger(i)} className="reveal flex flex-col gap-3">
                  <h3 className="font-display text-lg font-bold">{group.group}</h3>
                  <ul aria-label={group.group} className="flex flex-wrap gap-2 font-mono text-sm">
                    {group.items.map((tech) => (
                      <li key={tech} className="rounded-full border border-line-strong px-3.5 py-2">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="trabalhos" className="scroll-mt-20 border-t border-line bg-band">
          <div className={`${container} flex flex-col gap-10 py-[88px]`}>
            <SectionTitle index="04">Trabalhos já feitos</SectionTitle>

            {featuredProjects.map((project) => (
              <article
                key={project.title}
                className="reveal flex flex-col gap-6 rounded-xl border border-line bg-surface p-[clamp(24px,4vw,40px)] transition-colors duration-200 hover:border-accent"
              >
                <div className="flex flex-col gap-2">
                  <p className="font-mono text-[13px] text-accent">{project.kicker}</p>
                  <h3 className="font-display text-[clamp(28px,3.5vw,36px)] leading-tight font-extrabold tracking-[-0.02em]">
                    {project.title}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-x-10 gap-y-5">
                  <p className="flex-[1_1_280px] text-base text-ink-muted">{project.summary}</p>
                  <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-4 text-ink-soft">
                    <ul className="flex list-disc flex-col gap-2 pl-5 marker:text-accent">
                      {project.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                    <p className="font-mono text-[13px] text-ink-muted">{project.tech}</p>
                    <ProjectLinks links={project.links} />
                  </div>
                </div>
              </article>
            ))}

            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
              {otherProjects.map((project, i) => (
                <article
                  key={project.title}
                  style={stagger(i % 3)}
                  className="reveal flex flex-col gap-2.5 rounded-xl border border-line p-7 transition duration-200 hover:-translate-y-1 hover:border-accent"
                >
                  <p className="font-mono text-[13px] text-accent">{project.kicker}</p>
                  <h3 className="font-display text-2xl font-bold">{project.title}</h3>
                  <p className="text-base text-ink-soft">{project.text}</p>
                  <p className="mt-auto pt-2 font-mono text-[13px] text-ink-muted">{project.tech}</p>
                  <ProjectLinks links={project.links} />
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
            <a href={`mailto:${contact.email}`} className="font-mono text-accent underline-offset-4 transition-colors duration-200 hover:text-accent-hover hover:underline">
              {contact.email}
            </a>
          </div>
          <div className="flex flex-wrap gap-3">
            <PrimaryLink href={`mailto:${contact.email}`}>Enviar e-mail</PrimaryLink>
            <ProfileLinks />
          </div>
        </div>
      </footer>
    </div>
  );
}
