import type { CSSProperties } from "react";

const steps = ["Requisito", "Teste BDD", "Código", "Deploy"];

const index = (i: number) => ({ "--i": i }) as CSSProperties;

export function HeroBackdrop() {
  return <div aria-hidden="true" className="hero-backdrop pointer-events-none absolute inset-0 -z-10" />;
}

export function ScrollProgress() {
  return <div aria-hidden="true" className="scroll-progress absolute inset-x-0 bottom-0 h-0.5 bg-accent" />;
}

export function Pipeline() {
  return (
    <figure className="flex flex-col gap-5 rounded-[10px] border border-line bg-surface p-7">
      <figcaption className="font-mono text-[13px] text-ink-muted">{"// do pedido ao deploy"}</figcaption>
      <ol className="flex flex-col items-stretch sm:flex-row sm:items-center">
        {steps.map((step, i) => (
          <li key={step} className="flex flex-col items-center sm:flex-row sm:not-last:flex-1">
            <span
              style={index(i)}
              className="pipeline-node w-full rounded-md border border-line-strong px-4 py-3 text-center font-mono text-sm text-ink-soft sm:w-auto sm:flex-none"
            >
              {step}
            </span>
            {i < steps.length - 1 && (
              <span aria-hidden="true" className="relative h-8 w-0.5 bg-line sm:h-0.5 sm:w-auto sm:flex-1">
                <span style={index(i)} className="pipeline-packet absolute size-2.5 rounded-full bg-accent opacity-0" />
              </span>
            )}
          </li>
        ))}
      </ol>
    </figure>
  );
}

export function Marquee({ items }: { items: string[] }) {
  const row = (
    <ul className="flex shrink-0 gap-3 pr-3">
      {items.map((item) => (
        <li key={item} className="rounded-full border border-line-strong px-4 py-2 whitespace-nowrap">
          {item}
        </li>
      ))}
    </ul>
  );
  return (
    <div
      aria-hidden="true"
      className="marquee overflow-hidden font-mono text-sm text-ink-muted [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]"
    >
      <div className="marquee-track flex w-max">
        {row}
        {row}
      </div>
    </div>
  );
}
