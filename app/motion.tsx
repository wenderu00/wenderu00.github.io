"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { PixiCanvas } from "./pixi/pixi-canvas";

const ease = [0.2, 0.7, 0.2, 1] as const;

const steps = ["Requisito", "Teste BDD", "Código", "Deploy"];

const glyphs = "01<>/{}[]#$*+=_";

const loadHeroField = () => import("./pixi/hero-field");

const fromMouse = (event: PointerEvent) => event.pointerType === "mouse";

export function HeroBackdrop() {
  const [live, setLive] = useState(false);
  return (
    <>
      <div
        aria-hidden="true"
        data-live={live || undefined}
        className="hero-backdrop pointer-events-none absolute inset-0 -z-10 transition-opacity duration-700 data-live:opacity-0"
      />
      <PixiCanvas
        load={loadHeroField}
        options={undefined}
        onReady={() => setLive(true)}
        className="hero-field pointer-events-none absolute inset-0 -z-10"
      />
    </>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 220, damping: 30, restDelta: 0.001 });
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: reduce ? scrollYProgress : smooth }}
      className="scroll-progress absolute inset-x-0 bottom-0 h-0.5 origin-left bg-accent"
    />
  );
}

export function Reveal({
  as = "div",
  index = 0,
  tilt,
  className,
  children,
}: {
  as?: "div" | "article";
  index?: number;
  tilt?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const Tag = motion[as];
  const rotateX = useSpring(0, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 200, damping: 20 });

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!tilt || !fromMouse(event)) return;
    const rect = event.currentTarget.getBoundingClientRect();
    rotateY.set(((event.clientX - rect.left) / rect.width - 0.5) * 6);
    rotateX.set(((event.clientY - rect.top) / rect.height - 0.5) * -6);
  };
  const onPointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <Tag
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.6, ease, delay: index * 0.08 }}
      style={tilt ? { rotateX, rotateY, transformPerspective: 900 } : undefined}
      onPointerMove={tilt ? onPointerMove : undefined}
      onPointerLeave={tilt ? onPointerLeave : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}

export function TitleLine() {
  return (
    <motion.span
      aria-hidden="true"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease, delay: 0.2 }}
      className="title-line h-px flex-1 origin-left bg-line"
    />
  );
}

export function ScrambleHeading({ text, className }: { text: string; className?: string }) {
  const [shown, setShown] = useState(text);
  const frame = useRef(0);
  const reduce = useReducedMotion();

  const scramble = () => {
    if (reduce) return;
    cancelAnimationFrame(frame.current);
    const start = performance.now();
    const duration = 900;
    const step = (now: number) => {
      const done = Math.min(1, (now - start) / duration);
      const settled = Math.floor(done * text.length);
      setShown(
        [...text]
          .map((char, i) =>
            i < settled || char === " " ? char : glyphs[Math.floor(Math.random() * glyphs.length)],
          )
          .join(""),
      );
      if (done < 1) frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    const timer = setTimeout(scramble, 250);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <h1 aria-label={text} onPointerEnter={(event) => fromMouse(event) && scramble()} className={className}>
      {shown}
    </h1>
  );
}

export function Magnetic({ children }: { children: ReactNode }) {
  const x = useSpring(0, { stiffness: 260, damping: 18 });
  const y = useSpring(0, { stiffness: 260, damping: 18 });
  return (
    <motion.span
      style={{ x, y }}
      onPointerMove={(event) => {
        if (!fromMouse(event)) return;
        const rect = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - rect.left - rect.width / 2) * 0.3);
        y.set((event.clientY - rect.top - rect.height / 2) * 0.4);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className="inline-flex"
    >
      {children}
    </motion.span>
  );
}

export function Pipeline() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-15% 0px" });
  const reduce = useReducedMotion();
  const [tick, setTick] = useState(-1);

  useEffect(() => {
    if (!inView || reduce) return;
    const timer = setInterval(() => setTick((t) => t + 1), 900);
    return () => clearInterval(timer);
  }, [inView, reduce]);

  // one extra beat at the end keeps "Deploy" lit before the loop restarts
  const active = tick < 0 ? -1 : tick % (steps.length + 1);

  return (
    <figure ref={ref} className="flex flex-col gap-5 rounded-[10px] border border-line bg-surface p-7">
      <figcaption className="flex flex-wrap justify-between gap-2 font-mono text-[13px] text-ink-muted">
        <span>{"// do pedido ao deploy"}</span>
        <AnimatePresence>
          {active === steps.length && (
            <motion.span
              key={tick}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-accent"
            >
              ✓ em produção
            </motion.span>
          )}
        </AnimatePresence>
      </figcaption>
      <ol className="flex flex-col items-stretch sm:flex-row sm:items-center">
        {steps.map((step, i) => {
          const lit = active === i || (active === steps.length && i === steps.length - 1);
          return (
            <li key={step} className="flex flex-col items-center sm:flex-row sm:not-last:flex-1">
              <motion.span
                data-active={lit || undefined}
                animate={
                  lit
                    ? { borderColor: "#ece41f", color: "#ffffff", boxShadow: "0 0 24px -4px #ece41f" }
                    : { borderColor: "#3a3a3a", color: "#d4d4d4", boxShadow: "0 0 0px 0px rgba(0,0,0,0)" }
                }
                transition={{ duration: 0.3 }}
                className="pipeline-node w-full rounded-md border border-line-strong px-4 py-3 text-center font-mono text-sm text-ink-soft sm:w-auto sm:flex-none"
              >
                {step}
              </motion.span>
              {i < steps.length - 1 && (
                <span aria-hidden="true" className="relative h-8 w-0.5 bg-line sm:h-0.5 sm:w-auto sm:flex-1">
                  {active === i && (
                    <motion.span
                      key={tick}
                      initial={{ top: "0%", left: "0%", opacity: 0 }}
                      animate={{ top: "100%", left: "100%", opacity: [0, 1, 1, 0] }}
                      transition={{ duration: 0.85, ease: "easeInOut" }}
                      className="pipeline-packet absolute size-2.5 rounded-full bg-accent"
                    />
                  )}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </figure>
  );
}

export function Marquee({ items }: { items: string[] }) {
  const row = (
    <ul className="flex shrink-0 gap-3 pr-3">
      {items.map((item) => (
        <li key={item} className="rounded-full border border-line-strong px-4 py-2 whitespace-nowrap">
          {item}
        </li>
      ))}
    </ul>
  );
  return (
    <div
      aria-hidden="true"
      className="marquee overflow-hidden font-mono text-sm text-ink-muted [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]"
    >
      <div className="marquee-track flex w-max">
        {row}
        {row}
      </div>
    </div>
  );
}
