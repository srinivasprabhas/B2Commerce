import { X } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ListingPagination } from "@/components/listing/listing-pagination";
import { SortSelect } from "@/components/listing/sort-controls";
import { ProductCard } from "@/components/product/product-card";
import { SearchPageInput } from "@/components/search/search-page-input";
import { getRootCategories, listProducts, parseListingParams } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export async function generateMetadata({ searchParams }: PageProps<"/search">): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: typeof q === "string" && q ? `Search: ${q}` : "Search", robots: { index: false, follow: true } };
}

function withParams(current: Record<string, string | string[] | undefined>, overrides: Record<string, string | null>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(current)) if (typeof v === "string" && k !== "page") sp.set(k, v);
  for (const [k, v] of Object.entries(overrides)) {
    if (v === null) sp.delete(k);
    else sp.set(k, v);
  }
  return `/search?${sp}`;
}

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const params = await searchParams;
  const filters = parseListingParams(params);
  const query = filters.q?.trim() ?? "";
  const categories = getRootCategories();
  const result = query ? listProducts(filters) : null;
  const activeCategory = categories.find((c) => c.slug === filters.category);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      <div className="pt-8 pb-4 sm:pt-12 sm:pb-6">
        <div className="mx-auto max-w-3xl">
          <SearchPageInput key={query} initialQuery={query} />
        </div>
      </div>

      {result ? (
        <>
          <header className="pt-10 pb-8 sm:pt-14 sm:pb-12">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">Results for</p>
                <h1 className="mt-3 max-w-[14ch] text-4xl leading-[1.05] font-medium tracking-tight sm:text-5xl lg:text-6xl">
                  {query}
                </h1>
                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                  <span className="text-xs tracking-[0.18em] text-muted-foreground uppercase tabular-nums">
                    {result.total} {result.total === 1 ? "item" : "items"}
                  </span>
                  {activeCategory && (
                    <span className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">in</span>
                      <Link
                        href={withParams(params, { category: null })}
                        className="group inline-flex items-center gap-1.5 border-b border-foreground/70 pb-0.5 hover:border-foreground"
                      >
                        {activeCategory.name}
                        <X className="h-3 w-3 opacity-60 group-hover:opacity-100" strokeWidth={1.5} />
                      </Link>
                    </span>
                  )}
                </div>
              </div>
              <SortSelect />
            </div>
          </header>

          <div className="grid gap-x-10 gap-y-12 sm:grid-cols-[180px_1fr] sm:gap-x-12 lg:grid-cols-[200px_1fr] lg:gap-x-16">
            <aside>
              <nav aria-label="Filter by category" className="sm:sticky sm:top-24">
                <h2 className="mb-4 text-xs tracking-[0.18em] text-muted-foreground uppercase">Category</h2>
                <ul className="flex flex-col">
                  {[{ slug: "", name: "All" }, ...categories].map((c) => {
                    const active = (filters.category ?? "") === c.slug;
                    return (
                      <li key={c.slug || "all"}>
                        <Link
                          href={withParams(params, { category: c.slug || null })}
                          className={cn(
                            "flex items-baseline justify-between gap-2 border-b border-border py-2.5 text-sm transition-colors hover:text-foreground",
                            active ? "text-foreground" : "text-muted-foreground",
                          )}
                        >
                          {active ? "— " : ""}
                          {c.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </aside>

            {result.products.length === 0 ? (
              <div>
                <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">No results</p>
                <h2 className="mt-3 max-w-2xl text-3xl leading-[1.1] font-medium tracking-tight sm:text-5xl">
                  Nothing matched &ldquo;{query}&rdquo;
                </h2>
                <p className="mt-6 max-w-md text-sm text-muted-foreground">Try a shorter spelling, a broader term, or remove a filter.</p>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-14 lg:grid-cols-3 lg:gap-x-8">
                  {result.products.map((product, index) => (
                    <ProductCard key={product.id} product={product} priority={index === 0} />
                  ))}
                </div>
                <ListingPagination basePath="/search" currentPage={result.page} totalPages={result.totalPages} params={params} />
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="border-t border-border pt-12 sm:pt-20">
          <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">Search</p>
          <h2 className="mt-3 max-w-3xl text-4xl leading-[1.05] font-medium tracking-tight sm:text-6xl">What are you looking for?</h2>
          <div className="mt-12">
            <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">Or browse</p>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-lg">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/category/${c.slug}`} className="border-b border-foreground/30 pb-0.5 transition-colors hover:border-foreground">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
