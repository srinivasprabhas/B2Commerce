"use client";

import Image from "next/image";
import Link from "next/link";
import { type CSSProperties, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Slide = {
  image: string;
  alt: string;
  /** Backdrop colour sampled from the photo, so photo + slide read as one frame. */
  bg: string;
  dark: boolean;
  eyebrow: string;
  title: string[];
  href: string;
  /** "contain" keeps very wide photos whole (e.g. the watch on black). */
  fit?: "cover" | "contain";
  copyWidth?: string;
  mobilePosition: string;
};

const slides: Slide[] = [
  {
    image: "/hero/headphones.jpg",
    alt: "Woman listening to music on wireless headphones",
    bg: "#9c7494",
    dark: true,
    eyebrow: "Fieldtone ANC 700",
    title: ["Hear less.", "Feel more."],
    href: "/product/fieldtone-anc-700-wireless-headphones",
    mobilePosition: "70% center",
  },
  {
    image: "/hero/laptop.jpg",
    alt: "Silver laptop on a light grey background",
    bg: "#c4c4c4",
    dark: false,
    eyebrow: "New Arrivals",
    title: ["Work faster,", "anywhere you are"],
    href: "/collection/new-arrivals",
    mobilePosition: "74% center",
  },
  {
    image: "/hero/watch.jpg",
    alt: "Smartwatch showing heart rate, front and back",
    bg: "#000000",
    dark: true,
    eyebrow: "Wearables",
    title: ["Know your", "heart better"],
    href: "/category/wearables",
    fit: "contain",
    copyWidth: "40%",
    mobilePosition: "80% center",
  },
];

const N = slides.length;
const GAP = 14;
const INTERVAL = 6000;

/** Peeking hero carousel: the active slide is centred with neighbours visible, looping seamlessly. */
export function HeroCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(N); // index into the tripled list; the middle copy is "home"
  const [animate, setAnimate] = useState(false);
  const [width, setWidth] = useState<number | null>(null);
  const [vw, setVw] = useState(0);
  const touchX = useRef<number | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const w = window.innerWidth;
      setVw(w);
      setWidth(Math.min(w * (w < 960 ? 0.9 : 0.7), 1700));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const go = useCallback((to: number) => {
    setAnimate(true);
    setPos(to);
  }, []);

  // autoplay (skipped for people who prefer reduced motion)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => go(pos + 1), INTERVAL);
    return () => window.clearTimeout(t);
  }, [pos, go]);

  // after sliding into a cloned copy, jump back to the matching slide in the middle copy
  const onTransitionEnd = (e: React.TransitionEvent) => {
    if (e.target !== trackRef.current) return;
    if (pos >= 2 * N || pos < N) {
      setAnimate(false);
      setPos(N + ((((pos - N) % N) + N) % N));
    }
  };

  const active = pos % N;
  const offset = width === null ? 0 : (vw - width) / 2 - pos * (width + GAP);
  const all = [...slides, ...slides, ...slides];

  return (
    <section aria-roledescription="carousel" aria-label="Featured" className="overflow-hidden pb-10">
      <div
        ref={trackRef}
        onTransitionEnd={onTransitionEnd}
        onTouchStart={(e) => {
          touchX.current = e.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = (e.changedTouches[0]?.clientX ?? 0) - touchX.current;
          touchX.current = null;
          if (Math.abs(dx) > 50) go(pos + (dx < 0 ? 1 : -1));
        }}
        className={cn("flex touch-pan-y gap-[14px]", animate && "transition-transform duration-[900ms] ease-[cubic-bezier(.22,.7,.2,1)]", width === null && "opacity-0")}
        style={{ transform: `translateX(${offset}px)` }}
      >
        {all.map((s, i) => {
          const isActive = i === pos;
          const isMiddle = i >= N && i < 2 * N;
          return (
            // biome-ignore lint/a11y/useKeyWithClickEvents: neighbours are also reachable via the dots
            <div
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${(i % N) + 1} of ${N}`}
              aria-hidden={!isActive}
              onClick={() => !isActive && go(i)}
              className={cn(
                "hero-slide relative isolate h-[640px] shrink-0 overflow-hidden rounded-[20px] min-[960px]:h-[clamp(520px,44vw,760px)]",
                s.dark ? "text-white" : "text-[#121f37]",
                s.fit === "contain" && "fit-contain",
                !isActive && "cursor-pointer",
              )}
              style={
                {
                  width: width ?? "70vw",
                  background: s.bg,
                  "--sbg": s.bg,
                  "--spos-m": s.mobilePosition,
                  "--scw": s.copyWidth ?? "46%",
                } as CSSProperties
              }
            >
              <Image
                src={s.image}
                alt={isMiddle ? s.alt : ""}
                fill
                priority={i === N}
                sizes="(max-width: 960px) 90vw, 70vw"
                className={cn(
                  "hero-img -z-20 object-right transition-transform duration-[6000ms] ease-linear",
                  s.fit === "contain" ? "object-contain" : "object-cover",
                  isActive ? "scale-100" : "scale-105",
                )}
              />
              <div className="hero-copy absolute flex flex-col items-center justify-center text-center">
                <div key={`${i}-${isActive}`} className={cn("flex flex-col items-center", isActive && "hero-rise")}>
                  <p className="mb-3.5 text-lg font-medium tracking-[-0.01em] min-[960px]:mb-6">{s.eyebrow}</p>
                  <h2 className="mb-6 text-[40px] leading-[1.12] font-medium tracking-[-0.055em] min-[960px]:mb-10 min-[960px]:text-[clamp(40px,4.6vw,80px)]">
                    {s.title[0]}
                    <br />
                    {s.title[1]}
                  </h2>
                  <Link
                    href={s.href}
                    tabIndex={isActive ? 0 : -1}
                    className={cn(
                      "inline-flex h-14 items-center rounded-full px-12 text-[17px] font-medium transition-colors",
                      s.dark ? "bg-white text-primary hover:bg-[#e9eef6]" : "bg-primary text-primary-foreground hover:bg-primary/90",
                    )}
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div role="tablist" aria-label="Choose slide" className="mt-9 flex justify-center gap-2.5">
        {slides.map((s, i) => (
          <button
            key={s.image}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`Slide ${i + 1}`}
            onClick={() => go(N + i)}
            className={cn(
              "relative h-3 overflow-hidden rounded-full bg-[#d3d7de] transition-[width] duration-500",
              i === active ? "w-[60px]" : "w-3",
            )}
          >
            {i === active && <span key={pos} className="hero-dot-fill absolute inset-0 rounded-full bg-primary" />}
          </button>
        ))}
      </div>
    </section>
  );
}
