import type { Metadata } from "next";
import { CheckoutForm } from "@/app/(checkout)/checkout/checkout-form";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <h1 className="mb-10 text-3xl font-medium tracking-tight sm:text-4xl">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
