"use client";

import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { useState } from "react";

const fieldClass =
  "mt-2 w-full rounded-lg border border-border bg-background px-4 text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "pending" | "sent">("idle");

  if (status === "sent") {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 rounded-lg border border-border bg-secondary/30 p-8 text-center duration-500">
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-foreground/5">
          <CheckIcon className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-medium tracking-tight">Message sent</h2>
        <p className="mt-2 text-muted-foreground">Thanks for reaching out — we&apos;ll reply within one business day.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setStatus("pending");
        setTimeout(() => setStatus("sent"), 600);
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="block text-sm font-medium">
            Name
          </label>
          <input id="contact-name" name="name" required placeholder="Your name" className={`h-12 ${fieldClass}`} />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium">
            Email
          </label>
          <input id="contact-email" type="email" name="email" required placeholder="your@email.com" className={`h-12 ${fieldClass}`} />
        </div>
      </div>
      <div>
        <label htmlFor="contact-order" className="block text-sm font-medium">
          Order number <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <input id="contact-order" name="order" placeholder="e.g. B2C-10234" className={`h-12 ${fieldClass}`} />
      </div>
      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium">
          Message
        </label>
        <textarea id="contact-message" name="message" required rows={6} placeholder="How can we help?" className={`py-3 ${fieldClass}`} />
      </div>
      <button
        type="submit"
        disabled={status === "pending"}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-8 font-medium text-background transition-all hover:bg-foreground/90 disabled:opacity-50"
      >
        {status === "pending" ? "Sending…" : "Send message"}
        {status !== "pending" && <ArrowRightIcon className="h-4 w-4" />}
      </button>
    </form>
  );
}
