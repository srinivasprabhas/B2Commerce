import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand text-brand-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-16 sm:py-20 lg:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-medium tracking-tight sm:text-5xl lg:text-6xl">
              Headphones, bags and homeware we'd buy ourselves
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-brand-muted sm:text-xl">
              A small, tested range from independent makers — free shipping over $75 and 30-day returns on everything.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="#products"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-cta text-cta-foreground hover:bg-cta-hover px-8 text-base font-semibold shadow-sm transition-colors"
              >
                Shop Now
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                href="#about"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-brand-foreground/30 px-8 text-base font-medium transition-colors hover:bg-brand-foreground/10"
              >
                Why Shop With Us
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-0 hidden h-full w-1/3 -translate-y-1/2 bg-linear-to-l from-primary/40 to-transparent dark:from-primary/15 lg:block"
      />
    </section>
  );
}
