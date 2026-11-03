"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/(checkout)/cart/cart-context";
import { Tooltip, TooltipContent, TooltipTrigger } from "@b2c/ui/components/tooltip";

type QuickAddProps = {
  variantId: string;
  price: number;
  stock: number | null;
  product: { slug: string; name: string; image: string | null };
};

export function QuickAddButton({ variantId, price, stock, product }: QuickAddProps) {
  const { addItem, openCart } = useCart();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ variantId, productSlug: product.slug, name: product.name, image: product.image, price, options: null, stock });
    openCart();
  };

  return (
    <Tooltip>
      <TooltipTrigger
        delay={1000}
        onClick={handleClick}
        className="absolute bottom-3 left-3 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-cta text-cta-foreground hover:bg-cta-hover opacity-100 shadow-md transition-all hover:scale-110 active:scale-95 sm:opacity-0 sm:group-hover:opacity-100"
        aria-label={`Add ${product.name} to cart`}
      >
        <ShoppingBag className="h-3.5 w-3.5" />
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        Add to cart
      </TooltipContent>
    </Tooltip>
  );
}
