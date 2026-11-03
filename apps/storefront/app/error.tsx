"use client";

import { RouteErrorFallback } from "@/components/common/route-error";

export default function RootError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <RouteErrorFallback
      title="Something went wrong"
      description="An unexpected error occurred. Please try again or return to the store."
      error={error}
      reset={reset}
    />
  );
}
