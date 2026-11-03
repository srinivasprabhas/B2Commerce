import { cn } from "@/lib/utils";

const METHODS = ["Visa", "Mastercard", "Amex", "Apple Pay", "Google Pay"];

/** Accepted payment methods as simple text badges. Swap for brand SVGs when you have them. */
export function PaymentMethods({ className }: { className?: string }) {
  return (
    <ul aria-label="Payment methods" className={cn("flex flex-wrap items-center gap-2", className)}>
      {METHODS.map((method) => (
        <li
          key={method}
          className="flex h-6 items-center rounded border border-border bg-background px-2 text-[10px] font-semibold tracking-wide text-muted-foreground"
        >
          {method}
        </li>
      ))}
    </ul>
  );
}
