import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Fragment } from "react";
import { ListingProducts } from "@/components/listing/listing-products";
import { ProductFilters, ProductFiltersMobile } from "@/components/listing/product-filters";
import { SortSelect } from "@/components/listing/sort-controls";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@b2c/ui/components/breadcrumb";
import { getCategory, getCategoryTrail, getFacets, parseListingParams } from "@/lib/catalog";
import { categories } from "@/lib/data/catalog";

export async function generateMetadata({ params }: PageProps<"/category/[...slugs]">): Promise<Metadata> {
  const { slugs } = await params;
  const category = getCategory(slugs.at(-1) ?? "");
  if (!category) return { title: "Category Not Found" };
  return { title: category.name, description: category.description };
}

export default async function CategoryPage({ params, searchParams }: PageProps<"/category/[...slugs]">) {
  const { slugs } = await params;
  const query = await searchParams;
  const slug = slugs.at(-1);
  const category = slug ? getCategory(slug) : null;
  if (!category) notFound();

  const trail = getCategoryTrail(category.slug);
  const canonicalPath = trail.map((c) => c.slug).join("/");
  if (slugs.join("/") !== canonicalPath) permanentRedirect(`/category/${canonicalPath}`);

  const children = categories.filter((c) => c.parent === category.slug);
  const filters = { ...parseListingParams(query), category: category.slug };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          {trail.map((crumb, index) => {
            const path = trail.slice(0, index + 1).map((c) => c.slug).join("/");
            return (
              <Fragment key={crumb.slug}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {index === trail.length - 1 ? (
                    <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink render={<Link href={`/category/${path}`} />}>{crumb.name}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-10">
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">{category.name}</h1>
        <p className="mt-2 text-muted-foreground">{category.description}</p>
        {children.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {children.map((child) => (
              <Link
                key={child.slug}
                href={`/category/${canonicalPath}/${child.slug}`}
                className="rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {child.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10">
        <ProductFilters facets={getFacets()} showCategories={false} />
        <div>
          <div className="mb-8 flex items-center justify-between gap-3">
            <ProductFiltersMobile facets={getFacets()} showCategories={false} />
            <SortSelect className="ml-auto" />
          </div>
          <ListingProducts basePath={`/category/${canonicalPath}`} filters={filters} params={query} />
        </div>
      </div>
    </div>
  );
}
