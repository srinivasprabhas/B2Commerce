import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const rounded = Math.round(rating);
  return (
    <span className="flex gap-0.5" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            size === "lg" ? "h-5 w-5" : "h-4 w-4",
            i < rounded ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted",
          )}
        />
      ))}
    </span>
  );
}
