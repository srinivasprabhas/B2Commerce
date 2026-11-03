"use client";

import { createContext, type ReactNode, useContext, useState, useSyncExternalStore } from "react";
import type { Variant } from "@/lib/types";

type Selection = Record<string, string>;
type Ctx = { variants: Variant[]; selection: Selection; select: (name: string, value: string) => void; selected: Variant | null };

const SelectedVariantContext = createContext<Ctx | null>(null);

const selectionOf = (v: Variant | undefined): Selection =>
  Object.fromEntries((v?.options ?? []).map((o) => [o.name, o.value]));

function findVariant(variants: Variant[], selection: Selection) {
  if (variants.length === 1) return variants[0] ?? null;
  return variants.find((v) => v.options.every((o) => selection[o.name] === o.value)) ?? null;
}

/** Holds the chosen variant for a product page and mirrors it into the URL (?Color=Black&Size=M). */
export function SelectedVariantProvider({ variants, children }: { variants: Variant[]; children: ReactNode }) {
  // The query string on first load (a shared link such as ?Color=White); empty during prerender.
  const initialSearch = useSyncExternalStore(
    () => () => {},
    () => window.location.search,
    () => "",
  );
  const [picked, setPicked] = useState<Selection | null>(null);

  const fromUrl: Selection = {};
  const params = new URLSearchParams(initialSearch);
  for (const o of variants.flatMap((v) => v.options)) {
    if (params.get(o.name) === o.value) fromUrl[o.name] = o.value;
  }
  const selection = picked ?? { ...selectionOf(variants[0]), ...fromUrl };

  const select = (name: string, value: string) => {
    const next = { ...selection, [name]: value };
    setPicked(next);
    const params = new URLSearchParams(next);
    window.history.replaceState(null, "", `${window.location.pathname}?${params}`);
  };

  return (
    <SelectedVariantContext.Provider value={{ variants, selection, select, selected: findVariant(variants, selection) }}>
      {children}
    </SelectedVariantContext.Provider>
  );
}

export function useSelectedVariant() {
  const ctx = useContext(SelectedVariantContext);
  if (!ctx) throw new Error("useSelectedVariant must be used within SelectedVariantProvider");
  return ctx;
}
