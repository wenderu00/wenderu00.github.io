"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { useEffect, useRef } from "react";
import { Guardiao } from "./Guardiao";
import { FORMA_MUTANTE, Mutante } from "./Mutante";
import { CENA } from "./Quadro";

// this module is only reached through a client-only dynamic import, so plugins never register on the server
gsap.registerPlugin(useGSAP, MorphSVGPlugin, DrawSVGPlugin);

// everything the scene knows about a round; a Rive or PixiJS scene only needs to honor these props
export type RodadaCena = { id: number; desfecho: "morto" | "sobrevivente"; guardiao: number | null };

export type CenaProps = {
  rodada: RodadaCena | null;
  guardioes: number;
  onAnimacaoTerminou: (id: number) => void;
};

const { largura: LARGURA, altura: ALTURA } = CENA;
const CHAO = 134;
const ORIGEM_MUTANTE = { x: 290, y: 120 };
const CAPTURA = 228;
const baseGuardiao = (i: number) => 40 + i * 56;

const RASTRO_CAPTURA = "M290,128 Q282,116 274,128 T258,128 T242,128 T228,128";
const RASTRO_FUGA = "M290,128 Q298,116 306,128 T322,128 T338,128 T354,128";

// no index selects every guardian
const guardiaoSel = (guardiao?: number) => (guardiao === undefined ? "[data-guardiao]" : `[data-guardiao="${guardiao}"]`);
const parte = (guardiao: number | undefined, nome: string) => `${guardiaoSel(guardiao)} [data-parte="${nome}"]`;
const todos = (nome: string) => parte(undefined, nome);
const tracos = (guardiao?: number) => ["casco", "braco-esq", "braco-dir", "pernas"].map((nome) => parte(guardiao, nome)).join(",");
const bracos = (guardiao?: number) => [parte(guardiao, "braco-esq"), parte(guardiao, "braco-dir")];
// shoulders sit at the inner top corner of each arm
const ombro = (i: number) => (i ? "0% 0%" : "100% 0%");

export default function CenaGsap({ rodada, guardioes, onAnimacaoTerminou }: CenaProps) {
  const ref = useRef<SVGSVGElement>(null);
  const terminar = useRef(onAnimacaoTerminou);

  useEffect(() => {
    terminar.current = onAnimacaoTerminou;
  });

  useGSAP(
    () => {
      const cena = ref.current!;
      const token = (nome: string) => getComputedStyle(cena).getPropertyValue(`--color-${nome}`).trim();
      const cores = { guarda: token("accent"), perigo: token("danger"), sucesso: token("success") };
      const mm = gsap.matchMedia(cena);

      mm.add(
        { movimento: "(prefers-reduced-motion: no-preference)", reduzido: "(prefers-reduced-motion: reduce)" },
        (context) => {
          const { movimento } = context.conditions as { movimento: boolean };

          if (movimento) {
            gsap.to(todos("corpo"), { scaleY: 1.03, transformOrigin: "50% 100%", duration: 1.4, ease: "sine.inOut", repeat: -1, yoyo: true, stagger: 0.3 });
            gsap.to(todos("olhos"), {
              keyframes: [{ scaleY: 0.1, duration: 0.07 }, { scaleY: 1, duration: 0.09 }],
              transformOrigin: "50% 50%",
              repeat: -1,
              repeatDelay: 3.2,
              stagger: 0.7,
            });
          }
          if (!rodada) return;

          const { id, desfecho, guardiao } = rodada;
          const morto = desfecho === "morto" && guardiao !== null;
          const rastro = morto ? "[data-rastro='captura']" : "[data-rastro='fuga']";
          const tl = gsap.timeline({ onComplete: () => terminar.current(id) });
          const aGuarda = () =>
            tl
              .to(tracos(), { stroke: cores.guarda, duration: 0.3 }, "<")
              .to(todos("duvida"), { opacity: 0, y: 0, duration: 0.2 }, "<");

          if (!movimento) {
            // reduced motion: no running and no shaking, only fades and color swaps
            tl.set("[data-mutante] path", { morphSVG: FORMA_MUTANTE })
              .to("[data-mutante]", { opacity: 1, duration: 0.15 })
              .to("[data-mutante]", { opacity: 0, duration: 0.2 }, "+=0.25");
            if (morto) {
              tl.set(tracos(guardiao), { stroke: cores.perigo }, "<").set(tracos(guardiao), { stroke: cores.sucesso }, "+=0.2");
            } else {
              tl.to(todos("duvida"), { opacity: 1, duration: 0.2 }, "<");
            }
            tl.to({}, { duration: 0.4 });
            aGuarda();
            return;
          }

          const corpos = todos("corpo-todo");
          const corpoMutante = "[data-mutante] [data-parte='corpo'], [data-mutante] [data-parte^='sombra']";

          // 1. the mutant glitches into existence
          tl.set("[data-mutante]", { opacity: 1 })
            .to(corpoMutante, { morphSVG: FORMA_MUTANTE, duration: 0.45, ease: "back.out(2)" })
            .to("[data-mutante] [data-parte='glitch']", { x: 2, duration: 0.04, repeat: 7, yoyo: true, ease: "steps(1)" }, "<");

          // 2. anticipation: guardians crouch and lean back before the sprint
          tl.to(corpos, { scaleX: 1.08, scaleY: 0.86, rotation: -8, transformOrigin: "50% 100%", duration: 0.16, ease: "power2.in" })
            .to(corpos, { scaleX: 1, scaleY: 1, rotation: 10, duration: 0.14, ease: "power2.out" });

          // 3. the chase
          const corrida = "corrida";
          tl.addLabel(corrida)
            .to(todos("perna-esq"), { rotation: 28, transformOrigin: "50% 0%", duration: 0.1, repeat: 7, yoyo: true, ease: "none" }, corrida)
            .to(todos("perna-dir"), { rotation: -28, transformOrigin: "50% 0%", duration: 0.1, repeat: 7, yoyo: true, ease: "none" }, corrida)
            .fromTo(rastro, { drawSVG: "0% 0%", opacity: 1 }, { drawSVG: "0% 100%", duration: 0.8, ease: "power1.inOut" }, corrida)
            .to("[data-mutante] [data-parte='corpo']", { y: -5, duration: 0.1, repeat: 7, yoyo: true, ease: "sine.inOut" }, corrida);

          for (let i = 0; i < guardioes; i++) {
            const caca = morto && i === guardiao;
            const ate = caca ? CAPTURA - 22 - baseGuardiao(i) : morto ? 8 : 40;
            tl.to(guardiaoSel(i), { x: ate, duration: 0.8, ease: caca ? "power2.inOut" : "power2.out" }, corrida);
            // a catcher standing behind teammates leaps over them instead of running through them
            if (caca && i < guardioes - 1) {
              tl.to(guardiaoSel(i), { y: -62, duration: 0.4, ease: "power2.out", repeat: 1, yoyo: true }, corrida);
            }
          }

          if (morto) {
            tl.to("[data-mutante]", { x: CAPTURA - ORIGEM_MUTANTE.x, duration: 0.8, ease: "power1.inOut" }, corrida);

            // 4a. capture: squash and stretch, red while it catches, green when it is done
            const captor = parte(guardiao, "corpo-todo");
            tl.to(corpos, { rotation: 0, duration: 0.15 })
              .set(tracos(guardiao), { stroke: cores.perigo }, "<")
              .to(captor, { scaleX: 1.15, scaleY: 0.88, duration: 0.1, ease: "power2.out" }, "<")
              .to(bracos(guardiao), { rotation: (n: number) => (n ? -40 : 40), transformOrigin: ombro, duration: 0.1 }, "<")
              .to("[data-mutante]", { scale: 0, opacity: 0, transformOrigin: "50% 50%", duration: 0.25, ease: "back.in(2)" }, "<")
              .to(captor, { scaleX: 1, scaleY: 1, duration: 0.3, ease: "back.out(3)" })
              .to(tracos(guardiao), { stroke: cores.sucesso, duration: 0.2 }, "+=0.1")
              .to(bracos(guardiao), { rotation: (n: number) => (n ? -110 : 110), duration: 0.2 }, "<")
              .to(captor, { y: -12, duration: 0.18, ease: "power2.out", repeat: 1, yoyo: true }, "<");
          } else {
            tl.to("[data-mutante]", { x: LARGURA - ORIGEM_MUTANTE.x + 30, duration: 0.9, ease: "power2.in" }, corrida).to(
              "[data-mutante]",
              { opacity: 0, duration: 0.2 },
              "-=0.2",
            );

            // 4b. escape: everyone stops, tilts the head and looks lost
            tl.to(corpos, { rotation: -9, duration: 0.25, ease: "back.out(2)" })
              .to(todos("pupila-esq"), { scale: 0.55, transformOrigin: "50% 50%", duration: 0.2 }, "<")
              .to(todos("duvida"), { opacity: 1, y: -4, duration: 0.25, stagger: 0.08 }, "<")
              .to(todos("braco-dir"), { rotation: -140, transformOrigin: "0% 0%", duration: 0.2 }, "<")
              .to({}, { duration: 0.5 });
          }

          // 5. back to the guard posts
          tl.to(rastro, { opacity: 0, duration: 0.3 }, "+=0.2")
            .to("[data-guardiao]", { x: 0, y: 0, duration: 0.5, ease: "power2.inOut" }, "<")
            .to(corpos, { rotation: 0, duration: 0.3 }, "<")
            .to(bracos(), { rotation: 0, duration: 0.3 }, "<")
            .to(todos("pupila-esq"), { scale: 1, duration: 0.2 }, "<");
          aGuarda();
        },
      );
    },
    { scope: ref, dependencies: [rodada?.id], revertOnUpdate: true },
  );

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      viewBox={`0 0 ${LARGURA} ${ALTURA}`}
      className="block h-auto w-full"
      data-cena
    >
      <line x1={8} y1={CHAO + 0.5} x2={LARGURA - 8} y2={CHAO + 0.5} className="stroke-line" strokeDasharray="2 6" />
      <path data-rastro="captura" d={RASTRO_CAPTURA} fill="none" opacity={0} className="stroke-mutant" strokeWidth={1.5} strokeLinecap="round" />
      <path data-rastro="fuga" d={RASTRO_FUGA} fill="none" opacity={0} className="stroke-mutant" strokeWidth={1.5} strokeLinecap="round" />
      {Array.from({ length: guardioes }, (_, i) => (
        <Guardiao key={i} indice={i} x={baseGuardiao(i)} chao={CHAO} />
      ))}
      <Mutante x={ORIGEM_MUTANTE.x} y={ORIGEM_MUTANTE.y} />
    </svg>
  );
}
