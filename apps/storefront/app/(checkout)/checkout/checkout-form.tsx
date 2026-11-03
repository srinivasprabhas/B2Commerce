"use client";

import { Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/app/(checkout)/cart/cart-context";
import { PaymentMethods } from "@/components/layout/payment-methods";
import { storeConfig } from "@/lib/config";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

const field =
  "h-12 w-full rounded-lg border border-border bg-background px-4 text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10";

const SHIPPING = [
  { id: "standard", label: "Standard", eta: "3–5 business days", price: 599 },
  { id: "express", label: "Express", eta: "1–2 business days", price: 1499 },
];

function Field({ label, className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-2 block text-sm font-medium">{label}</span>
      <input className={field} {...props} />
    </label>
  );
}

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, discount, clearCart } = useCart();
  const [shippingId, setShippingId] = useState("standard");
  const [placing, setPlacing] = useState(false);

  const afterDiscount = subtotal - (discount?.amount ?? 0);
  const method = SHIPPING.find((s) => s.id === shippingId)!;
  const shipping = method.id === "standard" && afterDiscount >= storeConfig.freeShippingThreshold ? 0 : method.price;
  const tax = Math.round(afterDiscount * 0.08);
  const total = afterDiscount + shipping + tax;

  if (items.length === 0 && !placing) {
    return (
      <div className="rounded-lg border border-border bg-secondary/30 p-12 text-center">
        <p className="text-lg font-medium">Your cart is empty</p>
        <p className="mt-1 text-sm text-muted-foreground">Add a few products before checking out.</p>
        <Link
          href="/products"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-foreground px-8 font-medium text-background hover:bg-foreground/90"
        >
          Browse products
        </Link>
      </div>
    );
  }

  const placeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setPlacing(true);
    // UI only: simulate payment, then show the confirmation page.
    setTimeout(() => {
      const orderId = `B2C-${String(Date.now()).slice(-6)}`;
      sessionStorage.setItem("b2c-last-order", JSON.stringify({ id: orderId, items, total, shipping, tax, discount }));
      clearCart();
      router.push(`/order/${orderId}`);
    }, 900);
  };

  return (
    <form onSubmit={placeOrder} className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="space-y-10">
        <section>
          <h2 className="mb-4 text-lg font-medium">Contact</h2>
          <Field label="Email" type="email" required placeholder="your@email.com" autoComplete="email" />
        </section>

        <section>
          <h2 className="mb-4 text-lg font-medium">Shipping address</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name" required autoComplete="given-name" />
            <Field label="Last name" required autoComplete="family-name" />
            <Field label="Address" required autoComplete="street-address" className="sm:col-span-2" />
            <Field label="City" required autoComplete="address-level2" />
            <Field label="Postal code" required autoComplete="postal-code" />
            <Field label="Phone" type="tel" autoComplete="tel" className="sm:col-span-2" />
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-medium">Delivery method</h2>
          <div className="space-y-3">
            {SHIPPING.map((s) => {
              const free = s.id === "standard" && afterDiscount >= storeConfig.freeShippingThreshold;
              return (
                <label
                  key={s.id}
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded-lg border-2 p-4 transition-colors",
                    shippingId === s.id ? "border-foreground" : "border-border hover:border-muted-foreground",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      value={s.id}
                      checked={shippingId === s.id}
                      onChange={() => setShippingId(s.id)}
                      className="accent-foreground"
                    />
                    <span>
                      <span className="block text-sm font-medium">{s.label}</span>
                      <span className="block text-xs text-muted-foreground">{s.eta}</span>
                    </span>
                  </span>
                  <span className="text-sm font-medium">{free ? "Free" : formatMoney(s.price)}</span>
                </label>
              );
            })}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium">Payment</h2>
            <PaymentMethods />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Card number" required inputMode="numeric" placeholder="1234 1234 1234 1234" className="sm:col-span-2" />
            <Field label="Expiry" required placeholder="MM / YY" />
            <Field label="CVC" required inputMode="numeric" placeholder="123" />
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" /> Demo checkout — no payment is taken.
          </p>
        </section>
      </div>

      <aside className="h-fit space-y-6 rounded-2xl border border-border bg-secondary/30 p-6 lg:sticky lg:top-24">
        <h2 className="text-lg font-medium">Order summary</h2>
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <li key={item.variantId} className="flex gap-3 py-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-secondary">
                {item.image && <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />}
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-xs text-background">
                  {item.quantity}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.name}</p>
                {item.options && <p className="text-xs text-muted-foreground">{item.options}</p>}
              </div>
              <span className="text-sm font-medium">{formatMoney(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <dt>Subtotal</dt>
            <dd>{formatMoney(subtotal)}</dd>
          </div>
          {discount && (
            <div className="flex justify-between text-green-700 dark:text-green-400">
              <dt>Discount ({discount.code})</dt>
              <dd>−{formatMoney(discount.amount)}</dd>
            </div>
          )}
          <div className="flex justify-between text-muted-foreground">
            <dt>Shipping</dt>
            <dd>{shipping === 0 ? "Free" : formatMoney(shipping)}</dd>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <dt>Estimated tax</dt>
            <dd>{formatMoney(tax)}</dd>
          </div>
          <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
            <dt>Total</dt>
            <dd>{formatMoney(total)}</dd>
          </div>
        </dl>
        <button
          type="submit"
          disabled={placing}
          className="h-12 w-full rounded-full bg-cta text-cta-foreground hover:bg-cta-hover text-base font-semibold shadow-sm transition-colors disabled:opacity-60"
        >
          {placing ? "Placing order…" : `Pay ${formatMoney(total)}`}
        </button>
      </aside>
    </form>
  );
}
