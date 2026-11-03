import type { Metadata } from "next";
import { ListingProducts } from "@/components/listing/listing-products";
import { ProductFilters, ProductFiltersMobile } from "@/components/listing/product-filters";
import { SortLinks, SortSelect } from "@/components/listing/sort-controls";
import { getFacets, parseListingParams } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "All Products",
  description: "Browse every product in the store.",
};

export default async function ProductsPage({ searchParams }: PageProps<"/products">) {
  const params = await searchParams;
  const filters = parseListingParams(params);
  const facets = getFacets();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">All Products</h1>
        <p className="mt-2 text-muted-foreground">Browse our complete catalog</p>
      </div>
      <div className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10">
        <ProductFilters facets={facets} />
        <div>
          <div className="mb-8 flex items-center justify-between gap-3 lg:hidden">
            <ProductFiltersMobile facets={facets} />
            <SortSelect />
          </div>
          <div className="mb-8 hidden flex-wrap items-center gap-3 lg:flex">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <SortLinks />
          </div>
          <ListingProducts basePath="/products" filters={filters} params={params} />
        </div>
      </div>
    </div>
  );
}
