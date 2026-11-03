import Image from "next/image";
import Link from "next/link";
import { QuickAddButton } from "@/components/product/quick-add-button";
import { listingPrice } from "@/lib/catalog";
import { formatMoney } from "@/lib/money";
import type { Product } from "@/lib/types";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const images = [
    ...product.images,
    ...product.variants.flatMap((v) => v.images).filter((img) => !product.images.includes(img)),
  ];
  const [primary, secondary] = images;
  const price = listingPrice(product);
  const only = product.variants.length === 1 ? product.variants[0] : null;
  const quickAdd = only && only.stock !== 0 ? only : null;
  const sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

  return (
    <Link href={`/product/${product.slug}`} className="group">
      <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-secondary">
        {quickAdd && (
          <QuickAddButton
            variantId={quickAdd.id}
            price={quickAdd.price}
            stock={quickAdd.stock}
            product={{ slug: product.slug, name: product.name, image: primary ?? null }}
          />
        )}
        {price.compareAt && (
          <span className="absolute top-3 left-3 z-10 rounded-full bg-cta px-2.5 py-1 text-xs font-semibold text-cta-foreground">
            Sale
          </span>
        )}
        {primary && (
          <Image
            src={primary}
            alt={product.name}
            fill
            sizes={sizes}
            priority={priority}
            className={`object-cover transition-opacity duration-500 ${secondary ? "group-hover:opacity-0" : ""}`}
          />
        )}
        {secondary && (
          <Image
            src={secondary}
            alt={`${product.name} - alternate view`}
            fill
            sizes={sizes}
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
      </div>
      <div className="space-y-1">
        <h2 className="text-base font-medium text-foreground">{product.name}</h2>
        <p className="flex flex-wrap items-baseline gap-2">
          <span className="text-base font-semibold text-foreground">
            {price.from ? "From " : ""}
            {formatMoney(price.amount)}
          </span>
          {price.compareAt && <span className="text-sm text-muted-foreground line-through">{formatMoney(price.compareAt)}</span>}
        </p>
      </div>
    </Link>
  );
}
