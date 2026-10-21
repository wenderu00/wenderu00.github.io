"use client";

import { useState } from "react";
import { PixiCanvas } from "./pixi/pixi-canvas";

const loadHunt = () => import("./pixi/mutant-hunt");

export function MutantHunt() {
  const [score, setScore] = useState<{ killed: number; spawned: number } | null>(null);
  const [options] = useState(() => ({ onScore: (killed: number, spawned: number) => setScore({ killed, spawned }) }));

  return (
    <>
      <PixiCanvas load={loadHunt} options={options} className="fixed inset-0 -z-10" />
      {score && (
        <p data-score={score.killed} className="font-mono text-sm text-ink-muted">
          {"// enquanto isso, mate os mutantes: "}
          <span className="text-accent">
            {`mutation score ${score.spawned ? Math.round((score.killed / score.spawned) * 100) : 0}%`}
          </span>
        </p>
      )}
    </>
  );
}
