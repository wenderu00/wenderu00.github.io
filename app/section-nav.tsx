"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const items = [
  { id: "quem-sou", label: "01 Quem sou eu" },
  { id: "o-que-faco", label: "02 O que faço" },
  { id: "stack", label: "03 Stack" },
  { id: "trabalhos", label: "04 Trabalhos" },
];

export function SectionNav() {
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    for (const item of items) {
      const section = document.getElementById(item.id);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <nav aria-label="Seções">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="menu-secoes"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        onClick={() => setOpen(!open)}
        className="inline-flex size-11 items-center justify-center text-ink transition-colors duration-200 hover:text-accent md:hidden"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      <ul className="hidden md:flex md:flex-row md:gap-1">
        <Links active={active} indicator="nav-indicator" />
      </ul>
      <AnimatePresence>
        {open && (
          <motion.ul
            id="menu-secoes"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute inset-x-0 top-full flex flex-col border-b border-line bg-ground px-3 py-2 md:hidden"
          >
            <Links active={active} indicator="nav-indicator-mobile" onNavigate={() => setOpen(false)} />
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Links({ active, indicator, onNavigate }: { active: string | null; indicator: string; onNavigate?: () => void }) {
  return items.map((item) => (
    <li key={item.id}>
      <a
        href={`#${item.id}`}
        aria-current={active === item.id ? "true" : undefined}
        onClick={onNavigate}
        className="relative block p-3 font-mono text-sm text-ink-muted no-underline transition-colors duration-200 hover:text-accent aria-[current=true]:text-accent"
      >
        {item.label}
        {active === item.id && (
          <motion.span
            layoutId={indicator}
            data-nav-indicator
            aria-hidden="true"
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="absolute inset-x-3 bottom-1.5 h-0.5 bg-accent"
          />
        )}
      </a>
    </li>
  ));
}
