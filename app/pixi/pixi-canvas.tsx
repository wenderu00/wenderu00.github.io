"use client";

import { useEffect, useRef } from "react";
import type * as Pixi from "pixi.js";

export type SceneContext<Options> = {
  app: Pixi.Application;
  PIXI: typeof Pixi;
  host: HTMLElement;
  reduced: boolean;
  options: Options;
};

export type Scene<Options = void, Api = void> = (context: SceneContext<Options>) => { api: Api; destroy: () => void };

type Props<Options, Api> = {
  load: () => Promise<{ default: Scene<Options, Api> }>;
  options: Options;
  className?: string;
  allowReducedMotion?: boolean;
  onReady?: (api: Api) => void;
};

const idle = (callback: () => void) =>
  "requestIdleCallback" in window ? requestIdleCallback(callback, { timeout: 800 }) : setTimeout(callback, 200);

export function PixiCanvas<Options, Api>({ load, options, className, allowReducedMotion, onReady }: Props<Options, Api>) {
  const ref = useRef<HTMLDivElement>(null);
  const latest = useRef({ load, options, onReady });

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced && !allowReducedMotion) return;

    let cancelled = false;
    let teardown = () => {};

    idle(async () => {
      if (cancelled) return;
      const { load, options, onReady } = latest.current;
      const [PIXI, { default: scene }] = await Promise.all([import("pixi.js"), load()]);
      const app = new PIXI.Application();
      try {
        await app.init({
          backgroundAlpha: 0,
          antialias: true,
          autoDensity: true,
          resolution: Math.min(devicePixelRatio, 2),
          resizeTo: container,
          preference: ["webgl", "canvas"],
        });
      } catch {
        return;
      }
      if (cancelled) {
        app.destroy(true, true);
        return;
      }

      app.canvas.style.display = "block";
      container.appendChild(app.canvas);
      const running = scene({ app, PIXI, host: container, reduced, options });

      let onScreen = true;
      const sync = () => (onScreen && !document.hidden ? app.ticker.start() : app.ticker.stop());
      const observer = new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      });
      observer.observe(container);
      document.addEventListener("visibilitychange", sync);

      teardown = () => {
        observer.disconnect();
        document.removeEventListener("visibilitychange", sync);
        running.destroy();
        app.destroy(true, true);
      };
      onReady?.(running.api);
    });

    return () => {
      cancelled = true;
      teardown();
    };
  }, [allowReducedMotion]);

  return <div ref={ref} aria-hidden="true" data-pixi className={className} />;
}
