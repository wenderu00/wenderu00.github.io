import type { Metadata } from "next";
import type { ReactNode } from "react";
import { contact, featuredProjects, otherProjects, profile, services, site, stack } from "../content";

export const metadata: Metadata = {
  title: `Currículo · ${site.name}`,
  robots: { index: false },
};

const display = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "");

function Section({ title, long, children }: { title: string; long?: boolean; children: ReactNode }) {
  return (
    <section className={`flex flex-col gap-3 ${long ? "" : "break-inside-avoid"}`}>
      <h2 className="border-b-2 border-black pb-1 font-display text-[13px] font-bold tracking-[0.12em] uppercase">{title}</h2>
      {children}
    </section>
  );
}

export default function Curriculo() {
  return (
    <div className="cv min-h-screen bg-white text-[13px] leading-normal text-neutral-800">
      <main className="mx-auto flex max-w-[800px] flex-col gap-6 px-10 py-12 print:p-0">
        <header className="flex flex-col gap-2">
          <h1 className="font-display text-[34px] leading-none font-extrabold tracking-[-0.02em] text-black">{site.name}</h1>
          <p className="font-mono text-xs tracking-[0.04em] text-neutral-600 uppercase">
            {profile.role} · {profile.location}
          </p>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px]">
            {[`mailto:${contact.email}`, contact.linkedin, contact.github, site.url, contact.youtube].map((href) => (
              <li key={href}>
                <a href={href} className="text-black underline decoration-neutral-400 underline-offset-2">
                  {href.startsWith("mailto:") ? contact.email : display(href)}
                </a>
              </li>
            ))}
          </ul>
        </header>

        <Section title="Resumo">
          <p>{profile.tagline}</p>
          <p>{profile.currentWork}</p>
        </Section>

        <Section title="Experiência e projetos" long>
          {featuredProjects.map((project) => (
            <article key={project.title} className="flex break-inside-avoid flex-col gap-1">
              <h3 className="font-display text-[15px] font-bold text-black">{project.title}</h3>
              <p className="font-mono text-[10.5px] tracking-[0.04em] text-neutral-500">{project.kicker}</p>
              <p>{project.summary}</p>
              <ul className="flex list-disc flex-col gap-0.5 pl-4">
                {project.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <p className="font-mono text-[10.5px] text-neutral-500">{project.tech}</p>
            </article>
          ))}
        </Section>

        <Section title="Outros projetos">
          <ul className="flex flex-col gap-1">
            {otherProjects.map((project) => (
              <li key={project.title} className="break-inside-avoid">
                <strong className="text-black">{project.title}</strong>: {project.text}{" "}
                <span className="font-mono text-[10.5px] text-neutral-500">({project.tech})</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Competências">
          <ul className="flex flex-col gap-1">
            {services.map((service) => (
              <li key={service.title} className="break-inside-avoid">
                <strong className="text-black">{service.title}</strong>: {service.text}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Stack">
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
            {stack.map((group) => (
              <div key={group.group} className="contents">
                <dt className="font-semibold text-black">{group.group}</dt>
                <dd>{group.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section title="Formação">
          <p>{profile.education}</p>
        </Section>
      </main>
    </div>
  );
}
