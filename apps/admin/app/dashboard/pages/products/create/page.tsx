import { ProductForm } from "@/components/products/product-form";
import { allCategories } from "@/lib/data";

export const metadata = { title: "Add Product" };

export default function CreateProductPage() {
  return <ProductForm categories={allCategories.map((c) => ({ slug: c.slug, name: c.name, parent: c.parent }))} />;
}
