# B2C

Monorepo: storefront, admin dashboard and API server, plus shared packages.

```
apps/
  storefront/   Next.js — customer-facing shop        → localhost:3000
  admin/        Next.js — admin dashboard              → localhost:3001
  server/       API (structure only, not implemented)  → localhost:4000
packages/
  ui/           shared shadcn components + Tailwind theme   (@b2c/ui)
  types/        shared domain types                         (@b2c/types)
  api-client/   typed fetch wrapper for apps/server         (@b2c/api-client)
  config/       shared tsconfig                             (@b2c/config)
```

## Commands (run from this folder)

```bash
npm install          # installs every app + package
npm run dev          # all apps
npm run dev:store    # storefront only
npm run dev:admin    # admin only
npm run build        # build everything (Turborepo)
```

Add a dependency to one app: `npm install <pkg> -w @b2c/admin`

Add a shadcn component to the shared UI: put it in `packages/ui/src/components/`
and import it as `@b2c/ui/components/<name>`.

## Deploy to Vercel (one repo → two projects)

Push this folder to GitHub, then create **two** Vercel projects from the same repo:

| Project            | Root Directory    | Production URL (example)      |
| ------------------ | ----------------- | ----------------------------- |
| b2commerce         | `apps/storefront` | b2commerce.vercel.app         |
| b2commerce-admin   | `apps/admin`      | b2commerce-admin.vercel.app   |

For each project: **Add New → Project → import the repo → Root Directory → pick the app**.
Vercel detects Next.js and the npm workspace automatically — leave the build,
install and output settings on their defaults.

- `apps/*/vercel.json` runs `turbo-ignore`, so a push only rebuilds the app(s)
  whose code (or shared `packages/*`) actually changed.
- Optional env var per project: `NEXT_PUBLIC_SITE_URL` = your custom domain
  (used for sitemap/robots/social links). Without it the Vercel URL is used.
- **Protect the admin:** its sign-in is a UI-test stub that accepts any details.
  In the admin project enable **Settings → Deployment Protection → Vercel
  Authentication** (or Password Protection) until real auth exists.
- `apps/server` is not deployed yet (structure only).
