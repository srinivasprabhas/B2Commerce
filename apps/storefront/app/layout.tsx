import "./globals.css";

import { UserRound } from "lucide-react";
import type { Metadata } from "next";
import { DM_Sans, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/app/(checkout)/cart/cart-context";
import { CartSidebar } from "@/app/(checkout)/cart/cart-sidebar";
import { CartButton } from "@/app/cart-button";
import { Footer } from "@/components/layout/footer";
import { Navbar, type NavLink } from "@/components/layout/navbar";
import { SearchInput } from "@/components/search/search-input";
import { Toaster } from "@b2c/ui/components/sonner";
import { getCollections } from "@/lib/catalog";
import { storeConfig } from "@/lib/config";
import { getSiteUrl } from "@/lib/site-url";
import { formatMoney } from "@/lib/money";

const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], preload: false });

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  openGraph: { type: "website", siteName: storeConfig.name },
  title: { default: storeConfig.name, template: `%s — ${storeConfig.name}` },
  description: storeConfig.description,
  applicationName: storeConfig.name,
};

const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  ...getCollections().map((c) => ({ href: `/collection/${c.slug}`, label: c.name })),
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const announcements = [
  `Free shipping on orders over ${formatMoney(storeConfig.freeShippingThreshold)}`,
  "Easy 30-day returns",
  "1-year warranty on all tech",
  "Every product tested by our team",
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              <div className="marquee overflow-hidden bg-primary text-[13px] whitespace-nowrap text-primary-foreground uppercase sm:text-[15px]" aria-label="Announcements">
                <div className="marquee-track gap-[72px] py-3 pr-[72px] [animation-duration:38s]">
                  {[...announcements, ...announcements, ...announcements, ...announcements].map((t, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: static, repeated marquee text
                    <span key={i}>{t}</span>
                  ))}
                </div>
              </div>
              <header className="sticky top-0 z-50 bg-background shadow-[0_6px_24px_rgba(18,31,55,.06)]">
                <div className="mx-auto max-w-[1660px] px-[clamp(16px,4.2vw,80px)]">
                  <div className="relative flex h-20 items-center justify-between lg:h-24">
                    <div className="flex items-center gap-2">
                      <Link href="/" className="mr-2 flex shrink-0 items-center" aria-label={`${storeConfig.name} home`}>
                        <Image src="/brand/logo.png" alt={storeConfig.name} width={1200} height={335} priority className="h-10 w-auto lg:h-[52px]" />
                      </Link>
                      <Navbar links={navLinks} />
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2.5">
                      <SearchInput />
                      <Link href="/account" className="rounded-full p-2 transition-colors hover:bg-secondary" aria-label="Account">
                        <UserRound className="h-6 w-6" strokeWidth={1.6} />
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
