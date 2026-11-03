"use client";

import { createContext, type ReactNode, useContext, useState, useSyncExternalStore } from "react";

export type CartLine = {
  variantId: string;
  productSlug: string;
  name: string;
  image: string | null;
  /** Unit price in cents. */
  price: number;
  /** e.g. "Black / M" */
  options: string | null;
  quantity: number;
  /** Max purchasable (null = unlimited). */
  stock: number | null;
};

/** Demo discount codes. Replace with a server check once the API exists. */
const DISCOUNT_CODES: Record<string, { percent: number; label: string }> = {
  WELCOME10: { percent: 10, label: "10% off" },
  SAVE20: { percent: 20, label: "20% off" },
};

type CartContextValue = {
  items: CartLine[];
  itemCount: number;
  subtotal: number;
  discount: { code: string; label: string; amount: number } | null;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  applyDiscount: (code: string) => { ok: true } | { ok: false; error: string };
  removeDiscount: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "b2c-cart";

const clamp = (qty: number, stock: number | null) => Math.max(0, Math.min(qty, stock ?? 99, 99));

/* Cart persisted in localStorage, exposed as an external store so every tab stays in sync. */
type CartState = { items: CartLine[]; discountCode: string | null };
const EMPTY: CartState = { items: [], discountCode: null };
let snapshot: CartState | null = null;
const listeners = new Set<() => void>();

function readCart(): CartState {
  if (snapshot === null) {
    try {
      snapshot = (JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as CartState | null) ?? EMPTY;
    } catch {
      snapshot = EMPTY;
    }
  }
  return snapshot;
}

function writeCart(update: (state: CartState) => CartState) {
  snapshot = update(readCart());
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    snapshot = null;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { items, discountCode } = useSyncExternalStore(subscribe, readCart, () => EMPTY);
  const [isOpen, setIsOpen] = useState(false);
  const setItems = (update: (items: CartLine[]) => CartLine[]) => writeCart((s) => ({ ...s, items: update(s.items) }));
  const setDiscountCode = (code: string | null) => writeCart((s) => ({ ...s, discountCode: code }));

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const rule = discountCode ? DISCOUNT_CODES[discountCode] : undefined;
  const discount =
    discountCode && rule && items.length > 0
      ? { code: discountCode, label: rule.label, amount: Math.round((subtotal * rule.percent) / 100) }
      : null;

  const value: CartContextValue = {
    items,
    itemCount,
    subtotal,
    discount,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    addItem: (line, quantity = 1) =>
      setItems((prev) => {
        const existing = prev.find((i) => i.variantId === line.variantId);
        if (existing) {
          return prev.map((i) =>
            i.variantId === line.variantId ? { ...i, quantity: clamp(i.quantity + quantity, i.stock) } : i,
          );
        }
        return [...prev, { ...line, quantity: clamp(quantity, line.stock) }];
      }),
    setQuantity: (variantId, quantity) =>
      setItems((prev) =>
        quantity <= 0
          ? prev.filter((i) => i.variantId !== variantId)
          : prev.map((i) => (i.variantId === variantId ? { ...i, quantity: clamp(quantity, i.stock) } : i)),
      ),
    removeItem: (variantId) => setItems((prev) => prev.filter((i) => i.variantId !== variantId)),
    clearCart: () => writeCart(() => EMPTY),
    applyDiscount: (code) => {
      const normalized = code.trim().toUpperCase();
      if (!DISCOUNT_CODES[normalized]) return { ok: false, error: "This code isn't valid." };
      setDiscountCode(normalized);
      return { ok: true };
    },
    removeDiscount: () => setDiscountCode(null),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
