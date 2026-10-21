"use client";

import { useState } from "react";
import {
  anuncio,
  CODIGO,
  concluirRodada,
  estadoInicial,
  injetar,
  MUTANTES,
  mutationScore,
  reiniciar,
  TESTES,
  trechoMutado,
} from "@/lib/mutante";
import CenaGsap from "./CenaGsap";
import { Quadro } from "./Quadro";

const FRASE_SOBREVIVENTE = "Nenhuma suíte é perfeita. Por isso eu meço.";

const botao =
  "inline-flex min-h-11 items-center rounded-md px-3 font-medium sm:px-4 transition-colors duration-200 aria-disabled:cursor-not-allowed aria-disabled:opacity-50";

export default function JogoMutante() {
  const [estado, setEstado] = useState(estadoInicial);
  // bumps on every injection and restart, so a scene callback from an older round is ignored
  const [jogada, setJogada] = useState(0);

  const { rodada, fase } = estado;
  const ocupado = fase !== "pronto";
  const concluida = rodada !== null && fase !== "animando";
  const trecho = rodada ? trechoMutado(rodada.mutante) : null;

  const injetarMutante = () => {
    if (ocupado) return;
    setEstado(injetar(estado));
    setJogada((j) => j + 1);
  };

  const recomecar = () => {
    setEstado(reiniciar());
    setJogada((j) => j + 1);
  };

  const terminou = (id: number) => {
    if (id === jogada) setEstado((atual) => concluirRodada(atual));
  };

  return (
    <Quadro
      codigo={
        trecho ? (
          <>
            {trecho.antes}
            <mark key={jogada} className="codigo-mutado rounded-sm bg-mutant/20 px-0.5 text-mutant">
              {trecho.mutado}
            </mark>
            {trecho.depois}
            <span className="sr-only">{` (trecho trocado: ${trecho.original} virou ${trecho.mutado})`}</span>
          </>
        ) : (
          CODIGO
        )
      }
      cena={
        <CenaGsap
          rodada={rodada ? { id: jogada, desfecho: rodada.desfecho, guardiao: rodada.guardiao } : null}
          guardioes={TESTES.length}
          onAnimacaoTerminou={terminou}
        />
      }
      placar={{ mortos: estado.mortos, sobreviventes: estado.sobreviventes, score: mutationScore(estado.mortos, estado.sobreviventes) }}
      controles={
        <>
          <button
            type="button"
            onClick={injetarMutante}
            aria-disabled={ocupado || undefined}
            className={`${botao} bg-accent font-semibold text-ground hover:bg-accent-hover aria-disabled:hover:bg-accent`}
          >
            Injetar mutante
          </button>
          <button
            type="button"
            onClick={recomecar}
            className={`${botao} border border-line-strong bg-ground text-ink hover:border-accent hover:text-accent`}
          >
            Reiniciar
          </button>
        </>
      }
      mensagens={
        <>
          {concluida && <p className="text-sm text-ink-soft">{anuncio(rodada)}</p>}
          {concluida && rodada.desfecho === "sobrevivente" && (
            <p className="font-display text-lg font-bold text-accent">{FRASE_SOBREVIVENTE}</p>
          )}
          {fase === "fim" && (
            <p className="text-sm text-ink-muted">{`Os ${MUTANTES.length} mutantes foram injetados. Reinicie para jogar de novo.`}</p>
          )}
        </>
      }
    />
  );
}
