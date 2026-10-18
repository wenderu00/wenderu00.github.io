"use client";

import { useEffect, useState } from "react";

const items = [
  { id: "quem-sou", label: "01 Quem sou eu" },
  { id: "o-que-faco", label: "02 O que faço" },
  { id: "trabalhos", label: "03 Trabalhos" },
];

export function SectionNav() {
  const [active, setActive] = useState<string | null>(null);

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

  return (
    <nav aria-label="Seções" className="flex flex-wrap gap-1">
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          aria-current={active === item.id ? "true" : undefined}
          className="p-3 font-mono text-sm text-ink-muted no-underline transition-colors duration-200 hover:text-accent aria-[current=true]:text-accent"
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
