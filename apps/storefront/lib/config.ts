/** Store-wide settings. Change the name, copy and currency here. */
export const storeConfig = {
  name: "Tech Commerce",
  tagline: "The tech we'd buy ourselves.",
  description:
    "An independent tech shop for laptops, phones, audio, wearables and smart home gear — every product tested by our team and shipped within 1–3 business days.",
  currency: "USD",
  locale: "en-US",
  freeShippingThreshold: 7500, // in cents
  supportEmail: "support@techcommerce.example",
} as const;
