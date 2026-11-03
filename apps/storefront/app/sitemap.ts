import type { MetadataRoute } from "next";
import { getAllProducts, getCategoryPath, getCollections } from "@/lib/catalog";
import { categories } from "@/lib/data/catalog";
import { blogPosts, legalPages } from "@/lib/data/content";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const url = (path: string) => new URL(path, base).toString();

  const staticPages = ["/", "/products", "/about", "/blog", "/faq", "/contact"].map((p) => ({
    url: url(p),
    changeFrequency: "weekly" as const,
    priority: p === "/" ? 1 : 0.7,
  }));

  return [
    ...staticPages,
    ...getAllProducts().map((p) => ({ url: url(`/product/${p.slug}`), lastModified: p.createdAt, priority: 0.8 })),
    ...categories.map((c) => ({ url: url(`/category/${getCategoryPath(c.slug)}`), priority: 0.6 })),
    ...getCollections().map((c) => ({ url: url(`/collection/${c.slug}`), priority: 0.6 })),
    ...blogPosts.map((b) => ({ url: url(`/blog/${b.slug}`), lastModified: b.publishedAt, priority: 0.5 })),
    ...legalPages.map((l) => ({ url: url(`/legal/${l.slug}`), lastModified: l.updatedAt, priority: 0.3 })),
  ];
}
