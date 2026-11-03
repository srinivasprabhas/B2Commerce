import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  const isProduction = !process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production";
  return {
    // Keep preview deployments out of search results
    rules: isProduction
      ? { userAgent: "*", allow: "/", disallow: ["/api/", "/checkout", "/account", "/order/"] }
      : { userAgent: "*", disallow: "/" },
    sitemap: new URL("/sitemap.xml", base).toString(),
  };
}
