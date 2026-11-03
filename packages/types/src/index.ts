export type OptionKind = "text" | "color";

export type VariantOption = {
  /** Option name, e.g. "Color" or "Size". */
  name: string;
  kind: OptionKind;
  value: string;
  /** Hex swatch for color options. */
  swatch?: string;
};

export type Variant = {
  id: string;
  sku: string;
  /** Price in cents. */
  price: number;
  /** Original price in cents when on sale. */
  compareAtPrice?: number;
  /** null = stock not tracked. */
  stock: number | null;
  images: string[];
  options: VariantOption[];
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  content: string;
  verified: boolean;
  createdAt: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  details: string[];
  images: string[];
  category: string;
  collections: string[];
  brand: string;
  variants: Variant[];
  createdAt: string;
  /** Lower = earlier in the "Featured" sort. */
  rank: number;
  reviews: Review[];
};

export type Category = {
  slug: string;
  name: string;
  description: string;
  parent?: string;
};

export type Collection = {
  slug: string;
  name: string;
  description: string;
  image: string;
};

export type Brand = { slug: string; name: string };

export type LegalPage = { slug: string; title: string; updatedAt: string; sections: { heading: string; body: string }[] };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  publishedAt: string;
  readingMinutes: number;
  body: string[];
  productSlugs: string[];
};
