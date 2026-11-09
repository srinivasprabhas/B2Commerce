import { Check, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BundleBuilder, type BundleItem } from "@/components/home/bundle-builder";
import { FaqAccordion } from "@/components/home/faq-accordion";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { HomeProductCard } from "@/components/home/home-product-card";
import { PhotoFeatures } from "@/components/home/photo-features";
import { ProductTabs } from "@/components/home/product-tabs";
import { Slider, SliderArrows, SliderTrack } from "@/components/home/slider";
import { getAllProducts, getProductsInCollection, listingPrice } from "@/lib/catalog";
import { faqCategories } from "@/lib/data/content";
import { avgRating, categoryCount, productBySlug, tilesFor, toTile } from "@/lib/home";
import { formatMoney } from "@/lib/money";

/* ---------- layout helpers (mirror the UI/index.html prototype) ---------- */
const wrap = "mx-auto max-w-[1660px] px-[clamp(16px,4.2vw,80px)]";
const section = "py-[clamp(64px,7vw,120px)]";
const h2 = "text-[clamp(30px,3.2vw,48px)] leading-[1.12] font-medium tracking-[-0.045em]";
/** Lets a slider run to the right edge of the screen while staying aligned on the left. */
const bleed = "-mr-[clamp(16px,4.2vw,80px)] pr-[clamp(16px,4.2vw,80px)] scroll-pr-[clamp(16px,4.2vw,80px)]";
const btn = "inline-flex h-14 items-center justify-center rounded-full bg-primary px-12 text-[17px] font-medium whitespace-nowrap text-primary-foreground transition-colors hover:bg-primary/90";
const underline = "inline-block border-b-[1.5px] border-current pb-1 text-[17px] font-medium hover:opacity-70";
const u = (id: string, w = 1000) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

/** Take `primary`, then top up from `fallback` (no duplicates) until there are `n`. */
function fillTo<T extends { slug: string }>(n: number, primary: T[], fallback: T[]) {
  const out = primary.slice(0, n);
  for (const p of fallback) {
    if (out.length >= n) break;
    if (!out.some((o) => o.slug === p.slug)) out.push(p);
  }
  return out;
}

export default function Home() {
  const all = getAllProducts();
  const byRank = [...all].sort((a, b) => a.rank - b.rank);
  const onSale = all.filter((p) => listingPrice(p).compareAt);

  const tabs = [
    { key: "hot", label: "What's hot", tiles: fillTo(8, getProductsInCollection("new-arrivals"), byRank).map(toTile) },
    { key: "best", label: "Best sellers", tiles: byRank.slice(0, 8).map(toTile) },
    { key: "sale", label: "Sale", tiles: onSale.slice(0, 8).map(toTile) },
  ];

  const categoriesRow = [
    { slug: "computers", name: "Laptops & Computers", img: "1496181133206-80ce9b88a853" },
    { slug: "audio", name: "Audio", img: "1583394838336-acd977736f90" },
    { slug: "phones", name: "Phones & Tablets", img: "1580910051074-3eb694886505" },
    { slug: "wearables", name: "Wearables", img: "1617043983671-adaadcaa2460" },
    { slug: "smart-home", name: "Smart Home", img: "1543512214-318c7553f230" },
    { slug: "gaming", name: "Gaming", img: "1592840496694-26d035b52b48" },
  ];

  const bundle: BundleItem[] = ["arclight-book-14-pro", "quill-65-mechanical-keyboard", "quill-glide-wireless-mouse"].map((slug) => {
    const p = productBySlug(slug);
    return {
      slug,
      name: p.name,
      image: p.images[0] ?? "",
      variants: p.variants.map((v) => ({
        id: v.id,
        label: v.options.map((o) => o.value).join(" / ") || "Standard",
        price: v.price,
        compareAt: v.compareAtPrice ?? null,
        stock: v.stock,
      })),
    };
  });

  const rails = [
    { title: "Sale up to 30% off", tiles: onSale.map(toTile) },
    { title: "Under $100", tiles: all.filter((p) => listingPrice(p).amount < 10000).map(toTile) },
    { title: "Desk Essentials", tiles: tilesFor(["quill-65-mechanical-keyboard", "quill-k2-slim-wireless-keyboard", "quill-glide-wireless-mouse", "fieldtone-studio-50-wired", "haven-bookshelf-speakers-pair"]) },
  ];

  const core = ["arclight-book-14-pro", "fieldtone-anc-700-wireless-headphones", "quill-65-mechanical-keyboard", "arclight-one-5g", "fieldtone-pulse-2-smartwatch"].map(productBySlug);

  const reviews = all
    .flatMap((p) => p.reviews.filter((r) => r.rating === 5).map((r) => ({ r, p })))
    .sort((a, b) => b.r.createdAt.localeCompare(a.r.createdAt))
    .slice(0, 8);
  const reviewCount = all.reduce((s, p) => s + p.reviews.length, 0);

  const faq = faqCategories.flatMap((c) => c.questions);
  const faqItems = [faq[2], faq[7], faq[3], faq[6], faq[9]].filter((q): q is { question: string; answer: string } => Boolean(q));

  const band = [
    ["New Season Tech", "1600294037681-c80b4cb5b434"],
    ["Upgrade Your Desk", "1625948515291-69613efd103f"],
    ["Tested By Us", "1546435770-a3e426bf472b"],
    ["Built To Last", "1546868871-7041f2a55e12"],
  ] as const;

  return (
    <>
      <HeroCarousel />

      {/* ---------- Product tabs ---------- */}
      <section className={section}>
        <div className={wrap}>
          <ProductTabs tabs={tabs} />
        </div>
      </section>

      {/* ---------- Shop by category ---------- */}
      <section className={`${section} bg-secondary`}>
        <Slider className={`${wrap} grid items-start gap-[clamp(28px,4vw,80px)] lg:grid-cols-[minmax(280px,28%)_1fr]`}>
          <div className="lg:pt-5">
            <p className="text-lg">Shop By Category</p>
            <h2 className={`${h2} mt-7 mb-8`}>Everything for work, play and home</h2>
            <p className="mb-8 max-w-[430px] text-[17px] lg:mb-28">Laptops, phones, audio and smart home gear — every product tested by our team before it goes on sale.</p>
            <SliderArrows />
          </div>
          <SliderTrack className={`auto-cols-[78%] gap-6 sm:auto-cols-[45%] lg:auto-cols-[minmax(300px,40%)] lg:gap-9 ${bleed}`}>
            {categoriesRow.map((c) => (
              <Link key={c.slug} href={`/category/${c.slug}`} className="group block overflow-hidden rounded-[20px] bg-background">
                <div className="relative aspect-[1.13] overflow-hidden">
                  <Image src={u(c.img, 900)} alt={c.name} fill sizes="(max-width: 1024px) 78vw, 30vw" className="object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <div className="flex items-center justify-between gap-3 px-6 py-7">
                  <div>
                    <h3 className="text-2xl font-medium tracking-[-0.03em] sm:text-[27px]">{c.name}</h3>
                    <p className="text-lg text-muted-foreground">{categoryCount(c.slug)} items</p>
                  </div>
                  <span className="grid size-14 shrink-0 place-items-center rounded-full bg-[#e9ecf1] transition duration-300 group-hover:rotate-45 group-hover:bg-primary group-hover:text-primary-foreground">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                      <path d="M7 17 17 7M8 7h9v9" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </SliderTrack>
        </Slider>
      </section>

      {/* ---------- Bundle ---------- */}
      <section className={section}>
        <div className={`${wrap} grid items-center gap-[clamp(32px,5vw,96px)] lg:grid-cols-2`}>
          <div className="relative aspect-[1/1.03] overflow-hidden rounded-[20px] bg-[linear-gradient(160deg,#dfe7f3_0%,#c9d6ea_100%)]" aria-label="Desk setup bundle">
            <div className="absolute inset-x-0 bottom-0 h-[34%] bg-[#b7c6de]" />
            {[
              { src: bundle[0]!.image, style: "left-[9%] top-[14%] w-[52%] aspect-[1.25]", n: 1, dot: "left-[44%] top-[24%]" },
              { src: bundle[1]!.image, style: "right-[8%] top-[30%] w-[34%] aspect-square", n: 2, dot: "right-[12%] top-[33%]" },
              { src: bundle[2]!.image, style: "left-[28%] bottom-[9%] w-[30%] aspect-square", n: 3, dot: "left-[52%] bottom-[30%]" },
            ].map((b) => (
              <div key={b.n}>
                <div className={`absolute z-10 overflow-hidden rounded-[18px] bg-white shadow-[0_30px_50px_rgba(18,31,55,.18)] ${b.style}`}>
                  <Image src={b.src} alt="" fill sizes="30vw" className="object-cover" />
                </div>
                <span className={`absolute z-20 grid size-11 animate-pulse place-items-center rounded-full bg-white text-lg font-medium ${b.dot}`}>{b.n}</span>
              </div>
            ))}
          </div>
          <div className="mx-auto w-full max-w-[660px] text-center">
            <p className="text-lg">Shop Desk Setup</p>
            <h2 className={`${h2} mt-6 mb-12`}>Level up your workspace with the bundle</h2>
            <BundleBuilder items={bundle} />
          </div>
        </div>
      </section>

      {/* ---------- Featured by press ---------- */}
      <section className="pt-5 pb-[clamp(64px,7vw,120px)]">
        <div className={wrap}>
          <h2 className={`${h2} mb-20 text-center`}>Featured by Press</h2>
          <div className="grid gap-14 text-center md:grid-cols-3 md:gap-10">
            {[
              { logo: <span className="font-serif text-[34px] leading-[.95]">Commuter<br />&amp;Gear.</span>, quote: "“The ANC 700 is the best-value noise-cancelling headphone we tried this year.”" },
              { logo: <span className="font-mono text-2xl leading-tight font-bold tracking-[.06em]">THE SETUP<small className="mt-1 block text-[10px] tracking-[.3em]">DESK · TECH · REVIEWS</small></span>, quote: "“Great product line. Very attentive support team to deal with.”" },
              { logo: <span className="font-serif text-[32px] leading-[.9] tracking-[.02em] uppercase">Small<br />Shop<small className="mt-1.5 block font-sans text-[10px] tracking-[.3em]">Report</small></span>, quote: "“Looking to affordably upgrade your desk? Look no further than Tech Commerce.”" },
            ].map((p) => (
              <div key={p.quote}>
                <div className="mb-9 grid h-[84px] place-items-center">{p.logo}</div>
                <p className="mx-auto max-w-[470px] text-[21px]">{p.quote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <hr className="border-border" />

      {/* ---------- Hot this week ---------- */}
      <section className={section}>
        <Slider className={wrap}>
          <div className="mb-10 flex items-center justify-between gap-5">
            <h2 className={h2}>Hot this week</h2>
            <SliderArrows />
          </div>
          <SliderTrack className={`auto-cols-[88%] gap-3.5 lg:auto-cols-[75%] ${bleed}`}>
            {[
              { bg: "#e3eaf5", eyebrow: "The Gaming Shop", title: "Game Night, Upgraded", text: "Low-latency controllers with hall-effect sticks that won't drift.", cta: "Shop Gaming", href: "/category/gaming", img: "1592840496694-26d035b52b48", blend: true },
              { bg: "#ebe7f4", eyebrow: "The Smart Home Shop", title: "Make Home Smarter", text: "Voice-controlled speakers that fill the room and run your lights.", cta: "Shop Smart Home", href: "/category/smart-home", img: "1543512214-318c7553f230", blend: true },
              { bg: "#e4efed", eyebrow: "The Adventure Shop", title: "Fly Higher", text: "Kestrel Air 4K — 34 minutes of flight and a 3-axis gimbal.", cta: "Shop Drones", href: "/category/drones", img: "1473968512647-3e447244af8f", blend: false },
            ].map((h) => (
              <article key={h.title} className="grid min-h-[clamp(420px,34vw,680px)] overflow-hidden rounded-[20px] lg:grid-cols-2" style={{ background: h.bg }}>
                <div className="flex flex-col items-start justify-center p-[clamp(32px,5vw,72px)]">
                  <p className="text-lg">{h.eyebrow}</p>
                  <h3 className="mt-7 mb-8 text-[clamp(36px,3.6vw,60px)] leading-[1.1] font-medium tracking-[-0.05em]">{h.title}</h3>
                  <p className="mb-11 max-w-[400px] text-[21px]">{h.text}</p>
                  <Link href={h.href} className={btn}>
                    {h.cta}
                  </Link>
                </div>
                <div className="relative h-80 lg:h-auto">
                  <Image src={u(h.img, 1000)} alt="" fill sizes="(max-width: 1024px) 88vw, 38vw" className={`object-cover ${h.blend ? "mix-blend-multiply" : ""}`} />
                </div>
              </article>
            ))}
          </SliderTrack>
        </Slider>
      </section>

      {/* ---------- Benefit pills + statement ---------- */}
      <section className="pb-[clamp(64px,7vw,120px)]">
        <div className={wrap}>
          <ul className="flex flex-wrap justify-center gap-3.5">
            {["Free Shipping", "1-Year Warranty", "Flexible Payment", "Online Support", "Return within 30 days"].map((t) => (
              <li key={t} className="inline-flex h-[52px] items-center gap-3.5 rounded-full border border-border pr-5 pl-3.5 text-base sm:h-[62px] sm:text-[19px]">
                <span className="grid size-[34px] place-items-center rounded-full bg-secondary">
                  <Check className="size-4" strokeWidth={2.4} />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-[clamp(56px,6vw,100px)] text-center">
            <h2 className="mx-auto mb-11 max-w-[900px] text-[clamp(32px,3.4vw,52px)] leading-[1.12] font-medium tracking-[-0.045em]">
              Because the tech you use every day should be the best you own.
            </h2>
            <Link href="/products" className={underline}>
              Shop All Products
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Tall promo + product rails ---------- */}
      <section className="pb-[clamp(64px,7vw,120px)]">
        <div className={`${wrap} grid items-start gap-[clamp(32px,3.6vw,60px)] lg:grid-cols-2`}>
          <div className="relative isolate h-[640px] overflow-hidden rounded-[20px] text-center text-white lg:sticky lg:top-28 lg:h-[min(86vh,1120px)] lg:min-h-[640px]">
            <Image src={u("1541807084-5c52b6b3adef", 1200)} alt="Laptop on a wooden desk" fill sizes="(max-width: 1024px) 100vw, 50vw" className="-z-20 object-cover" />
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(16,40,84,.92)_0%,rgba(16,40,84,.55)_34%,rgba(16,40,84,0)_62%)]" />
            <div className="px-8 pt-20">
              <p className="text-lg">Work From Anywhere</p>
              <h3 className="mt-6 mb-10 text-[clamp(34px,3.2vw,54px)] leading-[1.1] font-medium tracking-[-0.05em]">Built for your desk</h3>
              <Link href="/products" className="inline-flex h-14 items-center rounded-full bg-white px-12 text-[17px] font-medium text-primary transition-colors hover:bg-[#eef2f8]">
                Shop All Products
              </Link>
            </div>
          </div>
          <div className="grid min-w-0 gap-20">
            {rails.map((rail) => (
              <Slider key={rail.title}>
                <div className="mb-10 flex items-center justify-between gap-5">
                  <h3 className="text-[clamp(28px,2.6vw,42px)] leading-[1.12] font-medium tracking-[-0.045em]">{rail.title}</h3>
                  <SliderArrows />
                </div>
                <SliderTrack className="auto-cols-[82%] gap-3.5 sm:auto-cols-[calc(50%-7px)]">
                  {rail.tiles.map((t) => (
                    <HomeProductCard key={t.slug} tile={t} />
                  ))}
                </SliderTrack>
              </Slider>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Image with text ---------- */}
      <section className="pb-[clamp(64px,7vw,120px)]">
        <div className={wrap}>
          <div className="grid min-h-[clamp(520px,50vw,920px)] overflow-hidden rounded-[20px] lg:grid-cols-2">
            <div className="flex flex-col items-center justify-center bg-[#e3eaf5] p-12 text-center">
              <p className="text-lg">Tested By Us</p>
              <h2 className="mt-7 mb-8 max-w-[520px] text-[clamp(40px,4vw,72px)] leading-[1.08] font-medium tracking-[-0.055em]">Made for everyday tech</h2>
              <p className="mb-11 max-w-[520px] text-[21px]">
                Every product in our store is chosen for quality and value, so you can buy with confidence — whether it&apos;s a gift, an upgrade or an everyday essential.
              </p>
              <Link href="/about" className={btn}>
                Shop Now
              </Link>
            </div>
            <div className="relative h-[420px] bg-[#dfe6f0] lg:h-auto">
              <Image src={u("1496181133206-80ce9b88a853", 1300)} alt="Arclight Book 14 Pro on a desk" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- The core products ---------- */}
      <section className="pb-[clamp(64px,7vw,120px)]">
        <Slider className={wrap}>
          <div className="mb-10 flex items-center justify-between gap-5">
            <h2 className={h2}>The core products</h2>
            <SliderArrows />
          </div>
          <SliderTrack className={`auto-cols-[86%] gap-[60px] xl:auto-cols-[calc(50%+120px)] ${bleed}`}>
            {core.map((p) => {
              const price = listingPrice(p);
              return (
                <article key={p.slug} className="grid items-center gap-7 md:grid-cols-2 md:gap-[60px]">
                  <div className="relative aspect-square overflow-hidden rounded-[20px] bg-secondary md:aspect-[.78]">
                    <Image src={p.images[0] ?? ""} alt={p.name} fill sizes="(max-width: 768px) 86vw, 30vw" className="object-cover mix-blend-multiply" />
                  </div>
                  <div>
                    <p className="text-[19px]">{toTile(p).type}</p>
                    <h3 className="mt-6 mb-7 text-[clamp(36px,3.4vw,58px)] leading-[1.08] font-medium tracking-[-0.05em]">{p.name}</h3>
                    <p className="mb-7 text-[26px] font-semibold">
                      <span className={price.compareAt ? "text-[#d63a2f]" : undefined}>
                        {price.from ? "From " : ""}
                        {formatMoney(price.amount)}
                      </span>
                      {price.compareAt && <s className="ml-2.5 font-normal text-muted-foreground">{formatMoney(price.compareAt)}</s>}
                    </p>
                    <p className="mb-14 line-clamp-3 text-[21px]">{p.summary}</p>
                    <Link href={`/product/${p.slug}`} className={btn}>
                      Shop This Product
                    </Link>
                  </div>
                </article>
              );
            })}
          </SliderTrack>
        </Slider>
      </section>

      {/* ---------- Scrolling band ---------- */}
      <div className="marquee overflow-hidden border-y border-border py-7 whitespace-nowrap" aria-hidden>
        <div className="marquee-track items-center gap-16 [animation-duration:46s]">
          {[0, 1, 2, 3].flatMap((k) =>
            band.map(([word, id]) => (
              <span key={`${k}-${word}`} className="inline-flex items-center gap-16">
                <span className="relative size-24 overflow-hidden rounded-full bg-secondary">
                  <Image src={u(id, 200)} alt="" fill sizes="96px" className="object-cover mix-blend-multiply" />
                </span>
                <span className="text-[clamp(30px,3vw,46px)] tracking-[-0.03em]">{word}</span>
              </span>
            )),
          )}
        </div>
      </div>

      {/* ---------- Photos & feature list ---------- */}
      <section className={section}>
        <div className={wrap}>
          <PhotoFeatures
            features={[
              { title: "Tested for 30 days", text: "We use every product on commutes, at our desks and on weekends for at least a month before it goes on the shelf.", images: [u("1541807084-5c52b6b3adef", 900), u("1625948515291-69613efd103f", 900)] },
              { title: "Honest specs, real fit notes", text: "Battery life measured by us, not the box. If something runs warm or loud, we say so on the page.", images: [u("1525547719571-a2d4ac8945e2", 900), u("1546435770-a3e426bf472b", 900)] },
              { title: "Covered for a full year", text: "Every product comes with a 1-year warranty. If something stops working, we'll repair or replace it.", images: [u("1593642632559-0c6d3fc62b89", 900), u("1617043983671-adaadcaa2460", 900)] },
            ]}
          />
        </div>
      </section>

      {/* ---------- Reviews ---------- */}
      <section className={`${section} bg-secondary`}>
        <Slider className={wrap}>
          <div className="mb-10 flex items-center justify-between gap-5">
            <h2 className={h2}>{reviewCount}+ happy reviews</h2>
            <SliderArrows />
          </div>
          <SliderTrack className={`auto-cols-[86%] gap-9 sm:auto-cols-[calc((100%-36px)/2.2)] xl:auto-cols-[calc((100%-108px)/3.4)] ${bleed}`}>
            {reviews.map(({ r, p }) => (
              <article key={r.id} className="flex flex-col overflow-hidden rounded-[20px] bg-background">
                <div className="relative aspect-[1.34] bg-secondary">
                  <Image src={p.images[p.images.length - 1] ?? ""} alt="" fill sizes="(max-width: 640px) 86vw, 30vw" className="object-cover mix-blend-multiply" />
                </div>
                <div className="flex flex-1 flex-col gap-4 px-6 pt-8 pb-7">
                  <p className="text-[21px] font-medium">
                    {r.author}
                    {r.verified && <span className="ml-2 text-[17px] font-normal text-muted-foreground">Verified Buyer</span>}
                  </p>
                  <span className="tracking-[2px] text-cta" aria-label={`${r.rating} out of 5 stars`}>
                    {"★".repeat(r.rating)}
                  </span>
                  <p className="flex-1 text-[19px]">{r.content}</p>
                  <Link href={`/product/${p.slug}`} className="flex items-center gap-3.5 border-t border-border pt-5 text-base hover:underline">
                    <span className="relative size-[62px] shrink-0 overflow-hidden rounded-[10px] bg-secondary">
                      <Image src={p.images[0] ?? ""} alt="" fill sizes="62px" className="object-cover mix-blend-multiply" />
                    </span>
                    <span>
                      {p.name}
                      <span className="block text-sm text-muted-foreground">★ {avgRating(p).toFixed(1)}</span>
                    </span>
                  </Link>
                </div>
              </article>
            ))}
          </SliderTrack>
        </Slider>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="bg-secondary pb-[clamp(64px,7vw,120px)]">
        <div className={`${wrap} grid items-center gap-[clamp(24px,3vw,56px)] md:grid-cols-2 xl:grid-cols-[1fr_1fr_1.1fr]`}>
          <div>
            <h2 className={`${h2} mb-10`}>We&apos;re here to help!</h2>
            <p className="mb-5 max-w-[440px] text-lg">
              Free shipping over $75, 30-day hassle-free returns and a friendly support team that actually answers. Any questions about our products?
            </p>
            <p className="mb-8 text-lg">
              Check if you can find them here or
              <br />
              <Link href="/contact" className="underline">
                Contact us
              </Link>
            </p>
            <Link href="/faq" className={btn}>
              See More Answers
            </Link>
          </div>
          <div className="relative mx-auto hidden aspect-square w-full max-w-[520px] overflow-hidden rounded-[20px] xl:block">
            <Image src={u("1600294037681-c80b4cb5b434", 900)} alt="Fieldtone Air Buds 2" fill sizes="30vw" className="object-cover mix-blend-multiply" />
          </div>
          <FaqAccordion items={faqItems} />
        </div>
      </section>

      {/* ---------- Statement + closing cards ---------- */}
      <section className={section}>
        <div className={wrap}>
          <div className="text-center">
            <h2 className="mx-auto mb-11 max-w-[900px] text-[clamp(32px,3.4vw,52px)] leading-[1.12] font-medium tracking-[-0.045em]">
              Tech to use together or apart, wherever you work.
            </h2>
            <Link href="/about" className={underline}>
              About Us
            </Link>
          </div>
          <div className="mt-[72px] grid gap-9 md:grid-cols-3">
            {[
              { title: "News, tips, reviews", cta: "View Our Blog", href: "/blog", img: "1525547719571-a2d4ac8945e2", bg: "#eceff3" },
              { title: "Help & support", cta: "Contact Us", href: "/contact", img: "1441986300917-64674bd600d8", bg: "#e3eaf5" },
              { title: "Find your next upgrade", cta: "Search Products", href: "/search", img: "1546054454-aa26e2b734c7", bg: "#ebe7f4" },
            ].map((c) => (
              <article key={c.title} className="group flex flex-col overflow-hidden rounded-[20px]" style={{ background: c.bg }}>
                <div className="relative aspect-[1.38] overflow-hidden">
                  <Image src={u(c.img, 900)} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <div className="px-6 pt-11 pb-14 text-center">
                  <h3 className="mb-10 text-[clamp(28px,2.4vw,40px)] leading-[1.1] font-medium tracking-[-0.04em]">{c.title}</h3>
                  <Link href={c.href} className="inline-flex h-[52px] items-center gap-2 rounded-full bg-primary px-8 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                    {c.href === "/search" && <Search className="size-4" />}
                    {c.cta}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
