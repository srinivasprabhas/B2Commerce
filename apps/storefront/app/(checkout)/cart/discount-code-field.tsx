"use client";

import { useId, useState } from "react";
import { useCart } from "@/app/(checkout)/cart/cart-context";
import { Button } from "@b2c/ui/components/button";
import { Input } from "@b2c/ui/components/input";

export function DiscountCodeField() {
  const { discount, applyDiscount, removeDiscount } = useCart();
  const inputId = useId();
  const messageId = useId();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const apply = () => {
    if (!code.trim()) return;
    const result = applyDiscount(code);
    if (result.ok) {
      setCode("");
      setError(null);
    } else {
      setError(result.error);
    }
  };

  if (discount) {
    return (
      <div
        role="status"
        className="flex min-h-11 items-center justify-between gap-3 rounded-md border border-green-700/30 bg-green-50 pl-3 text-green-900 dark:bg-green-950/40 dark:text-green-200"
      >
        <p className="min-w-0 py-2 text-sm">
          <span className="font-semibold break-all">{discount.code} applied</span>{" "}
          <span className="whitespace-nowrap">{discount.label}</span>
        </p>
        <Button
          type="button"
          variant="ghost"
          className="h-11 shrink-0 px-3 text-sm underline underline-offset-2"
          aria-label={`Remove discount code ${discount.code}`}
          onClick={removeDiscount}
        >
          Remove
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      <label htmlFor={inputId} className="text-sm font-medium">
        Discount code
      </label>
      <div className="flex gap-2">
        <Input
          id={inputId}
          type="text"
          autoComplete="off"
          spellCheck={false}
          placeholder="Try WELCOME10"
          className="h-11 min-w-0 flex-1 text-base md:text-base"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? messageId : undefined}
          value={code}
          onChange={(e) => {
            setCode(e.currentTarget.value);
            setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              apply();
            }
          }}
        />
        <Button type="button" variant="outline" className="h-11 shrink-0 px-4 text-base" onClick={apply}>
          Apply
        </Button>
      </div>
      {error && (
        <p id={messageId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
