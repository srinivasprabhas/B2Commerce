import { Button, buttonVariants } from "@b2c/ui/components/button";
import { Card, CardContent } from "@b2c/ui/components/card";
import { Table, TableBody, TableCell, TableRow } from "@b2c/ui/components/table";
import { CircleDollarSign, HandCoins, Layers2, PenLine, Trash2, Truck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductReviews } from "@/components/products/product-reviews";
import { VariantPicker } from "@/components/products/variant-picker";
import { adminProducts, getAdminProduct, initials, longDate, money, orders, unitsSold } from "@/lib/data";

export function generateStaticParams() {
  return adminProducts.map((p) => ({ id: String(p.id) }));
}

export async function generateMetadata({ params }: PageProps<"/dashboard/pages/products/[id]">): Promise<Metadata> {
  const p = getAdminProduct(Number((await params).id));
  return { title: p?.name ?? "Product" };
}

function ago(iso: string) {
  const days = Math.max(1, Math.round((Date.UTC(2026, 10, 3) - Date.parse(iso)) / 86_400_000));
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (days < 30) return `${Math.round(days / 7)} week${days >= 14 ? "s" : ""} ago`;
  const m = Math.round(days / 30);
  return `${m} month${m > 1 ? "s" : ""} ago`;
}

export default async function ProductDetailPage({ params }: PageProps<"/dashboard/pages/products/[id]">) {
  const product = getAdminProduct(Number((await params).id));
  if (!product) notFound();

  const sold = unitsSold(product);
  const orderCount = orders.filter((o) => o.items.some((it) => it.product.id === product.id)).length + sold;
  const stats = [
    { label: "Price", value: money(product.price), icon: CircleDollarSign },
    { label: "No. of Orders", value: orderCount.toLocaleString("en-US"), icon: Truck },
    { label: "Available Stocks", value: product.stock.toLocaleString("en-US"), icon: Layers2 },
    { label: "Total Revenue", value: money(sold * product.price), icon: HandCoins },
  ];
  const attributes = [
    { label: "Category", value: product.category },
    { label: "Brand", value: product.brand },
    { label: "Color", value: product.colors.map((c) => c.value).join(", ") || "—" },
    { label: "Variants", value: String(product.source.variants.length) },
  ];
  const reviews = product.source.reviews.map((r) => ({
    id: r.id,
    author: r.author,
    initials: initials(r.author),
    ago: ago(r.createdAt),
    rating: r.rating,
    content: r.content,
    verified: r.verified,
  }));

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold tracking-tight lg:text-2xl">{product.name}</h1>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground lg:flex-row lg:gap-4">
            <div>
              <span className="text-foreground">Seller :</span> {product.brand}
            </div>
            <div>
              <span className="text-foreground">Published :</span> {longDate(product.createdAt)}
            </div>
            <div>
              <span className="text-foreground">SKU :</span> {product.sku}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/pages/products/create" className={buttonVariants({ size: "sm" })}>
            <PenLine />
            Edit
          </Link>
          <Button variant="destructive" size="icon-sm" aria-label="Delete product">
            <Trash2 />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:gap-6 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <ProductGallery images={product.images} name={product.name} />
        </div>

        <div className="space-y-4 lg:space-y-6 xl:col-span-2">
          <div className="grid gap-4 md:grid-cols-2 lg:gap-6 xl:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="grid gap-4 rounded-lg border bg-muted p-4">
                <s.icon className="size-6 opacity-40" />
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">{s.label}</span>
                  <span className="text-lg font-semibold">{s.value}</span>
                </div>
              </div>
            ))}
          </div>

          <Card>
            <CardContent className="space-y-8">
              <div className="grid gap-8 xl:grid-cols-3">
                <div className="space-y-8 xl:col-span-2">
                  <div className="space-y-2">
                    <h3 className="font-semibold">Description:</h3>
                    <p className="text-muted-foreground">{product.summary}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Key Features:</h3>
                    <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                      {product.details.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="self-start overflow-hidden rounded-md border xl:col-span-1">
                  <Table>
                    <TableBody>
                      {attributes.map((a) => (
                        <TableRow key={a.label}>
                          <TableCell className="font-semibold">{a.label}</TableCell>
                          <TableCell className="whitespace-normal text-right">{a.value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              <VariantPicker colors={product.colors} sizes={product.sizes} />
            </CardContent>
          </Card>

          <ProductReviews reviews={reviews} />
        </div>
      </div>
    </div>
  );
}
