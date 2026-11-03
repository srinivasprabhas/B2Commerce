import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/sections/product-grid";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@b2c/ui/components/breadcrumb";
import { getCollection, getCollections, getProductsInCollection } from "@/lib/catalog";

export const generateStaticParams = () => getCollections().map((c) => ({ slug: c.slug }));

export async function generateMetadata({ params }: PageProps<"/collection/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return { title: "Collection Not Found" };
  return { title: collection.name, description: collection.description };
}

export default async function CollectionPage({ params }: PageProps<"/collection/[slug]">) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();
  const products = getProductsInCollection(slug);

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{collection.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <section className="relative overflow-hidden bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-12 sm:py-16 lg:py-20">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl lg:text-5xl">{collection.name}</h1>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{collection.description}</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 hidden h-full w-1/2 lg:block">
          <Image src={collection.image} alt={collection.name} fill sizes="50vw" className="object-cover opacity-30" priority />
          <div className="absolute inset-0 bg-linear-to-r from-secondary/30 to-transparent" />
        </div>
      </section>

      <ProductGrid
        title={`${collection.name} Collection`}
        description={`${products.length} products`}
        products={products}
        showViewAll={false}
      />
    </>
  );
}
