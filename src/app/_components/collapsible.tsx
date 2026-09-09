"use client";

import { useState } from "react";

interface CollapsibleProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

/** Rozsuwana sekcja (akordeon) w stylu cozy. */
export function Collapsible({ title, defaultOpen = true, children }: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="overflow-hidden rounded-lg border border-linen bg-panel">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-3 py-2.5 text-left transition-colors hover:bg-ecru/60"
      >
        <span className="text-xs font-semibold tracking-wide text-mocha uppercase">
          {title}
        </span>
        <span
          className={`text-mocha transition-transform duration-200 ${open ? "rotate-0" : "-rotate-90"}`}
        >
          ▾
        </span>
      </button>
      {open && <div className="flex flex-col gap-4 px-3 pt-1 pb-3">{children}</div>}
    </section>
  );
}
