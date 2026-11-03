import { ListingPagination } from "@/components/listing/listing-pagination";
import { ProductCard } from "@/components/product/product-card";
import { type ListingFilters, listProducts } from "@/lib/catalog";

export function ListingProducts({
  basePath,
  filters,
  params,
}: {
  basePath: string;
  filters: ListingFilters;
  params: Record<string, string | string[] | undefined>;
}) {
  const { products, page, totalPages } = listProducts(filters);

  if (products.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-lg text-muted-foreground">No products match these filters.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} priority={index === 0} />
        ))}
      </div>
      <ListingPagination basePath={basePath} currentPage={page} totalPages={totalPages} params={params} />
    </>
  );
}
