import { Badge } from "@b2c/ui/components/badge";
import { cn } from "@b2c/ui/lib/utils";

const tone = {
  green: "border-green-400 bg-green-50 text-green-800 dark:bg-green-900/70 dark:text-white/80",
  blue: "border-blue-400 bg-blue-50 text-blue-800 dark:bg-blue-900/70 dark:text-white/80",
  orange: "border-orange-400 bg-orange-50 text-orange-800 dark:bg-orange-900/70 dark:text-white/80",
  red: "border-red-400 bg-red-50 text-red-800 dark:bg-red-900/70 dark:text-white/80",
  gray: "border-border bg-muted text-muted-foreground",
} as const;

const statusTone: Record<string, keyof typeof tone> = {
  // product
  Active: "green",
  "Low stock": "orange",
  "Out of stock": "red",
  // order fulfilment
  Delivered: "green",
  Pending: "orange",
  Shipped: "blue",
  Cancelled: "red",
  // payment
  paid: "green",
  success: "green",
  processing: "blue",
  failed: "red",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <Badge variant="outline" className={cn(tone[statusTone[status] ?? "gray"], className)}>
      {status}
    </Badge>
  );
}
