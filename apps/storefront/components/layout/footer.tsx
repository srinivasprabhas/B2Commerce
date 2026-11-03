import Link from "next/link";
import { PaymentMethods } from "@/components/layout/payment-methods";
import { getCollections } from "@/lib/catalog";
import { storeConfig } from "@/lib/config";
import { legalPages } from "@/lib/data/content";

const linkClass = "text-sm text-brand-muted transition-colors hover:text-brand-foreground";

export function Footer() {
  const year = new Date().getFullYear();
  const collections = getCollections();

  return (
    <footer className="bg-brand text-brand-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 py-12 sm:flex-row sm:gap-16 sm:py-16">
          <div className="sm:max-w-xs">
            <Link href="/" className="text-xl font-bold">
              {storeConfig.name}
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-brand-muted">{storeConfig.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Collections</h3>
            <ul className="mt-4 space-y-3">
              {collections.map((c) => (
                <li key={c.slug}>
                  <Link href={`/collection/${c.slug}`} className={linkClass}>
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Support</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/about" className={linkClass}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className={linkClass}>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className={linkClass}>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/blog" className={linkClass}>
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Legal</h3>
            <ul className="mt-4 space-y-3">
              {legalPages.map((page) => (
                <li key={page.slug}>
                  <Link href={`/legal/${page.slug}`} className={linkClass}>
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-brand-foreground/15 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-brand-muted">
            &copy; {year} {storeConfig.name}. All rights reserved.
          </p>
          <PaymentMethods />
        </div>
      </div>
    </footer>
  );
}
