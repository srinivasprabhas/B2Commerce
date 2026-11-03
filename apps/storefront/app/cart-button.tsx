"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/app/(checkout)/cart/cart-context";

export function CartButton() {
  const { itemCount, openCart } = useCart();
  return (
    <button
      type="button"
      onClick={openCart}
      className="relative rounded-full p-2 transition-colors hover:bg-secondary"
      aria-label="Shopping cart"
    >
      <ShoppingCart className="h-6 w-6" />
      {itemCount > 0 && (
        <span
          aria-live="polite"
          className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-cta text-xs font-semibold text-cta-foreground"
        >
          {itemCount}
        </span>
      )}
    </button>
  );
}
