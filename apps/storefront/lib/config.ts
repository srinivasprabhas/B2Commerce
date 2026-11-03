/** Store-wide settings. Change the name, copy and currency here. */
export const storeConfig = {
  name: "B2Commerce",
  tagline: "Good gear, fairly priced.",
  description:
    "An independent shop for headphones, bags, shoes and homeware — every product tested by our team and shipped within 1–3 business days.",
  currency: "USD",
  locale: "en-US",
  freeShippingThreshold: 7500, // in cents
  supportEmail: "support@b2commerce.example",
} as const;
