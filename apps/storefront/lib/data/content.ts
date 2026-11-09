import type { BlogPost, LegalPage } from "@/lib/types";

const img = (id: string, w = 1600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const legalPages: LegalPage[] = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    updatedAt: "2026-10-01",
    sections: [
      { heading: "What we collect", body: "We collect the information you give us when you place an order, create an account or contact us — such as your name, email, shipping address and order history." },
      { heading: "How we use it", body: "We use your information to process orders, provide customer support, and — only if you opt in — send you marketing emails. We never sell your personal data." },
      { heading: "Your rights", body: "You can request a copy of your data, ask us to correct it, or ask us to delete it at any time by contacting our support team." },
    ],
  },
  {
    slug: "terms-of-service",
    title: "Terms of Service",
    updatedAt: "2026-10-01",
    sections: [
      { heading: "Using our store", body: "By using this website you agree to these terms. Please read them carefully before placing an order." },
      { heading: "Orders and pricing", body: "All prices are shown in USD. We reserve the right to cancel an order if a product is listed at an incorrect price due to an error." },
      { heading: "Liability", body: "Our liability is limited to the value of the products purchased, to the extent permitted by law." },
    ],
  },
  {
    slug: "shipping-returns",
    title: "Shipping & Returns",
    updatedAt: "2026-10-01",
    sections: [
      { heading: "Shipping", body: "Orders ship within 1–3 business days. Standard shipping is free on orders over $75." },
      { heading: "Returns", body: "Not quite right? Return unused items in their original packaging within 30 days of delivery for a full refund." },
      { heading: "Exchanges", body: "Need a different size or color? Start a return and place a new order — we'll process both as quickly as possible." },
    ],
  },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "setting-up-a-calm-cable-free-desk",
    title: "Setting up a calm, cable-free desk",
    excerpt: "The keyboard, mouse and headphones that made working from home quieter.",
    image: img("1541807084-5c52b6b3adef"),
    author: "The Tech Commerce Team",
    publishedAt: "2026-10-12",
    readingMinutes: 6,
    body: [
      "Your desk shapes your workday. Fewer cables, a keyboard you enjoy typing on and headphones that block out the room make a bigger difference than any productivity app.",
      "Start with wireless peripherals that switch between devices with one key, so your laptop and tablet share the same keyboard and mouse.",
      "Then add noise-cancelling headphones with multipoint Bluetooth — calls on the laptop, music from your phone, no re-pairing.",
    ],
    productSlugs: ["quill-65-mechanical-keyboard", "quill-glide-wireless-mouse", "fieldtone-anc-700-wireless-headphones"],
  },
  {
    slug: "do-you-really-need-a-flagship-phone",
    title: "Do you really need a flagship phone?",
    excerpt: "What you give up — and what you don't — with a mid-range phone in 2026.",
    image: img("1546054454-aa26e2b734c7"),
    author: "The Tech Commerce Team",
    publishedAt: "2026-09-28",
    readingMinutes: 5,
    body: [
      "Mid-range phones have quietly caught up. OLED screens, 120 Hz refresh rates and 50 MP cameras are now standard well under the flagship price.",
      "What you still give up: the very best low-light zoom and the fastest chips. What you don't: years of software updates, which matter more for how long a phone lasts.",
      "If you mostly message, browse and take photos in daylight, a mid-range phone with long update support is the smarter buy.",
    ],
    productSlugs: ["arclight-one-5g", "arclight-tab-11-with-pen", "fieldtone-air-buds-2"],
  },
  {
    slug: "tech-gift-ideas-under-100",
    title: "10 tech gift ideas under $100",
    excerpt: "Earbuds, keyboards and smart speakers that people actually use.",
    image: img("1600294037681-c80b4cb5b434"),
    author: "The Tech Commerce Team",
    publishedAt: "2026-09-05",
    readingMinutes: 4,
    body: [
      "The best tech gifts are the ones that get used every day, not the gadgets that end up in a drawer.",
      "For the commuter, wired USB-C earphones or a smart speaker for the kitchen. For the gamer, a controller with drift-proof sticks.",
      "And for anyone who works at a desk, a silent wireless mouse is a small upgrade they'll notice every single day.",
    ],
    productSlugs: ["haven-mini-smart-speaker", "vantage-pro-wireless-controller", "quill-glide-wireless-mouse"],
  },
];

export type FaqCategory = { id: string; title: string; questions: { question: string; answer: string }[] };

export const faqCategories: FaqCategory[] = [
  {
    id: "orders",
    title: "Orders",
    questions: [
      { question: "How do I place an order?", answer: "Find the products you love, add them to your cart and head to checkout. We'll guide you through each step." },
      { question: "Can I change or cancel my order?", answer: "If your order hasn't shipped yet, contact us as soon as possible and we'll do our best to update or cancel it." },
      { question: "How long does processing take?", answer: "Most orders are packed and shipped within 1–3 business days. You'll get an email with tracking as soon as yours is on its way." },
    ],
  },
  {
    id: "payments",
    title: "Payments",
    questions: [
      { question: "Which payment methods do you accept?", answer: "We accept Visa, Mastercard, American Express, Apple Pay and Google Pay." },
      { question: "Is checkout secure?", answer: "Yes. All payments are encrypted and processed by a PCI-compliant payment provider. We never store your full card number." },
      { question: "When will I be charged?", answer: "Your card is charged when you place your order." },
    ],
  },
  {
    id: "shipping",
    title: "Shipping & Delivery",
    questions: [
      { question: "How much does shipping cost?", answer: "Standard shipping is free on orders over $75. Below that, shipping is calculated at checkout." },
      { question: "Do you ship internationally?", answer: "We currently ship to the US, Canada, the UK and most of Europe. Rates are shown at checkout." },
      { question: "How do I track my order?", answer: "You'll receive a tracking link by email as soon as your order ships." },
    ],
  },
  {
    id: "returns",
    title: "Returns & Exchanges",
    questions: [
      { question: "What is your return policy?", answer: "You can return unused items in their original packaging within 30 days of delivery." },
      { question: "How long do refunds take?", answer: "Refunds are issued to your original payment method within 5–10 business days after we receive your return." },
    ],
  },
];
