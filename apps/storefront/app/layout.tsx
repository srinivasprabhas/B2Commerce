import "./globals.css";

import { UserRound } from "lucide-react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/app/(checkout)/cart/cart-context";
import { CartSidebar } from "@/app/(checkout)/cart/cart-sidebar";
import { CartButton } from "@/app/cart-button";
import { Footer } from "@/components/layout/footer";
import { Navbar, type NavLink } from "@/components/layout/navbar";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { SearchInput } from "@/components/search/search-input";
import { Toaster } from "@b2c/ui/components/sonner";
import { getCollections } from "@/lib/catalog";
import { storeConfig } from "@/lib/config";
import { getSiteUrl } from "@/lib/site-url";
import { formatMoney } from "@/lib/money";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], preload: false });

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  openGraph: { type: "website", siteName: storeConfig.name },
  title: { default: storeConfig.name, template: `%s — ${storeConfig.name}` },
  description: storeConfig.description,
  applicationName: storeConfig.name,
  icons: { icon: "/logo.svg" },
};

const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  ...getCollections().map((c) => ({ href: `/collection/${c.slug}`, label: c.name })),
  { href: "/blog", label: "Blog" },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              <div className="bg-brand px-4 py-2 text-center text-xs font-medium text-brand-foreground sm:text-sm">
                Free shipping on orders over {formatMoney(storeConfig.freeShippingThreshold)} · Easy 30-day returns
              </div>
              <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  <div className="relative flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Link href="/" className="text-xl font-bold text-primary">
                        {storeConfig.name}
                      </Link>
                      <Navbar links={navLinks} />
                    </div>
                    <div className="flex items-center gap-2">
                      <SearchInput />
                      <ThemeToggle />
                      <Link href="/account" className="rounded-full p-2 transition-colors hover:bg-secondary" aria-label="Account">
                        <UserRound className="h-5 w-5" />
                      </Link>
                      <CartButton />
                    </div>
                  </div>
                </div>
              </header>
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <CartSidebar />
          </CartProvider>
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
