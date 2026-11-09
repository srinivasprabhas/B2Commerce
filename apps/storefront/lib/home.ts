import { getAllProducts, getCategory, listingPrice } from "@/lib/catalog";
import type { Product } from "@/lib/types";

/** Everything a homepage product card needs, computed on the server from catalog data. */
export type Tile = {
  slug: string;
  name: string;
  type: string;
  image: string;
  image2: string | null;
  amount: number;
  compareAt: number | null;
  from: boolean;
  salePercent: number;
  sellingFast: boolean;
  isNew: boolean;
  /** Set when the product has exactly one in-stock variant, so it can be added straight from the card. */
  quickAdd: { variantId: string; price: number; stock: number | null } | null;
};

export function toTile(p: Product): Tile {
  const price = listingPrice(p);
  const stock = p.variants.reduce((s, v) => s + (v.stock ?? 99), 0);
  const only = p.variants.length === 1 ? p.variants[0]! : null;
  return {
    slug: p.slug,
    name: p.name,
    type: getCategory(p.category)?.name ?? "",
    image: p.images[0] ?? "",
    image2: p.images[1] ?? null,
    amount: price.amount,
    compareAt: price.compareAt,
    from: price.from,
    salePercent: price.compareAt ? Math.round((1 - price.amount / price.compareAt) * 100) : 0,
    sellingFast: stock > 0 && stock <= 12,
    isNew: p.collections.includes("new-arrivals"),
    quickAdd: only && only.stock !== 0 ? { variantId: only.id, price: only.price, stock: only.stock } : null,
  };
}

export const productBySlug = (slug: string) => getAllProducts().find((p) => p.slug === slug)!;
export const tilesFor = (slugs: string[]) => slugs.map((s) => toTile(productBySlug(s)));

/** Category → total products in it and its children. */
export function categoryCount(slug: string) {
  return getAllProducts().filter((p) => p.category === slug || getCategory(p.category)?.parent === slug).length;
}

export const avgRating = (p: Product) => (p.reviews.length ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length : 0);
