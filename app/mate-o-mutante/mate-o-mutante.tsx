"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { CenaSvg } from "./cena-svg";
import { rive as contrato } from "./rive-contrato";
import {
  anuncio,
  cenaInicial,
  codigo,
  codigoMutado,
  estadoInicial,
  fasesDaRodada,
  fraseSobrevivente,
  guardioes,
  injetar,
  mutantes,
  mutationScore,
  type Cena,
  type Rodada,
} from "./logica";

const CenaRive = dynamic(() => import("./cena-rive"), { ssr: false });

const glyphs = "01<>/{}[]#$*+=!?";

const original = { antes: codigo.antes, trecho: codigo.operador, depois: codigo.depois };

const embaralhar = (texto: string) =>
  [...texto].map((char) => (char === " " ? char : glyphs[Math.floor(Math.random() * glyphs.length)])).join("");

export function MateOMutante() {
  const ref = useRef<HTMLElement>(null);
  const perto = useInView(ref, { margin: "400px", once: true });
  const reduce = useReducedMotion();
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const [jogo, setJogo] = useState(estadoInicial);
  const [cena, setCena] = useState<Cena>(cenaInicial);
  const [trecho, setTrecho] = useState({ ...original, mutado: false });
  const [rodada, setRodada] = useState<Rodada | null>(null);
  const [rodando, setRodando] = useState(false);
  const [aviso, setAviso] = useState("");
  const [riveStatus, setRiveStatus] = useState<"sondando" | "carregando" | "pronto" | "falhou">("sondando");

  const limpar = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => limpar, []);

  // Probe the .riv first: while it does not exist, neither the Rive runtime nor its WASM are downloaded.
  useEffect(() => {
    if (!perto || reduce || riveStatus !== "sondando") return;
    let ativo = true;
    fetch(contrato.arquivo, { method: "HEAD" })
      .then((resposta) => ativo && setRiveStatus(resposta.ok ? "carregando" : "falhou"))
      .catch(() => ativo && setRiveStatus("falhou"));
    return () => {
      ativo = false;
    };
  }, [perto, reduce, riveStatus]);

  const depois = (ms: number, fn: () => void) => {
    timers.current.push(setTimeout(fn, ms));
  };

  const onInjetar = () => {
    const passo = injetar(jogo);
    if (!passo || rodando) return;
    const { rodada: nova, estado: proximo } = passo;
    const alvo = codigoMutado(nova.mutante);

    setRodando(true);
    setRodada(null);
    setTrecho({ ...alvo, trecho: reduce ? alvo.trecho : embaralhar(alvo.trecho), mutado: true });
    if (!reduce) {
      for (let t = 40; t < 250; t += 40) depois(t, () => setTrecho({ ...alvo, trecho: embaralhar(alvo.trecho), mutado: true }));
      depois(250, () => setTrecho({ ...alvo, mutado: true }));
    }

    const base = { ...cena, mutanteAtivo: true, resultado: nova.resultado, rodada: proximo.proximo };
    let at = 0;
    for (const fase of fasesDaRodada(nova.resultado)) {
      const inicio = at;
      depois(reduce ? 0 : inicio, () => setCena({ ...base, estado: fase.estado }));
      at += fase.ms;
    }
    depois(reduce ? 0 : at, () => {
      setJogo(proximo);
      setRodada(nova);
      setCena({
        ...base,
        estado: "guarda",
        mutanteAtivo: false,
        mortos: proximo.mortos,
        sobreviventes: proximo.sobreviventes,
      });
      setAviso(anuncio(nova, proximo));
      setRodando(false);
    });
  };

  const onReiniciar = () => {
    limpar();
    setJogo(estadoInicial());
    setCena(cenaInicial);
    setTrecho({ ...original, mutado: false });
    setRodada(null);
    setRodando(false);
    setAviso("Placar zerado. Código original de volta.");
  };

  const carregarRive = !reduce && (riveStatus === "carregando" || riveStatus === "pronto");
  const score = mutationScore(jogo);

  return (
    <figure
      ref={ref}
      aria-labelledby="mate-o-mutante-titulo"
      className="grid gap-6 rounded-[10px] border border-line bg-surface p-5 sm:p-7 md:grid-cols-2"
    >
      <div className="flex min-w-0 flex-col gap-5">
        <figcaption className="flex flex-col gap-1">
          <span className="font-mono text-[13px] text-ink-muted">{"// mate o mutante: é assim que eu meço meus testes"}</span>
          <span id="mate-o-mutante-titulo" className="font-display text-[22px] font-bold">
            Mate o mutante
          </span>
        </figcaption>

        <pre className="rounded-md border border-line-strong bg-ground p-4 font-mono text-[13px] leading-relaxed whitespace-pre-wrap text-ink-soft sm:text-sm">
          <code data-mutado={trecho.mutado || undefined}>
            {trecho.antes}
            {trecho.mutado ? (
              <motion.mark
                key={`${jogo.proximo}-${rodando}`}
                initial={reduce ? false : { x: -2 }}
                animate={{ x: [-2, 2, -1, 0] }}
                transition={{ duration: 0.25 }}
                className="inline-block rounded-sm bg-accent px-0.5 text-ground"
              >
                {trecho.trecho}
              </motion.mark>
            ) : (
              trecho.trecho
            )}
            {trecho.depois}
          </code>
        </pre>

        <div className="flex flex-col gap-2">
          <p className="font-mono text-[13px] text-ink-muted">{"// guardiões (um por teste)"}</p>
          <ul aria-label="Guardiões" className="flex flex-col gap-1.5 font-mono text-[13px]">
            {guardioes.map((g, i) => {
              const pegou = rodada?.pegoPor.includes(g.nome);
              return (
                <li key={g.nome} className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <span className="text-ink-soft">{`t${i + 1} ${g.nome} (${g.saldo}, ${g.preco})`}</span>
                  {rodada && (
                    <span className={pegou ? "text-accent" : "text-ink-muted"}>{pegou ? "pegou" : "não percebeu"}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onInjetar}
            disabled={rodando || jogo.terminou}
            className="inline-flex min-h-12 items-center rounded-md bg-accent px-6 font-semibold text-ground transition-colors duration-200 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            Injetar mutante
          </button>
          <button
            type="button"
            onClick={onReiniciar}
            className="inline-flex min-h-12 items-center rounded-md border border-line-strong bg-ground px-5 font-medium text-ink transition-colors duration-200 hover:border-accent hover:text-accent"
          >
            Reiniciar
          </button>
        </div>

        <dl aria-label="Placar" className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {[
            ["Mortos", String(jogo.mortos)],
            ["Sobreviventes", String(jogo.sobreviventes)],
            ["Mutation score", `${score}%`],
          ].map(([rotulo, valor]) => (
            <div key={rotulo} className="flex min-w-0 flex-col gap-1 rounded-md border border-line p-3 last:col-span-2 lg:last:col-span-1">
              <dt className="font-mono text-[11px] text-ink-muted sm:text-xs">{rotulo}</dt>
              <dd className="font-display text-2xl font-bold text-ink">{valor}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="flex min-w-0 flex-col gap-4">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md border border-line bg-ground">
          {riveStatus !== "pronto" && <CenaSvg cena={cena} />}
          {carregarRive && (
            <div data-cena="rive" className={riveStatus === "pronto" ? "contents" : "invisible"}>
              <CenaRive cena={cena} onStatus={setRiveStatus} />
            </div>
          )}
        </div>
        <div className="flex min-h-[4.5rem] flex-col gap-1 font-mono text-[13px]">
          {rodada && (
            <p className="text-ink-muted">{`// mutante ${rodada.mutante.id} de ${mutantes.length}: ${rodada.mutante.descricao}`}</p>
          )}
          {rodada?.resultado === "sobreviveu" && <p className="text-accent">{fraseSobrevivente}</p>}
          {jogo.terminou && !rodando && (
            <p className="text-ink-soft">{`// todos os ${mutantes.length} mutantes testados. Score final ${score}%.`}</p>
          )}
        </div>
        <p aria-live="polite" className="sr-only">
          {aviso}
        </p>
      </div>
    </figure>
  );
}
