"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type CartLine, useCart } from "@/app/(checkout)/cart/cart-context";
import { formatMoney } from "@/lib/money";

export function CartItem({ item }: { item: CartLine }) {
  const { setQuantity, removeItem, closeCart } = useCart();
  const atMax = item.stock !== null && item.quantity >= item.stock;

  return (
    <div className="flex gap-3 py-4">
      <Link
        href={`/product/${item.productSlug}`}
        onClick={closeCart}
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-secondary"
      >
        {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 space-y-1">
            <Link
              href={`/product/${item.productSlug}`}
              onClick={closeCart}
              className="line-clamp-2 text-sm font-medium leading-tight text-foreground hover:underline"
            >
              {item.name}
            </Link>
            {item.options && <p className="text-xs text-muted-foreground">{item.options}</p>}
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.variantId)}
            className="shrink-0 p-1 text-muted-foreground transition-colors hover:text-destructive"
            aria-label="Remove item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="inline-flex items-center rounded-full border border-border">
            <button
              type="button"
              onClick={() => setQuantity(item.variantId, item.quantity - 1)}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-l-full transition-colors hover:bg-secondary"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="flex h-7 w-8 items-center justify-center text-sm tabular-nums">{item.quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(item.variantId, item.quantity + 1)}
              disabled={atMax}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-r-full transition-colors hover:bg-secondary disabled:opacity-40"
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <span className="text-sm font-semibold">{formatMoney(item.price * item.quantity)}</span>
        </div>
      </div>
    </div>
  );
}
