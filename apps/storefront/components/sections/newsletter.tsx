"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useState } from "react";
import { NewsletterConsent } from "@/components/sections/newsletter-consent";

export function Newsletter() {
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "pending" | "done">("idle");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("pending");
    // UI only: simulate the request. Wire this to the backend later.
    setTimeout(() => setStatus("done"), 600);
  };

  return (
    <section className="overflow-hidden bg-brand text-brand-foreground">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          {status === "done" ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-brand-foreground/10">
                <CheckIcon className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">You&apos;re on the list</h2>
              <p className="mt-3 text-brand-muted">Thanks for subscribing — watch your inbox for 10% off your first order.</p>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl">Get 10% off your first order</h2>
              <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-brand-muted">
                Join our newsletter for new arrivals, exclusive deals and members-only offers.
              </p>
              <form onSubmit={onSubmit} className="mx-auto mt-10 flex max-w-md flex-col gap-4">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    required
                    className="h-12 w-full flex-1 rounded-full border border-brand-foreground/20 bg-brand-foreground/10 px-5 text-brand-foreground outline-none transition-all placeholder:text-brand-foreground/50 focus:border-brand-foreground/50 focus:ring-2 focus:ring-brand-foreground/15"
                  />
                  <button
                    type="submit"
                    disabled={status === "pending" || !consent}
                    className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-cta text-cta-foreground hover:bg-cta-hover px-8 font-semibold transition-all disabled:opacity-50"
                  >
                    {status === "pending" ? "Subscribing…" : "Subscribe"}
                    {status !== "pending" && <ArrowRightIcon className="h-4 w-4" />}
                  </button>
                </div>
                <NewsletterConsent checked={consent} onCheckedChange={setConsent} disabled={status === "pending"} />
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
