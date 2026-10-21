"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useState } from "react";
import { stack } from "./content";

const all = "Tudo";

export function StackFilter() {
  const [selected, setSelected] = useState(all);
  const groups = selected === all ? stack : stack.filter((group) => group.group === selected);

  return (
    <LayoutGroup>
      <div className="flex flex-col gap-6">
        <div role="group" aria-label="Filtrar stack" className="flex flex-wrap gap-2 font-mono text-sm">
          {[all, ...stack.map((group) => group.group)].map((name) => (
            <button
              key={name}
              type="button"
              aria-pressed={selected === name}
              onClick={() => setSelected(name)}
              className="relative isolate min-h-11 rounded-md px-4 text-ink-muted transition-colors duration-200 hover:text-ink aria-pressed:text-ground"
            >
              {selected === name && (
                <motion.span
                  layoutId="stack-chip"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  className="absolute inset-0 -z-10 rounded-md bg-accent"
                />
              )}
              {name}
            </button>
          ))}
        </div>
        <motion.ul layout className="flex flex-wrap items-center gap-2 font-mono text-sm">
          <AnimatePresence mode="popLayout" initial={false}>
            {groups.flatMap((group) => [
              <motion.li
                layout
                key={`${group.group}-label`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-2 pr-1 pl-2 text-accent first:pl-0"
              >
                <h3>{`// ${group.group}`}</h3>
              </motion.li>,
              ...group.items.map((tech) => (
                <motion.li
                  layout
                  key={tech}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  className="rounded-full border border-line-strong px-3.5 py-2"
                >
                  {tech}
                </motion.li>
              )),
            ])}
          </AnimatePresence>
        </motion.ul>
      </div>
    </LayoutGroup>
  );
}
