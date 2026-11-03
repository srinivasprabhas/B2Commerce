import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/common/page-header";
import { storeConfig } from "@/lib/config";

export const metadata: Metadata = { title: "About Us", description: `Learn about ${storeConfig.name}.` };

const values = [
  { title: "Quality first", body: "Every product is chosen and checked so you can buy with confidence." },
  { title: "Fair prices", body: "Great products shouldn't cost a fortune. We keep our margins honest." },
  { title: "Real support", body: "Friendly people, ready to help before and after your order." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <PageHeader title="About Us" description={storeConfig.description} />

      <div className="space-y-12">
        <section>
          <h2 className="mb-4 text-2xl font-medium tracking-tight">Our Story</h2>
          <div className="space-y-4 leading-relaxed text-muted-foreground">
            <p>
              {storeConfig.name} started with a simple idea: shopping online should be easy, honest and enjoyable. We bring
              together products we&apos;d happily use ourselves — from tech and fashion to home essentials.
            </p>
            <p>
              We work directly with trusted brands and suppliers, so you get great quality at a fair price, shipped quickly
              and backed by a no-fuss returns policy.
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-medium tracking-tight">What We Stand For</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {values.map((v) => (
              <div key={v.title}>
                <h3 className="text-base font-medium text-foreground">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-16 rounded-lg border border-border bg-secondary/30 p-8 text-center">
        <h2 className="text-2xl font-medium tracking-tight">Want to learn more?</h2>
        <p className="mt-2 text-muted-foreground">Explore our products or get in touch — we&apos;d love to hear from you.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/products"
            className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-8 font-medium text-background transition-all hover:bg-foreground/90"
          >
            Shop products
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-11 items-center justify-center rounded-full border border-border px-8 font-medium transition-colors hover:bg-secondary"
          >
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}
