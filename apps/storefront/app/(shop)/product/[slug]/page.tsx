import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/app/(shop)/product/[slug]/add-to-cart";
import { MediaGallery } from "@/app/(shop)/product/[slug]/media-gallery";
import { ProductFeatures } from "@/app/(shop)/product/[slug]/product-features";
import { ProductReviews, reviewSummary } from "@/app/(shop)/product/[slug]/product-reviews";
import { SelectedVariantProvider } from "@/app/(shop)/product/[slug]/selected-variant";
import { StarRating } from "@/app/(shop)/product/[slug]/star-rating";
import { ProductGrid } from "@/components/sections/product-grid";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@b2c/ui/components/breadcrumb";
import { getAllProducts, getBrand, getCategory, getCategoryPath, getProduct, getRelatedProducts } from "@/lib/catalog";

export const generateStaticParams = () => getAllProducts().map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.summary,
    openGraph: { title: product.name, description: product.summary, images: product.images.slice(0, 1) },
  };
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const brand = getBrand(product.brand);
  const { count, average } = reviewSummary(product.reviews);
  const allImages = [
    ...product.images,
    ...product.variants.flatMap((v) => v.images).filter((img) => !product.images.includes(img)),
  ];
  const related = getRelatedProducts(product, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/products" />}>Products</BreadcrumbLink>
          </BreadcrumbItem>
          {category && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href={`/category/${getCategoryPath(category.slug)}`} />}>
                  {category.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <SelectedVariantProvider variants={product.variants}>
        <div className="lg:grid lg:grid-cols-2 lg:gap-16">
          <MediaGallery images={allImages} productName={product.name} />

          <div className="mt-8 space-y-8 lg:mt-0">
            <div className="space-y-3">
              {brand && (
                <Link
                  href={`/products?brand=${brand.slug}`}
                  className="inline-flex min-h-6 items-center text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-foreground"
                >
                  {brand.name}
                </Link>
              )}
              <h1 className="text-4xl font-medium tracking-tight text-balance text-foreground lg:text-5xl">{product.name}</h1>
              {count > 0 && (
                <a href="#reviews" className="inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-80">
                  <StarRating rating={average} />
                  <span className="font-medium">{average.toFixed(1)}</span>
                  <span className="text-muted-foreground underline-offset-4 hover:underline">
                    ({count} {count === 1 ? "review" : "reviews"})
                  </span>
                </a>
              )}
            </div>

            <AddToCart
              product={{ slug: product.slug, name: product.name, image: product.images[0] ?? null }}
              summary={product.summary}
            />
          </div>
        </div>
      </SelectedVariantProvider>

      <section className="mt-16 border-t border-border pt-12">
        <h2 className="mb-6 text-2xl font-medium tracking-tight">Product details</h2>
        <ul className="prose prose-sm max-w-none text-muted-foreground dark:prose-invert">
          {product.details.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <ProductReviews reviews={product.reviews} />
      <ProductFeatures />
      {related.length > 0 && (
        <ProductGrid title="You might also like" description="More products to explore" products={related} showViewAll={false} />
      )}
    </div>
  );
}
