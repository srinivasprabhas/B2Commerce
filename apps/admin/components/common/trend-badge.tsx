import { Badge } from "@b2c/ui/components/badge";
import { cn } from "@b2c/ui/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";

/** Green "up" / red "down" percentage badge used across stat cards. */
export function TrendBadge({ value, direction = "up" }: { value: string; direction?: "up" | "down" }) {
  return (
    <Badge
      variant={direction === "up" ? "outline" : "destructive"}
      className={cn(
        direction === "up" && "border-green-400 bg-green-50 text-green-800 dark:bg-green-900/70 dark:text-white/80",
      )}
    >
      {direction === "up" ? <ArrowUp /> : <ArrowDown />}
      {value}
    </Badge>
  );
}
