import type { Metadata } from "next";
import Link from "next/link";
import { MutantHunt } from "./mutant-hunt";

export const metadata: Metadata = {
  title: "Página não encontrada · Márcio Wendell",
};

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[1200px] flex-col justify-center gap-8 px-6 py-16">
      <Link
        href="/"
        aria-label="Márcio Wendell, início"
        className="inline-flex min-h-11 items-center self-start bg-accent px-3 font-display text-xl font-extrabold text-ground no-underline"
      >
        MW
      </Link>
      <p className="font-display text-[clamp(96px,20vw,200px)] leading-none font-extrabold tracking-[-0.04em] text-accent">
        404
      </p>
      <div className="flex flex-col gap-2">
        <p className="font-mono text-ink-muted">{"// esta rota não existe"}</p>
        <MutantHunt />
      </div>
      <Link
        href="/"
        className="inline-flex min-h-12 items-center self-start rounded-md bg-accent px-6 font-semibold text-ground no-underline transition-colors duration-200 hover:bg-accent-hover"
      >
        Voltar ao início
      </Link>
    </main>
  );
}
