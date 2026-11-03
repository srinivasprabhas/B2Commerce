import { ShoppingCartIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page Not Found", robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <div className="flex min-h-[70dvh] flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <ShoppingCartIcon className="size-16 text-muted-foreground/50" strokeWidth={1.5} />
      <h1 className="mt-6 text-7xl font-bold tracking-tight">404</h1>
      <h2 className="mt-4 text-xl text-muted-foreground">Page not found</h2>
      <p className="mt-2 text-sm text-muted-foreground">This page doesn&apos;t exist or has been moved. But our store is still open!</p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
