"use client";

import { AlertCircleIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export function RouteErrorFallback({
  title,
  description,
  error,
  reset,
}: {
  title: string;
  description: string;
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center px-4 py-24 text-center">
      <AlertCircleIcon className="size-16 text-muted-foreground/50" strokeWidth={1.5} />
      <h1 className="mt-6 text-2xl font-medium tracking-tight">{title}</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      <div className="mt-8 flex items-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="inline-flex items-center rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
