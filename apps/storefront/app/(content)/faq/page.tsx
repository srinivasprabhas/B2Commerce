import { Mail } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/common/page-header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@b2c/ui/components/accordion";
import { faqCategories } from "@/lib/data/content";

export const metadata: Metadata = { title: "FAQ", description: "Answers about orders, payments, shipping and returns." };

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <PageHeader
        title="Frequently Asked Questions"
        description="Find answers to the most common questions about orders, payments, shipping and more."
      />

      <nav className="mb-10 flex flex-wrap gap-2">
        {faqCategories.map((category) => (
          <a
            key={category.id}
            href={`#${category.id}`}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            {category.title}
          </a>
        ))}
      </nav>

      <div className="space-y-12">
        {faqCategories.map((category) => (
          <section key={category.id} id={category.id} className="scroll-mt-24">
            <h2 className="mb-4 text-2xl font-medium tracking-tight">{category.title}</h2>
            <Accordion>
              {category.questions.map((item, index) => (
                <AccordionItem key={index} value={`${category.id}-${index}`}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>
                    <p className="leading-relaxed text-muted-foreground">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))}
      </div>

      <div className="mt-16 rounded-lg border border-border bg-secondary/30 p-8 text-center">
        <h2 className="text-2xl font-medium tracking-tight">Still have questions?</h2>
        <p className="mt-2 text-muted-foreground">We&apos;re here to help. Reach out and we&apos;ll get back to you soon.</p>
        <Link href="/contact" className="mt-6 inline-flex items-center gap-2 text-sm font-medium hover:underline">
          <Mail className="h-4 w-4" />
          Contact our support team
        </Link>
      </div>
    </div>
  );
}
