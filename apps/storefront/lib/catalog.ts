/**
 * Catalog queries over local mock data. This is the single seam to replace with real API calls
 * (b2c-server) later — every page reads products, categories and collections through here.
 */
import { brands, categories, collections, products } from "@/lib/data/catalog";
import type { Category, Product, Variant } from "@/lib/types";

export const PAGE_SIZE = 12;

export type SortKey = "featured" | "newest" | "price-asc" | "price-desc" | "name";

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "Name: A–Z" },
];

export type ListingFilters = {
  category?: string;
  collection?: string;
  brand?: string;
  /** Minimum price in cents. */
  priceMin?: number;
  priceMax?: number;
  /** Selected option values keyed by option name, e.g. { Color: ["Black"] }. */
  options?: Record<string, string[]>;
  q?: string;
  sort?: SortKey;
  page?: number;
};

export const minPrice = (p: Product) => Math.min(...p.variants.map((v) => v.price));
export const maxPrice = (p: Product) => Math.max(...p.variants.map((v) => v.price));

/** Price shown on a product card: the lowest variant price, plus its compare-at price when on sale. */
export function listingPrice(p: Product) {
  const cheapest = p.variants.reduce<Variant | undefined>((a, v) => (!a || v.price < a.price ? v : a), undefined);
  return {
    amount: cheapest?.price ?? 0,
    compareAt: cheapest?.compareAtPrice ?? null,
    from: minPrice(p) !== maxPrice(p),
  };
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug) ?? null;
}

/** The category and its ancestors, root first. */
export function getCategoryTrail(slug: string): Category[] {
  const trail: Category[] = [];
  let current = getCategory(slug);
  while (current) {
    trail.unshift(current);
    current = current.parent ? getCategory(current.parent) : null;
  }
  return trail;
}

export function getCategoryPath(slug: string) {
  return getCategoryTrail(slug)
    .map((c) => c.slug)
    .join("/");
}

/** A category slug and every descendant's slug. */
function categoryTree(slug: string): string[] {
  return [slug, ...categories.filter((c) => c.parent === slug).flatMap((c) => categoryTree(c.slug))];
}

export const getRootCategories = () => categories.filter((c) => !c.parent);
export const getCollections = () => collections;
export const getCollection = (slug: string) => collections.find((c) => c.slug === slug) ?? null;
export const getBrand = (slug: string) => brands.find((b) => b.slug === slug) ?? null;
export const getAllProducts = () => products;
export const getProduct = (slug: string) => products.find((p) => p.slug === slug) ?? null;

export function getProductsInCollection(slug: string) {
  return products.filter((p) => p.collections.includes(slug)).sort((a, b) => a.rank - b.rank);
}

export function getFeaturedProducts(limit = 6) {
  return [...products].sort((a, b) => a.rank - b.rank).slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 3) {
  const sameCategory = products.filter((p) => p.id !== product.id && p.category === product.category);
  const sameCollection = products.filter(
    (p) => p.id !== product.id && !sameCategory.includes(p) && p.collections.some((c) => product.collections.includes(c)),
  );
  return [...sameCategory, ...sameCollection].slice(0, limit);
}

function matchesQuery(p: Product, q: string) {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  const haystack = [p.name, p.summary, getCategory(p.category)?.name ?? "", getBrand(p.brand)?.name ?? ""]
    .join(" ")
    .toLowerCase();
  return needle.split(/\s+/).every((word) => haystack.includes(word));
}

function sortProducts(list: Product[], sort: SortKey = "featured") {
  const sorted = [...list];
  switch (sort) {
    case "newest":
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "price-asc":
      return sorted.sort((a, b) => minPrice(a) - minPrice(b));
    case "price-desc":
      return sorted.sort((a, b) => minPrice(b) - minPrice(a));
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted.sort((a, b) => a.rank - b.rank);
  }
}

export function filterProducts(filters: ListingFilters) {
  const inCategory = filters.category ? categoryTree(filters.category) : null;
  const matching = products.filter((p) => {
    if (inCategory && !inCategory.includes(p.category)) return false;
    if (filters.collection && !p.collections.includes(filters.collection)) return false;
    if (filters.brand && p.brand !== filters.brand) return false;
    if (filters.priceMin !== undefined && maxPrice(p) < filters.priceMin) return false;
    if (filters.priceMax !== undefined && minPrice(p) > filters.priceMax) return false;
    if (filters.q && !matchesQuery(p, filters.q)) return false;
    for (const [name, values] of Object.entries(filters.options ?? {})) {
      if (values.length === 0) continue;
      const has = p.variants.some((v) => v.options.some((o) => o.name === name && values.includes(o.value)));
      if (!has) return false;
    }
    return true;
  });
  return sortProducts(matching, filters.sort);
}

/** One page of a filtered, sorted listing. */
export function listProducts(filters: ListingFilters) {
  const all = filterProducts(filters);
  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, filters.page ?? 1), totalPages);
  return {
    products: all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    total: all.length,
    page,
    totalPages,
  };
}

export type Facets = {
  categories: { slug: string; name: string }[];
  collections: { slug: string; name: string }[];
  brands: { slug: string; name: string }[];
  options: { name: string; values: string[] }[];
  priceBounds: { min: number; max: number };
};

export function getFacets(): Facets {
  const optionMap = new Map<string, Set<string>>();
  for (const p of products) {
    for (const v of p.variants) {
      for (const o of v.options) {
        if (!optionMap.has(o.name)) optionMap.set(o.name, new Set());
        optionMap.get(o.name)!.add(o.value);
      }
    }
  }
  const prices = products.flatMap((p) => p.variants.map((v) => v.price));
  return {
    categories: categories.map(({ slug, name }) => ({ slug, name })),
    collections: collections.map(({ slug, name }) => ({ slug, name })),
    brands: brands.map(({ slug, name }) => ({ slug, name })),
    options: [...optionMap].map(([name, values]) => ({ name, values: [...values] })),
    priceBounds: { min: Math.floor(Math.min(...prices) / 100) * 100, max: Math.ceil(Math.max(...prices) / 100) * 100 },
  };
}

/** Quick suggestions for the header search box. */
export function suggestProducts(q: string, limit = 5) {
  if (q.trim().length < 2) return [];
  return products
    .filter((p) => matchesQuery(p, q))
    .slice(0, limit)
    .map((p) => ({ slug: p.slug, name: p.name, image: p.images[0] ?? null, price: listingPrice(p) }));
}

/** Parses URL search params into listing filters. */
export function parseListingParams(sp: Record<string, string | string[] | undefined>): ListingFilters {
  const one = (k: string) => {
    const v = sp[k];
    return Array.isArray(v) ? v[0] : v;
  };
  const num = (k: string) => {
    const v = one(k);
    return v && !Number.isNaN(Number(v)) ? Number(v) : undefined;
  };
  const options: Record<string, string[]> = {};
  const opt = one("opt");
  if (opt) {
    for (const part of opt.split(";")) {
      const [name, values] = part.split(":");
      if (name && values) options[name] = values.split(",").filter(Boolean);
    }
  }
  const sort = one("sort");
  return {
    category: one("category"),
    collection: one("collection"),
    brand: one("brand"),
    priceMin: num("priceMin"),
    priceMax: num("priceMax"),
    options,
    q: one("q"),
    sort: sortOptions.some((s) => s.value === sort) ? (sort as SortKey) : undefined,
    page: num("page"),
  };
}

export function encodeOptions(options: Record<string, string[]>) {
  return Object.entries(options)
    .filter(([, values]) => values.length > 0)
    .map(([name, values]) => `${name}:${values.join(",")}`)
    .join(";");
}
