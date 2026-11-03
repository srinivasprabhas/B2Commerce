# @b2c/server

API for the storefront and admin. **Structure only — no code yet.**

```
src/
├── modules/        one folder per domain: routes, service, validation
│   ├── auth/  products/  categories/  orders/
│   ├── customers/  cart/  payments/
│   └── admin/      admin-only endpoints — every route must check role === "admin"
├── middleware/     auth, requireRole, error handling
├── db/             schema, migrations/, seed
├── config/         env loading + validation
└── index.ts        app entry (to be created)
```

Share request/response types with the frontends through `@b2c/types`.
