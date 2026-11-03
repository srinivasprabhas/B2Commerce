"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/(checkout)/cart/cart-context";
import { CartItem } from "@/app/(checkout)/cart/cart-item";
import { DiscountCodeField } from "@/app/(checkout)/cart/discount-code-field";
import { Button, buttonVariants } from "@b2c/ui/components/button";
import { ScrollArea } from "@b2c/ui/components/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@b2c/ui/components/sheet";
import { storeConfig } from "@/lib/config";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

export function CartSidebar() {
  const { isOpen, closeCart, items, itemCount, subtotal, discount } = useCart();
  const total = subtotal - (discount?.amount ?? 0);
  const remainingForFreeShipping = storeConfig.freeShippingThreshold - total;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="flex flex-col data-[side=right]:w-full data-[side=right]:sm:max-w-lg">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="flex items-center gap-2">
            Your Cart
            {itemCount > 0 && <span className="text-sm font-normal text-muted-foreground">({itemCount} items)</span>}
          </SheetTitle>
          <SheetDescription className="sr-only">Review items in your cart and proceed to checkout.</SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">Add some products to get started</p>
            </div>
            <Button variant="outline" onClick={closeCart}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            {remainingForFreeShipping > 0 ? (
              <p className="mx-4 rounded-md bg-secondary px-3 py-2 text-center text-xs text-muted-foreground">
                Add <span className="font-medium text-foreground">{formatMoney(remainingForFreeShipping)}</span> more for
                free shipping
              </p>
            ) : (
              <p className="mx-4 rounded-md bg-secondary px-3 py-2 text-center text-xs font-medium">
                You&apos;ve unlocked free shipping 🎉
              </p>
            )}
            <ScrollArea className="flex-1 px-4">
              <div className="divide-y divide-border">
                {items.map((item) => (
                  <CartItem key={item.variantId} item={item} />
                ))}
              </div>
            </ScrollArea>

            <SheetFooter className="mt-auto border-t border-border pt-4">
              <div className="w-full space-y-4">
                <DiscountCodeField />
                {discount && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Subtotal</span>
                      <span>{formatMoney(subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-sm font-medium text-green-700 dark:text-green-400">
                      <span>Discount</span>
                      <span className="tabular-nums">−{formatMoney(discount.amount)}</span>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between text-base">
                  <span className="font-medium">{discount ? "Total" : "Subtotal"}</span>
                  <span className="font-semibold">{formatMoney(total)}</span>
                </div>
                <p className="text-xs text-muted-foreground">Shipping and taxes calculated at checkout</p>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className={cn(buttonVariants(), "h-12 w-full text-base font-semibold bg-cta text-cta-foreground hover:bg-cta-hover")}
                >
                  Checkout
                </Link>
                <button
                  type="button"
                  onClick={closeCart}
                  className="w-full text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Continue Shopping
                </button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
