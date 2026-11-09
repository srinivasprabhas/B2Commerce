"use client";

import Link from "next/link";
import { useState } from "react";
import { HomeProductCard } from "@/components/home/home-product-card";
import type { Tile } from "@/lib/home";
import { cn } from "@/lib/utils";

export function ProductTabs({ tabs }: { tabs: { key: string; label: string; tiles: Tile[] }[] }) {
  const [active, setActive] = useState(tabs[0]?.key);
  const current = tabs.find((t) => t.key === active) ?? tabs[0];

  return (
    <>
      <div className="mb-11 flex flex-wrap items-end justify-between gap-6">
        <div role="tablist" aria-label="Featured products" className="flex flex-wrap gap-x-14 gap-y-3">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={t.key === current?.key}
              onClick={() => setActive(t.key)}
              className={cn(
                "text-[clamp(30px,3vw,46px)] leading-[1.1] font-medium tracking-[-0.045em] transition-colors hover:text-foreground",
                t.key === current?.key ? "text-foreground" : "text-[#a9afba]",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <Link href="/products" className="border-b-[1.5px] border-current pb-1 text-[17px] font-medium hover:opacity-70">
          Shop All Products
        </Link>
      </div>
      <div role="tabpanel" className="grid grid-cols-2 gap-2.5 sm:gap-3.5 xl:grid-cols-4">
        {current?.tiles.map((tile) => (
          <HomeProductCard key={tile.slug} tile={tile} />
        ))}
      </div>
    </>
  );
}
