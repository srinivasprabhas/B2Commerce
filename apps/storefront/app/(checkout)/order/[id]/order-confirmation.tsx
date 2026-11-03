"use client";

import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import type { CartLine } from "@/app/(checkout)/cart/cart-context";
import { lastOrderStore } from "@/app/(checkout)/order/[id]/order-store";
import { formatMoney } from "@/lib/money";

type SavedOrder = { id: string; items: CartLine[]; total: number; shipping: number; tax: number };

export function OrderConfirmation({ id }: { id: string }) {
  const raw = useSyncExternalStore(lastOrderStore.subscribe, lastOrderStore.getSnapshot, lastOrderStore.getServerSnapshot);
  const order = useMemo(() => {
    try {
      const saved = JSON.parse(raw ?? "null") as SavedOrder | null;
      return saved?.id === id ? saved : null;
    } catch {
      return null;
    }
  }, [raw, id]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" strokeWidth={1.5} />
        <h1 className="mt-6 text-3xl font-medium tracking-tight sm:text-4xl">Thank you for your order!</h1>
        <p className="mt-3 text-muted-foreground">
          Order <span className="font-medium text-foreground">{id}</span> is confirmed. We&apos;ve sent a receipt to your email.
        </p>
      </div>

      {order && (
        <div className="mt-12 rounded-2xl border border-border p-6">
          <h2 className="mb-4 text-lg font-medium">Order summary</h2>
          <ul className="divide-y divide-border">
            {order.items.map((item) => (
              <li key={item.variantId} className="flex items-center gap-4 py-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-secondary">
                  {item.image && <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Qty {item.quantity}
                    {item.options ? ` · ${item.options}` : ""}
                  </p>
                </div>
                <span className="text-sm font-medium">{formatMoney(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <dt>Shipping</dt>
              <dd>{order.shipping === 0 ? "Free" : formatMoney(order.shipping)}</dd>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <dt>Tax</dt>
              <dd>{formatMoney(order.tax)}</dd>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <dt>Total paid</dt>
              <dd>{formatMoney(order.total)}</dd>
            </div>
          </dl>
        </div>
      )}

      <div className="mt-10 text-center">
        <Link
          href="/products"
          className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-8 font-medium text-background transition-colors hover:bg-foreground/90"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
