"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { createContext, type ReactNode, useContext, useRef } from "react";
import { cn } from "@/lib/utils";

type Ctx = { scroll: (dir: 1 | -1) => void; trackRef: React.RefObject<HTMLDivElement | null> };
const SliderContext = createContext<Ctx | null>(null);

/** Groups a scroll-snap track with arrow buttons that can live anywhere inside it. */
export function Slider({ children, className }: { children: ReactNode; className?: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const gap = Number.parseFloat(getComputedStyle(el).columnGap || "0");
    el.scrollBy({ left: dir * (first ? first.getBoundingClientRect().width + gap : el.clientWidth), behavior: "smooth" });
  };
  return (
    <SliderContext.Provider value={{ scroll, trackRef }}>
      <div className={className}>{children}</div>
    </SliderContext.Provider>
  );
}

export function SliderTrack({ children, className }: { children: ReactNode; className?: string }) {
  const ctx = useContext(SliderContext);
  return (
    <div
      ref={ctx?.trackRef}
      className={cn(
        "grid snap-x snap-mandatory auto-cols-[85%] grid-flow-col gap-4 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>*]:snap-start",
        className,
      )}
    >
      {children}
    </div>
  );
}

const arrowClass =
  "grid size-12 place-items-center rounded-full border border-[#c9ced8] transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground sm:size-14";

export function SliderArrows({ className }: { className?: string }) {
  const ctx = useContext(SliderContext);
  return (
    <div className={cn("flex shrink-0 gap-3.5", className)}>
      <button type="button" aria-label="Previous" className={arrowClass} onClick={() => ctx?.scroll(-1)}>
        <ChevronLeft className="size-[18px]" />
      </button>
      <button type="button" aria-label="Next" className={arrowClass} onClick={() => ctx?.scroll(1)}>
        <ChevronRight className="size-[18px]" />
      </button>
    </div>
  );
}
