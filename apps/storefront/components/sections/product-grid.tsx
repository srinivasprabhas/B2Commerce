import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { getFeaturedProducts } from "@/lib/catalog";
import type { Product } from "@/lib/types";

type ProductGridProps = {
  title?: string;
  description?: string;
  products?: Product[];
  limit?: number;
  showViewAll?: boolean;
  viewAllHref?: string;
};

export function ProductGrid({
  title = "Featured Products",
  description = "Handpicked favorites from our store",
  products,
  limit = 6,
  showViewAll = true,
  viewAllHref = "/products",
}: ProductGridProps) {
  const list = products ?? getFeaturedProducts(limit);

  return (
    <section id="products" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-medium text-foreground sm:text-3xl">{title}</h2>
          <p className="mt-2 text-muted-foreground">{description}</p>
        </div>
        {showViewAll && (
          <Link
            href={viewAllHref}
            className="hidden items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((product, index) => (
          <ProductCard key={product.id} product={product} priority={index === 0} />
        ))}
      </div>
      {showViewAll && (
        <div className="mt-12 text-center sm:hidden">
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            View all products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </section>
  );
}
