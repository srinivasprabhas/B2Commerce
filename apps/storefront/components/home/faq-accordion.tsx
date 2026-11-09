"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/** Rounded-card FAQ: one item open at a time. */
export function FaqAccordion({ items }: { items: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="grid gap-5">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.question} className={cn("rounded-[20px] border transition-colors", isOpen ? "border-background bg-background" : "border-[#d3d8e0]")}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-6 text-left text-lg font-medium tracking-[-0.015em] sm:px-8 sm:py-7 sm:text-[21px]"
            >
              {it.question}
              <span aria-hidden className="relative size-5 shrink-0">
                <span className="absolute inset-x-0 top-[9px] h-0.5 bg-current" />
                <span className={cn("absolute inset-x-0 top-[9px] h-0.5 bg-current transition-transform duration-300", isOpen ? "rotate-0" : "rotate-90")} />
              </span>
            </button>
            <div className={cn("grid transition-[grid-template-rows] duration-400", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
              <div className="overflow-hidden">
                <p className="mx-6 mb-7 border-t border-border pt-6 text-[17px] sm:mx-8">{it.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
