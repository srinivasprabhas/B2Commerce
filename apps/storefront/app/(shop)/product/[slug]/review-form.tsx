"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function WriteReview() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="rounded-lg border border-border bg-secondary/30 p-6 text-center">
        <p className="font-medium">Thanks for your review!</p>
        <p className="mt-1 text-sm text-muted-foreground">It will appear here once it has been approved.</p>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 items-center justify-center rounded-full border border-border px-6 text-sm font-medium transition-colors hover:bg-secondary"
      >
        Write a review
      </button>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (rating > 0) setSent(true);
      }}
      className="space-y-4 rounded-lg border border-border p-6"
    >
      <h3 className="text-lg font-medium">Write a review</h3>
      <div>
        <span className="mb-2 block text-sm font-medium">Rating</span>
        <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              aria-label={`${value} star${value > 1 ? "s" : ""}`}
              onMouseEnter={() => setHover(value)}
              onClick={() => setRating(value)}
            >
              <Star
                className={cn(
                  "h-6 w-6 transition-colors",
                  value <= (hover || rating) ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted",
                )}
              />
            </button>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="review-name" className="mb-2 block text-sm font-medium">
          Name
        </label>
        <input
          id="review-name"
          required
          className="h-11 w-full rounded-lg border border-border bg-background px-4 outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
        />
      </div>
      <div>
        <label htmlFor="review-content" className="mb-2 block text-sm font-medium">
          Review
        </label>
        <textarea
          id="review-content"
          required
          rows={4}
          className="w-full rounded-lg border border-border bg-background px-4 py-3 outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10"
        />
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={rating === 0}
          className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
        >
          Submit review
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-foreground">
          Cancel
        </button>
      </div>
    </form>
  );
}
