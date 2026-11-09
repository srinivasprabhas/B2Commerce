"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/(checkout)/cart/cart-context";
import type { Tile } from "@/lib/home";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

const sizes = "(max-width: 640px) 50vw, (max-width: 1200px) 50vw, 25vw";

/** Homepage product card: soft grey tile, badges, hover image swap and an add/choose button. */
export function HomeProductCard({ tile, className }: { tile: Tile; className?: string }) {
  const { addItem, openCart } = useCart();
  const href = `/product/${tile.slug}`;

  return (
    <article className={cn("group flex flex-col overflow-hidden rounded-[20px] bg-secondary", className)}>
      <div className="relative aspect-square overflow-hidden">
        <Link href={href} aria-label={tile.name} className="absolute inset-0">
          <Image
            src={tile.image}
            alt={tile.name}
            fill
            sizes={sizes}
            className={cn(
              "object-cover mix-blend-multiply transition duration-700",
              tile.image2 ? "group-hover:opacity-0" : "group-hover:scale-105",
            )}
          />
          {tile.image2 && (
            <Image src={tile.image2} alt="" fill sizes={sizes} className="object-cover opacity-0 mix-blend-multiply transition duration-700 group-hover:opacity-100" />
          )}
        </Link>

        <div className="pointer-events-none absolute top-3.5 left-3.5 z-10 flex flex-wrap gap-2">
          {tile.salePercent > 0 && <span className="rounded-md bg-[#d63a2f] px-2.5 py-1.5 text-xs leading-none font-semibold text-white sm:text-base">-{tile.salePercent}%</span>}
          {tile.sellingFast && <span className="rounded-md bg-cta px-2.5 py-1.5 text-xs leading-none font-semibold text-cta-foreground sm:text-base">Selling fast!</span>}
          {tile.isNew && <span className="rounded-md bg-[#4f9a5f] px-2.5 py-1.5 text-xs leading-none font-semibold text-white sm:text-base">New</span>}
        </div>

        <Link
          href={href}
          aria-label={`View ${tile.name}`}
          className="absolute top-4 right-4 z-10 hidden size-12 scale-90 place-items-center rounded-full bg-background opacity-0 transition duration-300 group-hover:scale-100 group-hover:opacity-100 sm:grid"
        >
          <Search className="size-5" />
        </Link>

        {tile.quickAdd ? (
          <button
            type="button"
            onClick={() => {
              const q = tile.quickAdd!;
              addItem({ variantId: q.variantId, productSlug: tile.slug, name: tile.name, image: tile.image, price: q.price, options: null, stock: q.stock });
              openCart();
            }}
            className="absolute inset-x-2.5 bottom-2.5 z-10 h-11 rounded-full bg-background text-sm font-medium transition duration-300 hover:bg-primary hover:text-primary-foreground sm:inset-x-6 sm:bottom-6 sm:h-14 sm:translate-y-3 sm:text-base sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
          >
            Add To Cart
          </button>
        ) : (
          <Link
            href={href}
            className="absolute inset-x-2.5 bottom-2.5 z-10 grid h-11 place-items-center rounded-full bg-background text-sm font-medium transition duration-300 hover:bg-primary hover:text-primary-foreground sm:inset-x-6 sm:bottom-6 sm:h-14 sm:translate-y-3 sm:text-base sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
          >
            Choose Options
          </Link>
        )}
      </div>

      <div className="px-3.5 pt-4 pb-5 sm:px-7 sm:pt-7 sm:pb-8">
        <div className="text-sm text-muted-foreground sm:text-base">{tile.type}</div>
        <h3 className="mt-1.5 mb-2.5 text-base leading-snug font-medium tracking-[-0.015em] sm:text-xl">
          <Link href={href} className="hover:underline">
            {tile.name}
          </Link>
        </h3>
        <div className="flex flex-wrap items-baseline gap-2.5 text-base font-semibold sm:text-[19px]">
          <span className={tile.compareAt ? "text-[#d63a2f]" : undefined}>
            {tile.from ? "From " : ""}
            {formatMoney(tile.amount)}
          </span>
          {tile.compareAt && <s className="font-normal text-muted-foreground">{formatMoney(tile.compareAt)}</s>}
        </div>
      </div>
    </article>
  );
}
