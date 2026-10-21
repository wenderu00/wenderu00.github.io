"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { CODIGO } from "@/lib/mutante/mutantes";
import { Quadro } from "./Quadro";

// static stand-in with the same layout, shown until the game (and GSAP) is downloaded
function Espera() {
  return (
    <Quadro
      codigo={CODIGO}
      placar={{ mortos: 0, sobreviventes: 0, score: 0 }}
      mensagens={<p className="font-mono text-[13px] text-ink-muted">{"// carregando os guardiões..."}</p>}
    />
  );
}

const JogoMutante = dynamic(() => import("./JogoMutante"), { ssr: false, loading: Espera });

export function MateOMutante() {
  const ref = useRef<HTMLElement>(null);
  const [perto, setPerto] = useState(false);

  useEffect(() => {
    const figura = ref.current;
    if (!figura) return;
    const observer = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        setPerto(true);
        observer.disconnect();
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(figura);
    return () => observer.disconnect();
  }, []);

  return (
    <figure ref={ref} data-mate-o-mutante className="flex flex-col gap-5 rounded-[10px] border border-line bg-surface p-5 sm:p-7">
      <figcaption className="flex flex-col gap-1 font-mono text-[13px] text-ink-muted">
        <span>{"// mate o mutante: teste de mutação na prática"}</span>
        <span>
          {"// cada guardião é um teste. Injete um mutante no código e veja se a suíte percebe a troca."}
        </span>
      </figcaption>
      {perto ? <JogoMutante /> : <Espera />}
    </figure>
  );
}
