import type { Brand, Category, Collection, Product, Review, Variant, VariantOption } from "@b2c/types";

/**
 * Mock catalog shared by the storefront and admin until apps/server exists.
 * Images are clean studio shots from Unsplash (plain backgrounds, no third-party logos).
 * Swap them for your own product photography before launch.
 */
const img = (id: string, w = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const categories: Category[] = [
  { slug: "electronics", name: "Audio & Tech", description: "Headphones and wearables we actually use every day." },
  { slug: "audio", name: "Headphones", description: "Wireless and wired headphones, tuned for long listening sessions.", parent: "electronics" },
  { slug: "wearables", name: "Smartwatches", description: "Fitness and everyday smartwatches.", parent: "electronics" },
  { slug: "fashion", name: "Clothing & Shoes", description: "Well-made basics and shoes built to be worn often." },
  { slug: "footwear", name: "Shoes", description: "Running shoes and leather-soled classics.", parent: "fashion" },
  { slug: "apparel", name: "Tees & Tops", description: "Heavyweight cotton that holds its shape.", parent: "fashion" },
  { slug: "accessories", name: "Bags & Accessories", description: "Backpacks, totes, watches and sunglasses." },
  { slug: "home", name: "Home & Kitchen", description: "Stoneware, drinkware and easy-care plants." },
];

export const collections: Collection[] = [
  {
    slug: "new-arrivals",
    name: "New Arrivals",
    description: "Just landed this season — restocks and first drops.",
    image: img("1441986300917-64674bd600d8", 1600),
  },
  {
    slug: "best-sellers",
    name: "Best Sellers",
    description: "The pieces customers reorder and recommend the most.",
    image: img("1546435770-a3e426bf472b", 1600),
  },
  {
    slug: "gift-guide",
    name: "Gift Guide",
    description: "Easy wins for birthdays, holidays and thank-yous.",
    image: img("1513885535751-8b9238bd345a", 1600),
  },
];

export const brands: Brand[] = [
  { slug: "fieldtone", name: "Fieldtone Audio" },
  { slug: "lund-hale", name: "Lund & Hale" },
  { slug: "carrow", name: "Carrow Eyewear" },
  { slug: "westbrook", name: "Westbrook Supply Co." },
  { slug: "stillwater", name: "Stillwater Pottery" },
  { slug: "fern-field", name: "Fern & Field" },
];

let reviewSeq = 0;
/** One review written for a specific product. */
const r = (author: string, rating: number, createdAt: string, content: string, verified = true): Review => ({
  id: `rev-${++reviewSeq}`,
  author,
  rating,
  content,
  verified,
  createdAt,
});

type VariantInput = {
  options?: VariantOption[];
  price: number;
  compareAtPrice?: number;
  stock?: number | null;
  images?: string[];
};

/** SKUs look like FT-ANC700-01, FT-ANC700-02… */
const variants = (sku: string, list: VariantInput[]): Variant[] =>
  list.map((v, i) => ({
    id: `${sku.toLowerCase()}-v${i + 1}`,
    sku: `${sku}-${String(i + 1).padStart(2, "0")}`,
    price: v.price,
    compareAtPrice: v.compareAtPrice,
    stock: v.stock === undefined ? 24 : v.stock,
    images: v.images ?? [],
    options: v.options ?? [],
  }));

const color = (value: string, swatch: string): VariantOption => ({ name: "Color", kind: "color", value, swatch });
const size = (value: string): VariantOption => ({ name: "Size", kind: "text", value });

// image ids
const I = {
  ancGraphite: img("1546435770-a3e426bf472b"),
  ancSilver: img("1583394838336-acd977736f90"),
  studio50: img("1572536147248-ac59a8abfa4b"),
  pulseFront: img("1546868871-7041f2a55e12"),
  pulseAngle: img("1617043786394-f977fa12eddf"),
  nordic38: img("1523275335684-37898b6baf30"),
  ellis: img("1511499767150-a48a237f0083"),
  runner: img("1491553895911-0055eca6402d"),
  wingtip: img("1560343090-f0409e92791a"),
  daypack: img("1553062407-98eeb64c6a62"),
  rucksack: img("1622560480605-d83c853bc5c3"),
  tote: img("1544816155-12df9643f363"),
  tee: img("1618354691373-d851c5c3a990"),
  mug: img("1514228742587-6b1558fcca3d"),
  bottle: img("1602143407151-7111542de6e8"),
  haworthia: img("1485955900006-10f4d324d411"),
  cactus: img("1459411552884-841db9b3cc2a"),
};

export const products: Product[] = [
  {
    id: "p1",
    slug: "fieldtone-anc-700-wireless-headphones",
    name: "Fieldtone ANC 700 Wireless Headphones",
    summary:
      "Over-ear headphones with hybrid noise cancelling, 38 hours of battery and memory-foam cushions that stay comfortable on long-haul flights.",
    details: [
      "Hybrid ANC with 6 microphones; Transparency mode on the left earcup.",
      "38 h battery with ANC on, 52 h with it off. 10 min of USB-C charging gives about 6 h.",
      "Bluetooth 5.3 with multipoint — stays connected to your laptop and phone at once.",
      "Weighs 254 g. Folds flat into the included hard case.",
    ],
    images: [I.ancGraphite, I.ancSilver],
    category: "audio",
    collections: ["best-sellers", "gift-guide"],
    brand: "fieldtone",
    variants: variants("FT-ANC700", [
      { options: [color("Graphite", "#4A4D52")], price: 24900, compareAtPrice: 27900, stock: 31, images: [I.ancGraphite] },
      { options: [color("Silver", "#C9CBCF")], price: 24900, compareAtPrice: 27900, stock: 4, images: [I.ancSilver] },
    ]),
    createdAt: "2026-04-18",
    rank: 1,
    reviews: [
      r("Daniel K.", 5, "2026-10-21", "Used them on a 14 hour flight to Seoul and forgot they were on. ANC isn't quite Bose level on engine rumble but it's close for a lot less money."),
      r("Priya S.", 4, "2026-10-02", "Sound is warm and the app EQ is actually useful. Only gripe is the touch controls — I pause music by accident when adjusting them."),
      r("Marcus L.", 5, "2026-09-14", "Multipoint works properly, which is all I wanted. Laptop for calls, phone for music, no re-pairing."),
      r("Hannah W.", 4, "2026-08-30", "Comfortable for 3-4 hours, after that they get a bit warm. Battery is ridiculous, I charge them maybe once every 10 days."),
      r("Tom B.", 3, "2026-08-11", "Good headphones but the silver scuffs easily. Get the graphite.", false),
    ],
  },
  {
    id: "p2",
    slug: "fieldtone-studio-50-wired-headphones",
    name: "Fieldtone Studio 50 Wired Headphones",
    summary: "Closed-back wired headphones with 40 mm drivers and a flat, honest sound for editing, mixing and late-night listening.",
    details: [
      "40 mm neodymium drivers, 32 Ω — loud enough straight from a phone or laptop.",
      "1.2 m cable with inline mic and a 3.5 mm plug (6.35 mm adapter included).",
      "Swivelling earcups for one-ear monitoring.",
      "No battery, no app, no pairing.",
    ],
    images: [I.studio50],
    category: "audio",
    collections: ["new-arrivals"],
    brand: "fieldtone",
    variants: variants("FT-STU50", [{ price: 8900, stock: 18 }]),
    createdAt: "2026-09-29",
    rank: 6,
    reviews: [
      r("Leo M.", 5, "2026-10-25", "Bought these for podcast editing. Neutral enough that I can hear mouth clicks and room noise I was missing on earbuds."),
      r("Grace T.", 4, "2026-10-08", "Great value. Clamp force is a little tight the first week, loosened up after that."),
      r("Owen R.", 4, "2026-09-30", "Cable isn't detachable which is my only complaint at this price."),
    ],
  },
  {
    id: "p3",
    slug: "fieldtone-pulse-2-smartwatch",
    name: "Fieldtone Pulse 2 Smartwatch",
    summary: "A lightweight aluminium smartwatch with built-in GPS, sleep tracking and a bright AMOLED screen that lasts 6 days between charges.",
    details: [
      "1.78″ always-on AMOLED display, 1,000 nits peak brightness.",
      "Dual-band GPS, heart rate, SpO₂ and sleep stages.",
      "Water resistant to 5 ATM — fine for pool swimming.",
      "Works with iPhone and Android. Magnetic charger included.",
    ],
    images: [I.pulseFront, I.pulseAngle],
    category: "wearables",
    collections: ["new-arrivals", "gift-guide"],
    brand: "fieldtone",
    variants: variants("FT-PLS2", [
      { options: [size("41 mm")], price: 19900, stock: 12 },
      { options: [size("45 mm")], price: 22900, stock: 9 },
    ]),
    createdAt: "2026-10-14",
    rank: 3,
    reviews: [
      r("Sofia R.", 5, "2026-10-28", "GPS locks on in a few seconds and my 10k route matched my old Garmin within 40 m. Very happy."),
      r("James P.", 4, "2026-10-19", "Battery is closer to 4-5 days with always-on display but still better than my last watch."),
      r("Aisha M.", 3, "2026-10-17", "Hardware is great, the companion app needs work. Sleep data sometimes doesn't sync until I open it twice."),
    ],
  },
  {
    id: "p4",
    slug: "lund-hale-nordic-38-watch",
    name: "Lund & Hale Nordic 38 Watch, White",
    summary: "A clean 38 mm quartz watch with a matte white dial, sapphire crystal and a soft white leather strap. Small enough to suit most wrists.",
    details: [
      "38 mm brushed steel case, 7.5 mm thin.",
      "Sapphire crystal and Japanese Miyota quartz movement.",
      "Italian leather strap with quick-release pins — swaps in seconds.",
      "Water resistant to 3 ATM (splashes and rain, not swimming).",
    ],
    images: [I.nordic38],
    category: "accessories",
    collections: ["best-sellers", "gift-guide"],
    brand: "lund-hale",
    variants: variants("LH-NRD38", [{ price: 16500, stock: 14 }]),
    createdAt: "2026-03-05",
    rank: 2,
    reviews: [
      r("Emily C.", 5, "2026-09-22", "Bought as an anniversary gift. Looks much more expensive than it is and the box is lovely."),
      r("Noah F.", 4, "2026-09-03", "White strap shows marks after a few weeks. I ordered a tan strap as well and switch between them."),
      r("Mia G.", 5, "2026-07-16", "Thin enough to fit under a shirt cuff. Perfect everyday watch."),
      r("Ben A.", 5, "2026-06-09", "Second one I've bought — first went to my sister."),
    ],
  },
  {
    id: "p5",
    slug: "carrow-ellis-round-sunglasses",
    name: "Carrow Ellis Round Sunglasses",
    summary: "Thin gold metal frames with polarized green lenses. A classic round shape that suits most face shapes.",
    details: [
      "Polarized CR-39 lenses with UV400 protection.",
      "Lightweight stainless steel frame — 19 g.",
      "Adjustable nose pads and spring hinges.",
      "Lens 49 mm · Bridge 21 mm · Temple 145 mm. Hard case and cloth included.",
    ],
    images: [I.ellis],
    category: "accessories",
    collections: ["new-arrivals"],
    brand: "carrow",
    variants: variants("CR-ELLIS", [
      { options: [color("Gold / Green", "#B8975A")], price: 11900, stock: 20 },
      { options: [color("Silver / Grey", "#A8ABB0")], price: 11900, stock: 0 },
    ]),
    createdAt: "2026-05-27",
    rank: 8,
    reviews: [
      r("Chloe D.", 5, "2026-08-14", "Polarized lenses make a huge difference driving. Frames are light and don't pinch."),
      r("Ravi N.", 4, "2026-07-20", "Run slightly small — fine for me but anyone with a wider face might want to check measurements."),
    ],
  },
  {
    id: "p6",
    slug: "westbrook-trail-runner-2",
    name: "Westbrook Trail Runner 2",
    summary: "A lightweight daily trainer with a knit upper, responsive foam midsole and enough grip for gravel paths and wet pavement.",
    details: [
      "Engineered knit upper with a padded heel collar.",
      "Supercritical EVA midsole, 8 mm drop.",
      "Rubber outsole with 3.5 mm lugs.",
      "Weight: 268 g (US 9). True to size.",
    ],
    images: [I.runner],
    category: "footwear",
    collections: ["best-sellers", "new-arrivals"],
    brand: "westbrook",
    variants: variants("WB-TR2", [
      { options: [size("US 8")], price: 13900, stock: 7 },
      { options: [size("US 9")], price: 13900, stock: 11 },
      { options: [size("US 10")], price: 13900, stock: 3 },
      { options: [size("US 11")], price: 13900, stock: 0 },
      { options: [size("US 12")], price: 13900, stock: 5 },
    ]),
    createdAt: "2026-08-21",
    rank: 4,
    reviews: [
      r("Lucas R.", 5, "2026-10-12", "Did my first half marathon in these. No blisters, no hot spots. Already ordered a second pair."),
      r("Jade H.", 4, "2026-09-26", "Comfortable out of the box. Grip is fine on dry trail but slips a bit on wet rocks."),
      r("Kevin O.", 4, "2026-09-08", "Fits true to size. Knit upper breathes well in summer."),
      r("Isabella M.", 2, "2026-09-01", "Sizing ran small for me, had to exchange for a half size up. Exchange was quick though."),
    ],
  },
  {
    id: "p7",
    slug: "westbrook-suede-wingtip-brogues",
    name: "Westbrook Suede Wingtip Brogues, Sage",
    summary: "Goodyear-welted brogues in soft sage suede with a leather sole. Dressy enough for a wedding, relaxed enough for jeans.",
    details: [
      "Calf suede upper, treated for water resistance.",
      "Goodyear-welted — can be resoled.",
      "Leather sole with a rubber heel tip.",
      "Fits half a size large; we recommend sizing down.",
    ],
    images: [I.wingtip],
    category: "footwear",
    collections: ["new-arrivals"],
    brand: "westbrook",
    variants: variants("WB-WNG", [
      { options: [size("US 8")], price: 18500, stock: 4 },
      { options: [size("US 9")], price: 18500, stock: 6 },
      { options: [size("US 10")], price: 18500, stock: 2 },
      { options: [size("US 11")], price: 18500, stock: 3 },
    ]),
    createdAt: "2026-10-03",
    rank: 11,
    reviews: [
      r("Ethan W.", 5, "2026-10-20", "Wore them to my brother's wedding and got asked about them all night. Colour is exactly like the photos."),
      r("Sam P.", 4, "2026-10-11", "Take the advice and size down. Leather sole is slippery for the first week."),
    ],
  },
  {
    id: "p8",
    slug: "westbrook-commuter-daypack-22l",
    name: "Westbrook Commuter Daypack 22L, Navy",
    summary: "A slim 22-litre backpack in recycled nylon with a padded 16″ laptop sleeve and a quick-access front pocket.",
    details: [
      "Fits laptops up to 16″ in a suspended, padded sleeve.",
      "Water-resistant recycled nylon shell.",
      "Luggage pass-through on the back panel.",
      "47 × 30 × 14 cm · 0.82 kg.",
    ],
    images: [I.daypack],
    category: "accessories",
    collections: ["best-sellers"],
    brand: "westbrook",
    variants: variants("WB-DAY22", [{ price: 9800, stock: 26 }]),
    createdAt: "2026-02-12",
    rank: 5,
    reviews: [
      r("Olivia M.", 5, "2026-09-18", "Fits my 16 inch MacBook, charger, lunch and a jumper. Doesn't look bulky on the train."),
      r("Liam J.", 4, "2026-08-24", "Good bag. Wish the water bottle pocket was a bit deeper."),
      r("Zara K.", 5, "2026-07-02", "Got caught in a proper downpour and everything inside stayed dry."),
    ],
  },
  {
    id: "p9",
    slug: "westbrook-leather-rucksack-chestnut",
    name: "Westbrook Leather Rucksack, Chestnut",
    summary: "Full-grain leather backpack that darkens and softens with every year of use. Fits a 15″ laptop and a weekend's worth of clothes.",
    details: [
      "Full-grain cowhide with a cotton twill lining.",
      "Padded 15″ laptop compartment and two interior zip pockets.",
      "Antique brass YKK zips.",
      "43 × 31 × 15 cm · 1.4 kg.",
    ],
    images: [I.rucksack],
    category: "accessories",
    collections: ["gift-guide"],
    brand: "westbrook",
    variants: variants("WB-RUCK", [{ price: 24500, compareAtPrice: 28500, stock: 6 }]),
    createdAt: "2026-01-28",
    rank: 9,
    reviews: [
      r("Henry C.", 5, "2026-08-02", "Smells amazing and the leather is thick. Heavier than a nylon bag, but that's the point."),
      r("Amelia G.", 4, "2026-06-15", "Beautiful bag. Straps needed a few days to soften."),
    ],
  },
  {
    id: "p10",
    slug: "westbrook-heavy-canvas-market-tote",
    name: "Westbrook Heavy Canvas Market Tote",
    summary: "An unlined 16 oz cotton canvas tote with long handles that sit comfortably on the shoulder — for groceries, the beach or the library.",
    details: ["16 oz natural cotton canvas.", "Reinforced box-stitched handles, 60 cm drop.", "Holds up to 15 kg.", "38 × 42 × 12 cm. Machine washable cold."],
    images: [I.tote],
    category: "accessories",
    collections: ["gift-guide"],
    brand: "westbrook",
    variants: variants("WB-TOTE", [{ price: 3800, stock: 52 }]),
    createdAt: "2026-06-30",
    rank: 14,
    reviews: [
      r("Nora B.", 5, "2026-09-09", "Carried two watermelons home in it. No complaints."),
      r("Felix D.", 4, "2026-08-19", "Sturdy. Would love an inner pocket for keys."),
    ],
  },
  {
    id: "p11",
    slug: "westbrook-heavyweight-tee-black",
    name: "Westbrook 240gsm Heavyweight Tee, Black",
    summary: "A boxy, heavyweight cotton tee with a small chest print. Thick enough that it doesn't cling, soft enough to wear all day.",
    details: [
      "100% combed cotton, 240 gsm, garment-dyed.",
      "Boxy fit with dropped shoulders — size down for a regular fit.",
      "Pre-shrunk. Wash cold, hang dry.",
      "Model is 183 cm and wears a size M.",
    ],
    images: [I.tee],
    category: "apparel",
    collections: ["new-arrivals", "best-sellers"],
    brand: "westbrook",
    variants: variants("WB-TEE240", [
      { options: [size("S")], price: 4200, stock: 15 },
      { options: [size("M")], price: 4200, stock: 22 },
      { options: [size("L")], price: 4200, stock: 9 },
      { options: [size("XL")], price: 4200, stock: 2 },
    ]),
    createdAt: "2026-10-09",
    rank: 7,
    reviews: [
      r("Jack T.", 5, "2026-10-27", "Finally a tee that doesn't go see-through after five washes. Bought three."),
      r("Ella S.", 4, "2026-10-15", "Really boxy — I sized down and it's perfect."),
      r("Mateo V.", 5, "2026-10-13", "The weight is what sells it. Feels like a proper garment."),
    ],
  },
  {
    id: "p12",
    slug: "stillwater-stoneware-mug-chalk",
    name: "Stillwater Stoneware Mug, Chalk White",
    summary: "A 12 oz wheel-thrown stoneware mug with a satin chalk glaze and a handle big enough for two fingers.",
    details: [
      "350 ml / 12 oz. Each one is thrown by hand, so sizes vary slightly.",
      "Satin glaze, food safe and lead free.",
      "Dishwasher and microwave safe.",
      "Made in small batches in Portland, Oregon.",
    ],
    images: [I.mug],
    category: "home",
    collections: ["gift-guide", "best-sellers"],
    brand: "stillwater",
    variants: variants("SW-MUG12", [
      { options: [{ name: "Pack", kind: "text", value: "Single" }], price: 2600, stock: 40 },
      { options: [{ name: "Pack", kind: "text", value: "Set of 2" }], price: 4800, stock: 18 },
    ]),
    createdAt: "2026-01-15",
    rank: 10,
    reviews: [
      r("Charlotte F.", 5, "2026-10-04", "Heavier than it looks in a good way. Keeps tea warm noticeably longer than my old mugs."),
      r("Dev P.", 5, "2026-09-12", "Bought the set of two for my parents. They use them every morning."),
      r("Ruby L.", 4, "2026-08-08", "Lovely glaze. Mine is a touch smaller than my partner's — handmade, so expected."),
    ],
  },
  {
    id: "p13",
    slug: "stillwater-insulated-bottle-500ml-juniper",
    name: "Stillwater 500 ml Insulated Bottle, Juniper",
    summary: "A double-walled stainless steel bottle with a powder-coat finish. Keeps water cold for 24 hours and coffee hot for 10.",
    details: [
      "500 ml / 17 oz, 18/8 stainless steel.",
      "Leak-proof screw cap — fine to throw in a bag.",
      "Powder coat won't sweat or slip.",
      "Fits most car cup holders. Hand wash only.",
    ],
    images: [I.bottle],
    category: "home",
    collections: ["best-sellers"],
    brand: "stillwater",
    variants: variants("SW-BTL500", [
      { options: [color("Juniper", "#5E7D63")], price: 3495, stock: 33, images: [I.bottle] },
      { options: [color("Chalk", "#EEEBE4")], price: 3495, stock: 12 },
      { options: [color("Charcoal", "#3B3D40")], price: 3495, stock: 0 },
    ]),
    createdAt: "2026-05-06",
    rank: 12,
    reviews: [
      r("Maya J.", 5, "2026-09-27", "Left it in a hot car all afternoon and the ice was still there. Colour is a lovely muted green."),
      r("Adam S.", 3, "2026-08-21", "Works well, but the paint chipped when I dropped it on concrete."),
      r("Lily H.", 5, "2026-07-30", "Doesn't leak in my bag, which is the only thing I care about."),
    ],
  },
  {
    id: "p14",
    slug: "fern-field-haworthia-ceramic-planter",
    name: "Fern & Field Haworthia in 4″ Mint Planter",
    summary: "A compact zebra haworthia that's happy on a desk or windowsill, potted in a glazed mint ceramic planter with a drainage hole.",
    details: [
      "Plant height approx. 12–15 cm.",
      "4″ glazed ceramic planter with drainage hole and saucer.",
      "Bright, indirect light. Water every 2–3 weeks.",
      "Pet friendly — non-toxic to cats and dogs.",
    ],
    images: [I.haworthia],
    category: "home",
    collections: ["new-arrivals", "gift-guide"],
    brand: "fern-field",
    variants: variants("FF-HAW4", [{ price: 3200, stock: 17 }]),
    createdAt: "2026-09-16",
    rank: 13,
    reviews: [
      r("Isla W.", 5, "2026-10-18", "Arrived well packed with no soil spilled. Pot colour is even nicer in person."),
      r("Theo B.", 4, "2026-10-01", "Healthy plant, a little smaller than I expected."),
    ],
  },
  {
    id: "p15",
    slug: "fern-field-golden-barrel-cactus",
    name: "Fern & Field Golden Barrel Cactus, Terracotta",
    summary: "A small golden barrel cactus in an unglazed terracotta pot. Almost impossible to kill — perfect for a sunny shelf.",
    details: [
      "Plant height approx. 8–10 cm.",
      "3.5″ terracotta pot with drainage hole.",
      "Full sun to bright light. Water once a month.",
      "Ships with care instructions.",
    ],
    images: [I.cactus],
    category: "home",
    collections: ["gift-guide"],
    brand: "fern-field",
    variants: variants("FF-CAC35", [{ price: 2400, stock: 3 }]),
    createdAt: "2026-07-11",
    rank: 15,
    reviews: [
      r("Zoe A.", 5, "2026-09-05", "Bought for my office desk. Three months in and still alive, which is a record for me."),
      r("Ryan K.", 4, "2026-08-13", "Cute. Wrap it carefully when repotting — those spines are real."),
    ],
  },
];
