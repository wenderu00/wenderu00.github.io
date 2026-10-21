import type { ReactNode } from "react";
import { TESTES } from "@/lib/mutante/mutantes";

// shared by the game and its loading stand-in, so swapping one for the other does not shift the page
export const CENA = { largura: 340, altura: 150 };

type Props = {
  codigo: ReactNode;
  cena?: ReactNode;
  placar: { mortos: number; sobreviventes: number; score: number };
  controles?: ReactNode;
  mensagens?: ReactNode;
};

export function Quadro({ codigo, cena, placar, controles, mensagens }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <pre className="rounded-md border border-line bg-ground px-4 py-3 font-mono text-sm leading-relaxed whitespace-pre-wrap text-ink-soft sm:text-[15px]">
        <code data-codigo>{codigo}</code>
      </pre>

      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="min-w-0 md:flex-[3_1_0%]" style={{ aspectRatio: `${CENA.largura} / ${CENA.altura}` }}>
          {cena}
        </div>
        <ol className="flex flex-col gap-1 font-mono text-[13px] text-ink-muted md:flex-[2_1_0%]" aria-label="Suíte de testes">
          {TESTES.map((teste, i) => (
            <li key={teste.nome}>
              <span className="text-accent">{`t${i + 1}`}</span> {teste.nome}
            </li>
          ))}
        </ol>
      </div>

      <dl className="grid grid-cols-3 gap-1.5 text-center sm:gap-3">
        {[
          { rotulo: "mortos", valor: placar.mortos, cor: "text-success" },
          { rotulo: "sobreviventes", valor: placar.sobreviventes, cor: "text-danger" },
          { rotulo: "mutation score", valor: `${placar.score}%`, cor: "text-accent" },
        ].map(({ rotulo, valor, cor }) => (
          <div key={rotulo} className="flex flex-col-reverse gap-0.5 rounded-md border border-line bg-ground px-1 py-3 sm:px-2">
            <dt className="font-mono text-[10px] leading-tight tracking-tight text-ink-muted sm:text-[13px] sm:tracking-normal">
              {rotulo}
            </dt>
            <dd data-placar={rotulo} className={`font-display text-2xl font-bold sm:text-3xl ${cor}`}>
              {valor}
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex min-h-11 flex-wrap gap-3">{controles}</div>

      <div aria-live="polite" className="flex min-h-[8.5rem] flex-col gap-1 sm:min-h-[5.5rem]">
        {mensagens}
      </div>
    </div>
  );
}
