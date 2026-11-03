"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/app/(checkout)/cart/cart-context";
import { QuantitySelector } from "@/app/(shop)/product/[slug]/quantity-selector";
import { useSelectedVariant } from "@/app/(shop)/product/[slug]/selected-variant";
import { TrustBadges } from "@/app/(shop)/product/[slug]/trust-badges";
import { VariantSelector } from "@/app/(shop)/product/[slug]/variant-selector";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

const LOW_STOCK = 5;

export function AddToCart({
  product,
  summary,
}: {
  product: { slug: string; name: string; image: string | null };
  summary: string;
}) {
  const { variants, selected } = useSelectedVariant();
  const { addItem, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const outOfStock = selected?.stock === 0;
  const maxQty = Math.max(1, Math.min(99, selected?.stock ?? 99));
  const qty = Math.min(quantity, maxQty);

  const prices = variants.map((v) => v.price);
  const [lo, hi] = [Math.min(...prices), Math.max(...prices)];
  const display = selected ? formatMoney(selected.price) : lo === hi ? formatMoney(lo) : `${formatMoney(lo)} - ${formatMoney(hi)}`;
  const compareAt = selected?.compareAtPrice && selected.compareAtPrice > selected.price ? selected.compareAtPrice : null;
  const savePercent = compareAt && selected ? Math.round(((compareAt - selected.price) / compareAt) * 100) : null;

  const stock = !selected
    ? null
    : selected.stock === 0
      ? { label: "Out of stock", tone: "out" }
      : selected.stock !== null && selected.stock <= LOW_STOCK
        ? { label: `Only ${selected.stock} left in stock`, tone: "low" }
        : { label: "In stock", tone: "in" };

  const buttonText = !selected
    ? "Select options"
    : outOfStock
      ? "Out of stock"
      : `Add to Cart — ${formatMoney(selected.price * qty)}`;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || outOfStock) return;
    addItem(
      {
        variantId: selected.id,
        productSlug: product.slug,
        name: product.name,
        image: selected.images[0] ?? product.image,
        price: selected.price,
        options: selected.options.map((o) => o.value).join(" / ") || null,
        stock: selected.stock,
      },
      qty,
    );
    toast.success(`${product.name} added to cart`);
    openCart();
    setQuantity(1);
  };

  return (
    <div className="space-y-8">
      <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{summary}</p>

      <div className="space-y-2">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-3xl font-semibold tracking-tight">{display}</span>
          {compareAt && <span className="text-lg text-muted-foreground line-through">{formatMoney(compareAt)}</span>}
          {savePercent ? (
            <span className="rounded-full bg-cta px-2.5 py-0.5 text-xs font-semibold text-cta-foreground">
              Save {savePercent}%
            </span>
          ) : null}
        </div>
        {selected && stock && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 font-medium",
                stock.tone === "out" && "text-destructive",
                stock.tone === "low" && "text-amber-700 dark:text-amber-500",
                stock.tone === "in" && "text-green-700 dark:text-green-500",
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
              {stock.label}
            </span>
            <span className="text-muted-foreground">
              SKU: <span className="font-medium text-foreground">{selected.sku}</span>
            </span>
          </div>
        )}
      </div>

      <VariantSelector />

      <QuantitySelector quantity={qty} onQuantityChange={setQuantity} max={maxQty} disabled={outOfStock} />

      <form onSubmit={onSubmit}>
        <button
          type="submit"
          disabled={!selected || outOfStock}
          className="h-14 w-full rounded-full bg-cta text-cta-foreground hover:bg-cta-hover px-8 py-4 text-base font-semibold tracking-wide shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {buttonText}
        </button>
      </form>

      <TrustBadges />
    </div>
  );
}
