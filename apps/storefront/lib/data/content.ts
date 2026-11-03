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
    slug: "how-to-build-a-capsule-wardrobe",
    title: "How to build a capsule wardrobe that actually works",
    excerpt: "Fewer pieces, more outfits. Our simple framework for a wardrobe you'll love wearing every day.",
    image: img("1483985988355-763728e1935b"),
    author: "The B2Commerce Team",
    publishedAt: "2026-10-12",
    readingMinutes: 5,
    body: [
      "A capsule wardrobe is a small collection of versatile pieces that all work together. The goal isn't to own less for its own sake — it's to spend less time deciding what to wear and more time enjoying it.",
      "Start with a neutral base: two or three heavyweight tees, one pair of trainers you can walk all day in, and one pair of leather-soled shoes for when it matters. Then add a couple of pieces that are unmistakably you.",
      "Finally, edit regularly. If something hasn't been worn in a season, it's probably not earning its place.",
    ],
    productSlugs: ["westbrook-heavyweight-tee-black", "westbrook-trail-runner-2", "westbrook-suede-wingtip-brogues"],
  },
  {
    slug: "gift-ideas-under-100",
    title: "10 gift ideas under $100",
    excerpt: "Thoughtful presents that feel special without breaking the bank.",
    image: img("1513885535751-8b9238bd345a"),
    author: "The B2Commerce Team",
    publishedAt: "2026-09-28",
    readingMinutes: 4,
    body: [
      "Great gifts don't need to be expensive. The best ones are useful, beautifully made and a little bit personal.",
      "For the coffee drinker, a wheel-thrown stoneware mug gets used every single morning. For the person who has everything, a thin white-dial watch is a quiet upgrade they'll wear daily.",
      "And when in doubt? A small plant in a nice pot — easy to look after and it brightens any desk.",
    ],
    productSlugs: ["stillwater-stoneware-mug-chalk", "lund-hale-nordic-38-watch", "fern-field-haworthia-ceramic-planter"],
  },
  {
    slug: "setting-up-a-cozy-home-office",
    title: "Setting up a cozy home office",
    excerpt: "Small changes that make working from home calmer and more productive.",
    image: img("1524758631624-e2822e304c36"),
    author: "The B2Commerce Team",
    publishedAt: "2026-09-05",
    readingMinutes: 6,
    body: [
      "Your workspace shapes your workday. Natural light, a few plants and good sound can make a surprising difference.",
      "Put a plant where you'll see it, keep a cold bottle of water within reach, and invest in noise-cancelling headphones — the single biggest upgrade if you share your space.",
    ],
    productSlugs: ["fieldtone-anc-700-wireless-headphones", "fern-field-golden-barrel-cactus", "stillwater-insulated-bottle-500ml-juniper"],
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
