"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { NewsletterConsent } from "@/components/sections/newsletter-consent";

/** Footer sign-up (UI only — wire to the backend later). */
export function FooterNewsletter() {
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "pending" | "done">("idle");

  if (status === "done") {
    return <p className="text-lg font-medium">You&apos;re on the list — watch your inbox for 10% off your first order.</p>;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setStatus("pending");
        setTimeout(() => setStatus("done"), 600);
      }}
      className="max-w-[560px]"
    >
      <div className="relative">
        <label htmlFor="footer-email" className="sr-only">
          Email
        </label>
        <input
          id="footer-email"
          type="email"
          name="email"
          required
          placeholder="Email"
          className="h-[66px] w-full rounded-full bg-secondary pr-[70px] pl-6 text-[17px] outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          aria-label="Subscribe"
          disabled={!consent || status === "pending"}
          className="absolute top-2 right-2 grid size-[50px] place-items-center rounded-full transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-current"
        >
          <ArrowRight className="size-5" />
        </button>
      </div>
      <NewsletterConsent checked={consent} onCheckedChange={setConsent} disabled={status === "pending"} className="mt-4 text-muted-foreground" />
    </form>
  );
}
