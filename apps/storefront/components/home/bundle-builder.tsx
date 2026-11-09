"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "@/app/(checkout)/cart/cart-context";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

export type BundleItem = {
  slug: string;
  name: string;
  image: string;
  variants: { id: string; label: string; price: number; compareAt: number | null; stock: number | null }[];
};

/** "Shop the setup" list: toggle items, pick a variant, add everything to the cart at once. */
export function BundleBuilder({ items }: { items: BundleItem[] }) {
  const { addItem, openCart } = useCart();
  const [state, setState] = useState(items.map(() => ({ on: true, variant: 0 })));

  const chosen = items.map((it, i) => ({ it, s: state[i]!, v: it.variants[state[i]!.variant]! })).filter((x) => x.s.on);
  const total = chosen.reduce((sum, x) => sum + x.v.price, 0);
  const update = (i: number, patch: Partial<{ on: boolean; variant: number }>) =>
    setState((prev) => prev.map((s, k) => (k === i ? { ...s, ...patch } : s)));

  return (
    <div>
      <div>
        {items.map((it, i) => {
          const s = state[i]!;
          const v = it.variants[s.variant]!;
          return (
            <div
              key={it.slug}
              className={cn(
                "grid grid-cols-[32px_72px_1fr] items-center gap-3.5 border-b border-border py-6 text-left transition-opacity first:pt-0 sm:grid-cols-[38px_108px_1fr_auto] sm:gap-5",
                !s.on && "opacity-45",
              )}
            >
              <button
                type="button"
                aria-pressed={s.on}
                aria-label={`${s.on ? "Remove" : "Include"} ${it.name}`}
                onClick={() => update(i, { on: !s.on })}
                className={cn(
                  "grid size-8 place-items-center rounded-full border text-[17px] transition-colors sm:size-[38px]",
                  s.on ? "border-primary bg-primary text-primary-foreground" : "border-[#c9ced8]",
                )}
              >
                {i + 1}
              </button>
              <div className="relative size-[72px] overflow-hidden rounded-xl bg-secondary sm:size-[108px]">
                <Image src={it.image} alt="" fill sizes="108px" className="object-cover mix-blend-multiply" />
              </div>
              <div>
                <div className="mb-2 text-base font-medium tracking-[-0.015em] sm:text-xl">{it.name}</div>
                {it.variants.length > 1 ? (
                  <select
                    aria-label={`Option for ${it.name}`}
                    value={s.variant}
                    onChange={(e) => update(i, { variant: Number(e.target.value) })}
                    className="cursor-pointer rounded-md bg-transparent pr-1 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-lg"
                  >
                    {it.variants.map((vv, k) => (
                      <option key={vv.id} value={k} disabled={vv.stock === 0}>
                        {vv.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-base text-muted-foreground sm:text-lg">{v.label}</span>
                )}
              </div>
              <div className="col-start-3 self-start text-base font-semibold sm:col-start-auto sm:text-right sm:text-[19px]">
                <span className={v.compareAt ? "text-[#d63a2f]" : undefined}>{formatMoney(v.price)}</span>
                {v.compareAt && <s className="ml-2 font-normal text-muted-foreground">{formatMoney(v.compareAt)}</s>}
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-8 mb-6 text-lg">
        {chosen.length ? (
          <>
            Bundle total <strong className="ml-2 text-[26px] font-semibold">{formatMoney(total)}</strong>
          </>
        ) : (
          "Select items to build your setup"
        )}
      </p>
      <button
        type="button"
        disabled={!chosen.length}
        onClick={() => {
          for (const { it, v } of chosen) {
            addItem({
              variantId: v.id,
              productSlug: it.slug,
              name: it.name,
              image: it.image,
              price: v.price,
              options: it.variants.length > 1 ? v.label : null,
              stock: v.stock,
            });
          }
          toast.success(`Added ${chosen.length} items to your cart`);
          openCart();
        }}
        className="inline-flex h-14 items-center rounded-full bg-primary px-12 text-[17px] font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        Add All To Cart
      </button>
    </div>
  );
}
