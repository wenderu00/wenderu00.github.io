"use client";

import { AnimatePresence, motion } from "motion/react";
import type { Cena } from "./logica";

const linhas = [70, 120, 170];

const spring = { type: "spring", stiffness: 160, damping: 18 } as const;

// Where each guardian stands in each phase of the round.
function posGuardiao(cena: Cena, i: number) {
  switch (cena.estado) {
    case "correndo":
      return { x: 150, y: linhas[i] };
    case "pegou":
      return { x: 205, y: 120 + (i - 1) * 26 };
    case "comemorando":
      return { x: 205, y: 120 + (i - 1) * 26 };
    case "escapou":
      return { x: 175, y: linhas[i] };
    default:
      return { x: 60, y: linhas[i] };
  }
}

function posMutante(cena: Cena) {
  if (cena.estado === "escapou") return { x: 360, y: 120, scale: 1, opacity: 1 };
  if (cena.estado === "pegou" || cena.estado === "comemorando") return { x: 245, y: 120, scale: 0, opacity: 0 };
  return { x: 265, y: 120, scale: 1, opacity: 1 };
}

function Guardiao({ cena, i }: { cena: Cena; i: number }) {
  const { x, y } = posGuardiao(cena, i);
  const pulando = cena.estado === "comemorando";
  const confuso = cena.estado === "escapou";
  return (
    <motion.g initial={false} animate={{ x, y }} transition={{ ...spring, delay: i * 0.06 }}>
      <motion.g
        animate={
          pulando ? { y: [0, -14, 0] } : confuso ? { rotate: [0, -12, 12, 0] } : { y: 0, rotate: 0 }
        }
        transition={pulando || confuso ? { duration: 0.6, repeat: Infinity, delay: i * 0.1 } : { duration: 0.2 }}
      >
        <path
          d="M0 -20l16 7v10c0 10-7 16-16 19-9-3-16-9-16-19v-10z"
          fill="#111111"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M-7 -1l5 5 9-10" fill="none" stroke="#ece41f" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <text x="-22" y="4" textAnchor="end" className="fill-ink-muted font-mono text-[10px]">{`t${i + 1}`}</text>
        <AnimatePresence>
          {confuso && (
            <motion.text
              initial={{ opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: -30 }}
              exit={{ opacity: 0 }}
              textAnchor="middle"
              className="fill-accent font-display text-[18px] font-bold"
            >
              ?
            </motion.text>
          )}
        </AnimatePresence>
      </motion.g>
    </motion.g>
  );
}

export function CenaSvg({ cena }: { cena: Cena }) {
  const mutante = posMutante(cena);
  return (
    <svg viewBox="0 0 320 240" aria-hidden="true" data-cena="svg" className="absolute inset-0 size-full">
      <line x1="16" y1="222" x2="304" y2="222" stroke="#262626" />
      <AnimatePresence>
        {cena.mutanteAtivo && (
          <motion.g
            key={cena.rodada}
            initial={{ x: 340, y: 120, scale: 1, opacity: 0 }}
            animate={mutante}
            exit={{ opacity: 0 }}
            transition={cena.estado === "escapou" ? { duration: 0.9, ease: "easeIn" } : { duration: 0.5, ease: "easeOut" }}
          >
            <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 0.25, repeat: Infinity }}>
              {[-7, 0, 7].map((at) => (
                <path key={at} d={`M${at} 0l-3 -12M${at} 0l-3 12`} stroke="#ece41f" strokeWidth="1.6" strokeLinecap="round" />
              ))}
              <ellipse rx="13" ry="9" fill="#ece41f" />
              <circle cx="12" r="5" fill="#ece41f" />
              <circle cx="14" cy="-2" r="1.4" fill="#000000" />
              <path d="M15 -4l6 -6M15 4l6 6" stroke="#ece41f" strokeWidth="1.5" strokeLinecap="round" />
            </motion.g>
          </motion.g>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {cena.estado === "pegou" && (
          <motion.circle
            key={`boom-${cena.rodada}`}
            cx="245"
            cy="120"
            initial={{ r: 4, opacity: 1 }}
            animate={{ r: 46, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            fill="none"
            stroke="#ece41f"
            strokeWidth="2"
          />
        )}
      </AnimatePresence>
      {linhas.slice(0, cena.quantidadeGuardioes).map((_, i) => (
        <Guardiao key={i} cena={cena} i={i} />
      ))}
    </svg>
  );
}
