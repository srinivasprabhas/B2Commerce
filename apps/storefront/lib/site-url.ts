/**
 * Absolute base URL of this app, used for metadata, sitemap and robots.
 * Priority: NEXT_PUBLIC_SITE_URL (set this to your custom domain in Vercel)
 * → Vercel production URL → Vercel preview URL → localhost.
 */
export function getSiteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return new URL(explicit);
  if (process.env.VERCEL_ENV === "production" && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
  }
  if (process.env.VERCEL_URL) return new URL(`https://${process.env.VERCEL_URL}`);
  return new URL(`http://localhost:${process.env.PORT ?? 3000}`);
}
