import type { MetadataRoute } from "next";

/** The admin must never be indexed by search engines. */
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", disallow: "/" } };
}
