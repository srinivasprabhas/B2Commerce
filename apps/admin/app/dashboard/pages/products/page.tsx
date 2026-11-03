import { buttonVariants } from "@b2c/ui/components/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { StatCard } from "@/components/common/stat-card";
import { ProductsTable } from "@/components/products/products-table";
import { adminProducts, money, productCategories } from "@/lib/data";

export const metadata = { title: "Products" };

const stats = [
  { title: "Total Sales", value: "$30,230", change: "20.1%", direction: "up" as const },
  { title: "Number of Sales", value: "982", change: "5.02%", direction: "up" as const },
  { title: "Affiliate", value: "$4,530", change: "3.1%", direction: "up" as const },
  { title: "Discounts", value: "$2,230", change: "3.58%", direction: "down" as const },
];

export default function ProductsPage() {
  const rows = adminProducts.map((p) => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    image: p.image,
    category: p.category,
    price: p.price,
    priceLabel: money(p.price),
    stock: p.stock,
    rating: p.rating,
    status: p.status,
  }));
  const statuses = [...new Set(rows.map((r) => r.status))];

  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Products</h1>
        <Link href="/dashboard/pages/products/create" className={buttonVariants({ size: "sm" })}>
          <PlusCircle />
          Add Product
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {stats.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>
      <ProductsTable rows={rows} categories={productCategories} statuses={statuses} />
    </div>
  );
}
