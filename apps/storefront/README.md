# B2Commerce — Storefront

Storefront UI for B2Commerce, built with Next.js (App Router), Tailwind CSS v4 and shadcn/ui on Base UI.

This is currently a **UI-only** build: products, categories, collections, reviews, blog posts and legal pages come from local mock data, and the cart is stored in the browser.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Project structure

| Path | What it is |
| --- | --- |
| `lib/config.ts` | Store name, tagline, currency, free-shipping threshold |
| `lib/data/catalog.ts` | Mock products, categories, collections, brands |
| `lib/data/content.ts` | Mock legal pages, blog posts, FAQ |
| `lib/catalog.ts` | Catalog queries (filter, sort, paginate, search). Replace these with calls to `b2c-server` |
| `app/cart/` | Cart state (localStorage), cart drawer, discount codes |
| `app/product/[slug]/` | Product page: gallery, variant picker, add to cart, reviews |
| `components/ui/` | shadcn/ui primitives |

## Pages

Home, all products (filters, sort, pagination), category, collection, product, search, cart drawer, checkout, order confirmation, account, blog, about, FAQ, contact and legal pages.

## Demo behaviour

- Discount codes: `WELCOME10` (10% off) and `SAVE20` (20% off).
- Checkout, newsletter, contact, reviews and account forms are simulated. No requests leave the browser.
- Product photos are loaded from Unsplash. Replace them with your own images in `lib/data/catalog.ts`.
