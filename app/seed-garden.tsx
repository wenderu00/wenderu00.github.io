"use client";

import { useState } from "react";
import { PixiCanvas } from "./pixi/pixi-canvas";
import type { GardenApi } from "./pixi/seed-garden";

const loadGarden = () => import("./pixi/seed-garden");

export function SeedGarden() {
  const [garden, setGarden] = useState<GardenApi | null>(null);
  const [count, setCount] = useState(0);
  const [options] = useState(() => ({ onPlant: setCount }));

  return (
    <figure className="flex flex-col gap-4 rounded-[10px] border border-line bg-surface p-5 sm:p-7">
      <figcaption className="flex flex-wrap items-center justify-between gap-3 font-mono text-[13px] text-ink-muted">
        <span>{"// semeadura: cada artefato continua gerando valor"}</span>
        {garden && (
          <span className="flex items-center gap-3">
            <span aria-live="polite">{`${count} semeados`}</span>
            <button
              type="button"
              onClick={() => garden.plant()}
              className="inline-flex min-h-11 items-center rounded-md border border-line-strong bg-ground px-4 text-ink transition-colors duration-200 hover:border-accent hover:text-accent"
            >
              Semear
            </button>
          </span>
        )}
      </figcaption>
      <div className="relative h-[240px]">
        {!garden && (
          <p className="absolute inset-0 flex items-center justify-center font-mono text-sm text-ink-muted">
            testes · guias · pipelines · geradores
          </p>
        )}
        <PixiCanvas
          load={loadGarden}
          options={options}
          allowReducedMotion
          onReady={setGarden}
          className="absolute inset-0 cursor-crosshair"
        />
      </div>
    </figure>
  );
}
