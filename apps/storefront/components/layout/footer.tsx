import Image from "next/image";
import Link from "next/link";
import { FooterNewsletter } from "@/components/layout/footer-newsletter";
import { PaymentMethods } from "@/components/layout/payment-methods";
import { getCollections } from "@/lib/catalog";
import { storeConfig } from "@/lib/config";
import { legalPages } from "@/lib/data/content";

const linkClass = "text-[17px] transition-colors hover:text-primary hover:underline";

export function Footer() {
  const year = new Date().getFullYear();
  const collections = getCollections();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1660px] px-[clamp(16px,4.2vw,80px)]">
        <div className="grid gap-12 py-16 sm:grid-cols-2 sm:py-24 xl:grid-cols-[1.3fr_.7fr_.7fr_1fr]">
          <div>
            <h2 className="mb-4 text-[clamp(30px,2.4vw,42px)] leading-[1.12] font-medium tracking-[-0.045em]">Get 10% off your first order</h2>
            <p className="mb-8 text-[17px]">Join our newsletter for new arrivals, exclusive deals and members-only offers.</p>
            <FooterNewsletter />
          </div>

          <div>
            <h3 className="mb-7 text-[26px] font-medium tracking-[-0.02em]">Shop</h3>
            <ul className="grid gap-4">
              <li>
                <Link href="/products" className={linkClass}>
                  Shop All
                </Link>
              </li>
              {collections.map((c) => (
                <li key={c.slug}>
                  <Link href={`/collection/${c.slug}`} className={linkClass}>
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/blog" className={linkClass}>
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-7 text-[26px] font-medium tracking-[-0.02em]">Customer care</h3>
            <ul className="grid gap-4">
              <li>
                <Link href="/account" className={linkClass}>
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/contact" className={linkClass}>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className={linkClass}>
                  FAQs
                </Link>
              </li>
              {legalPages.map((page) => (
                <li key={page.slug}>
                  <Link href={`/legal/${page.slug}`} className={linkClass}>
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-7 text-[26px] font-medium tracking-[-0.02em]">About</h3>
            <p className="text-lg">{storeConfig.description}</p>
            <Link href="/about" className="mt-6 inline-block border-b-[1.5px] border-current pb-1 font-medium hover:opacity-70">
              About Us
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-5 border-t border-border py-7 text-[15px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" aria-label={`${storeConfig.name} home`}>
            <Image src="/brand/logo.png" alt={storeConfig.name} width={1200} height={335} className="h-10 w-auto" />
          </Link>
          <p>
            &copy; {year} {storeConfig.name}. All rights reserved.
          </p>
          <PaymentMethods />
        </div>
      </div>
    </footer>
  );
}
