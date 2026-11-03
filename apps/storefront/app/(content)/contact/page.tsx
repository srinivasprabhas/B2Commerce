import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/app/(content)/contact/contact-form";
import { PageHeader } from "@/components/common/page-header";
import { storeConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Contact Us", description: "Questions about an order or a product? We're here to help." };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <PageHeader
        title="Contact Us"
        description="Have a question or just want to say hello? Send us a message and we'll get back to you as soon as we can."
      />
      <ContactForm />
      <p className="mt-10 text-sm text-muted-foreground">
        Prefer email? Write to <span className="font-medium text-foreground">{storeConfig.supportEmail}</span>. Looking for a quick
        answer? Check our{" "}
        <Link href="/faq" className="font-medium text-foreground hover:underline">
          frequently asked questions
        </Link>
        .
      </p>
    </div>
  );
}
