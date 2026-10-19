"use client";

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
      <ul
        id="menu-secoes"
        className={`${open ? "flex" : "hidden"} absolute inset-x-0 top-full flex-col border-b border-line bg-ground px-3 py-2 md:static md:flex md:flex-row md:gap-1 md:border-0 md:p-0`}
      >
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? "true" : undefined}
              onClick={() => setOpen(false)}
              className="block p-3 font-mono text-sm text-ink-muted no-underline transition-colors duration-200 hover:text-accent aria-[current=true]:text-accent"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
