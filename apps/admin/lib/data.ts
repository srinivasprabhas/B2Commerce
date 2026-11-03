/**
 * Admin data layer. Products come from the same catalog the storefront uses
 * (@b2c/mock-data); orders/customers/stats are mock data until apps/server exists.
 * Swap these functions for @b2c/api-client calls later — pages only use these helpers.
 */
import { brands, categories, products } from "@b2c/mock-data/catalog";
import type { Product } from "@b2c/types";

// ---------- products ----------

export type ProductStatus = "Active" | "Low stock" | "Out of stock";

export type AdminProduct = {
  /** Numeric id used in admin URLs: /dashboard/pages/products/1 → catalog "p1". */
  id: number;
  slug: string;
  name: string;
  sku: string;
  image: string;
  images: string[];
  category: string;
  brand: string;
  /** Lowest variant price, in cents. */
  price: number;
  /** Total stock across variants (untracked variants count as 0 here). */
  stock: number;
  rating: number;
  reviewCount: number;
  status: ProductStatus;
  summary: string;
  details: string[];
  createdAt: string;
  colors: { value: string; swatch?: string }[];
  sizes: string[];
  source: Product;
};

const categoryName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug;
const brandName = (slug: string) => brands.find((b) => b.slug === slug)?.name ?? slug;

function toAdminProduct(p: Product): AdminProduct {
  const stock = p.variants.reduce((sum, v) => sum + (v.stock ?? 0), 0);
  const rating = p.reviews.length ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length : 0;
  const opts = p.variants.flatMap((v) => v.options);
  const uniq = <T,>(arr: T[], key: (t: T) => string) => [...new Map(arr.map((x) => [key(x), x])).values()];
  return {
    id: Number(p.id.replace(/\D/g, "")),
    slug: p.slug,
    name: p.name,
    sku: p.variants[0]?.sku ?? "—",
    image: p.images[0] ?? "",
    images: p.images,
    category: categoryName(p.category),
    brand: brandName(p.brand),
    price: Math.min(...p.variants.map((v) => v.price)),
    stock,
    rating: Math.round(rating * 10) / 10,
    reviewCount: p.reviews.length,
    status: stock === 0 ? "Out of stock" : stock <= 5 ? "Low stock" : "Active",
    summary: p.summary,
    details: p.details,
    createdAt: p.createdAt,
    colors: uniq(
      opts.filter((o) => o.kind === "color").map((o) => ({ value: o.value, swatch: o.swatch })),
      (o) => o.value,
    ),
    sizes: uniq(
      opts.filter((o) => o.name === "Size").map((o) => o.value),
      (s) => s,
    ),
    source: p,
  };
}

export const adminProducts: AdminProduct[] = products.map(toAdminProduct);
export const getAdminProduct = (id: number) => adminProducts.find((p) => p.id === id) ?? null;
export const productCategories = [...new Set(adminProducts.map((p) => p.category))].sort();
export const allCategories = categories;

/** Deterministic "units sold" per product (mock until we have order history). */
export const unitsSold = (p: AdminProduct) => ((p.id * 37) % 41) + p.reviewCount * 3;

// ---------- customers ----------

export type Customer = {
  name: string;
  email: string;
  phone: string;
  address: string;
  payment: string;
};

const customer = (name: string, phone: string, address: string, card: string): Customer => ({
  name,
  email: `${name.toLowerCase().replace(" ", ".")}@example.com`,
  phone,
  address,
  payment: card,
});

const customers: Customer[] = [
  customer("Liam Johnson", "+1 701 555 1122", "123 Main St, Anytown, AN 12345", "Visa ending in **** 1234"),
  customer("Emma Brown", "+1 415 555 0142", "48 Harbor Rd, Bayview, CA 94110", "Mastercard ending in **** 4410"),
  customer("Noah Fischer", "+1 212 555 0198", "9 Elm Ave, Brooklyn, NY 11201", "Visa ending in **** 8821"),
  customer("Olivia Martin", "+1 312 555 0110", "77 Lake Shore Dr, Chicago, IL 60611", "Amex ending in **** 3005"),
  customer("Ava Wilson", "+1 206 555 0175", "15 Pine St, Seattle, WA 98101", "Visa ending in **** 6672"),
  customer("James Miller", "+1 512 555 0133", "220 Congress Ave, Austin, TX 78701", "Mastercard ending in **** 9013"),
  customer("Sophia Davis", "+1 617 555 0156", "5 Beacon St, Boston, MA 02108", "Visa ending in **** 2290"),
  customer("Mia Garcia", "+1 305 555 0187", "310 Ocean Dr, Miami, FL 33139", "PayPal (mia.garcia@example.com)"),
  customer("Lucas Rodriguez", "+1 303 555 0121", "1600 Glenarm Pl, Denver, CO 80202", "Visa ending in **** 7741"),
  customer("Isabella Martinez", "+1 602 555 0164", "88 Camelback Rd, Phoenix, AZ 85016", "Mastercard ending in **** 5528"),
];

// ---------- orders ----------

export type OrderStatus = "Pending" | "Shipped" | "Delivered" | "Cancelled";
export type PaymentStatus = "paid" | "processing" | "success" | "failed";

export type OrderItem = { product: AdminProduct; quantity: number; price: number };

export type Order = {
  id: string;
  customer: Customer;
  items: OrderItem[];
  type: "Sale" | "Refund";
  date: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippedOn?: string;
  /** All money values in cents. */
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
};

const statuses: OrderStatus[] = ["Delivered", "Pending", "Shipped", "Delivered", "Cancelled"];
const payments: PaymentStatus[] = ["processing", "paid", "success", "processing", "failed", "paid", "success", "processing"];
const TAX_RATE = 0.08;

function buildOrder(i: number): Order {
  const first = adminProducts[(i * 7) % adminProducts.length]!;
  const items: OrderItem[] = [{ product: first, quantity: (i % 2) + 1, price: first.price }];
  if (i % 3 === 0) {
    const second = adminProducts[(i * 7 + 4) % adminProducts.length]!;
    items.push({ product: second, quantity: 1, price: second.price });
  }
  const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
  const discount = i % 4 === 0 ? 1000 : 0;
  const shipping = subtotal >= 7500 ? 0 : 1000;
  const tax = Math.round(subtotal * TAX_RATE);
  const status = statuses[i % statuses.length]!;
  const date = new Date(Date.UTC(2026, 9, 31) - i * 2 * 86_400_000);
  return {
    id: String(84231 - i),
    customer: customers[i % customers.length]!,
    items,
    type: status === "Cancelled" ? "Refund" : "Sale",
    date: date.toISOString().slice(0, 10),
    status,
    paymentStatus: payments[i % payments.length]!,
    shippedOn:
      status === "Shipped" || status === "Delivered"
        ? new Date(date.getTime() + 86_400_000).toISOString().slice(0, 10)
        : undefined,
    subtotal,
    discount,
    shipping,
    tax,
    total: subtotal - discount + shipping + tax,
  };
}

export const orders: Order[] = Array.from({ length: 15 }, (_, i) => buildOrder(i));
/** "detail" is the demo slug used by the sidebar's "Order Detail" link. */
export const getOrder = (id: string) => (id === "detail" ? orders[0]! : (orders.find((o) => o.id === id) ?? null));

// ---------- formatting ----------

export const money = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);

export const shortDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

export const longDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

export const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
