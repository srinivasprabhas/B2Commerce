"use client";

import { Button } from "@b2c/ui/components/button";
import { cn } from "@b2c/ui/lib/utils";
import { Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function VariantPicker({ colors, sizes }: { colors: { value: string; swatch?: string }[]; sizes: string[] }) {
  const [color, setColor] = useState(colors[0]?.value);
  const [size, setSize] = useState(sizes[0]);

  return (
    <>
      {(colors.length > 0 || sizes.length > 0) && (
        <div className="grid gap-8 sm:grid-cols-2">
          {colors.length > 0 && (
            <div className="space-y-3">
              <div className="font-semibold">Colors:</div>
              <div role="radiogroup" aria-label="Colors" className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    role="radio"
                    aria-checked={color === c.value}
                    title={c.value}
                    onClick={() => setColor(c.value)}
                    className={cn(
                      "size-8 rounded-full border-2 border-muted transition-shadow",
                      color === c.value && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                    )}
                    style={{ background: c.swatch ?? "var(--muted)" }}
                  >
                    <span className="sr-only">{c.value}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {sizes.length > 0 && (
            <div className="space-y-3">
              <div className="font-semibold">Sizes:</div>
              <div role="radiogroup" aria-label="Sizes" className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    role="radio"
                    aria-checked={size === s}
                    onClick={() => setSize(s)}
                    className={cn(
                      "flex h-10 min-w-10 items-center justify-center rounded-md border px-2.5 text-xs font-medium transition-colors hover:bg-muted",
                      size === s && "border-primary bg-primary text-primary-foreground hover:bg-primary",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      <div className="flex gap-3">
        <Button size="sm" onClick={() => toast.success("Added to cart")}>
          <ShoppingCart />
          Add to Cart
        </Button>
        <Button variant="outline" size="sm" onClick={() => toast.success("Added to wishlist")}>
          <Heart />
          Wishlist
        </Button>
      </div>
    </>
  );
}
