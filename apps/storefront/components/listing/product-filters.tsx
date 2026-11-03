"use client";

import { SlidersHorizontalIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, useState, useTransition } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@b2c/ui/components/accordion";
import { Button } from "@b2c/ui/components/button";
import { Checkbox } from "@b2c/ui/components/checkbox";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@b2c/ui/components/sheet";
import { Slider } from "@b2c/ui/components/slider";
import type { Facets } from "@/lib/catalog";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

const FILTER_KEYS = ["category", "collection", "brand", "priceMin", "priceMax", "opt"];
const VISIBLE_LIMIT = 10;

function parseOptions(raw: string | null): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const part of (raw ?? "").split(";")) {
    const [name, values] = part.split(":");
    if (name && values) out[name] = values.split(",").filter(Boolean);
  }
  return out;
}

function encodeOptions(options: Record<string, string[]>) {
  return Object.entries(options)
    .filter(([, v]) => v.length > 0)
    .map(([k, v]) => `${k}:${v.join(",")}`)
    .join(";");
}

function CollapsibleList<T>({ items, className, renderItem }: { items: T[]; className?: string; renderItem: (item: T) => ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, VISIBLE_LIMIT);
  return (
    <>
      <ul className={className}>{visible.map(renderItem)}</ul>
      {items.length > VISIBLE_LIMIT && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 px-2 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </>
  );
}

type FilterProps = { facets: Facets; showCategories?: boolean; showCollections?: boolean };

function FilterControls({ facets, showCategories = true, showCollections = true }: FilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const selectedOptions = parseOptions(searchParams.get("opt"));

  const { min: floor, max: ceil } = facets.priceBounds;
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get("priceMin") ?? floor),
    Number(searchParams.get("priceMax") ?? ceil),
  ]);

  const commit = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    params.delete("page");
    startTransition(() => router.push(params.size ? `${pathname}?${params}` : pathname, { scroll: false }));
  };

  const toggleSingle = (key: string, value: string) =>
    commit((p) => (p.get(key) === value ? p.delete(key) : p.set(key, value)));

  const toggleOption = (name: string, value: string, checked: boolean) => {
    const current = selectedOptions[name] ?? [];
    const next = { ...selectedOptions, [name]: checked ? [...new Set([...current, value])] : current.filter((v) => v !== value) };
    const encoded = encodeOptions(next);
    commit((p) => (encoded ? p.set("opt", encoded) : p.delete("opt")));
  };

  const clearAll = () => {
    setPriceRange([floor, ceil]);
    commit((p) => FILTER_KEYS.forEach((k) => p.delete(k)));
  };

  const hasActive = FILTER_KEYS.some((k) => searchParams.has(k));
  const groups = [
    ...(showCategories ? ["categories"] : []),
    ...(showCollections ? ["collections"] : []),
    ...facets.options.map((o) => `opt-${o.name}`),
    "brands",
    "price",
  ];

  const listButton = (active: boolean) =>
    cn(
      "w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-secondary",
      active ? "font-medium text-foreground" : "text-muted-foreground",
    );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-foreground">Filters</h2>
        {hasActive && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Clear all
          </button>
        )}
      </div>
      <Accordion multiple defaultValue={groups.slice(0, 1)} className="w-full">
        {showCategories && (
          <AccordionItem value="categories">
            <AccordionTrigger className="text-sm">Categories</AccordionTrigger>
            <AccordionContent>
              <CollapsibleList
                items={facets.categories}
                className="space-y-1"
                renderItem={(c) => (
                  <li key={c.slug}>
                    <button type="button" onClick={() => toggleSingle("category", c.slug)} className={listButton(searchParams.get("category") === c.slug)}>
                      {c.name}
                    </button>
                  </li>
                )}
              />
            </AccordionContent>
          </AccordionItem>
        )}
        {showCollections && (
          <AccordionItem value="collections">
            <AccordionTrigger className="text-sm">Collections</AccordionTrigger>
            <AccordionContent>
              <CollapsibleList
                items={facets.collections}
                className="space-y-1"
                renderItem={(c) => (
                  <li key={c.slug}>
                    <button type="button" onClick={() => toggleSingle("collection", c.slug)} className={listButton(searchParams.get("collection") === c.slug)}>
                      {c.name}
                    </button>
                  </li>
                )}
              />
            </AccordionContent>
          </AccordionItem>
        )}
        {facets.options.map((option) => (
          <AccordionItem key={option.name} value={`opt-${option.name}`}>
            <AccordionTrigger className="text-sm">{option.name}</AccordionTrigger>
            <AccordionContent>
              <CollapsibleList
                items={option.values}
                className="space-y-2"
                renderItem={(value) => {
                  const id = `${option.name}-${value}`.replace(/\s+/g, "-");
                  return (
                    <li key={value} className="flex items-center gap-2">
                      <Checkbox
                        id={id}
                        checked={(selectedOptions[option.name] ?? []).includes(value)}
                        onCheckedChange={(state) => toggleOption(option.name, value, state === true)}
                      />
                      <label htmlFor={id} className="cursor-pointer text-sm text-muted-foreground">
                        {value}
                      </label>
                    </li>
                  );
                }}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
        <AccordionItem value="brands">
          <AccordionTrigger className="text-sm">Brands</AccordionTrigger>
          <AccordionContent>
            <CollapsibleList
              items={facets.brands}
              className="space-y-1"
              renderItem={(b) => (
                <li key={b.slug}>
                  <button type="button" onClick={() => toggleSingle("brand", b.slug)} className={listButton(searchParams.get("brand") === b.slug)}>
                    {b.name}
                  </button>
                </li>
              )}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="price">
          <AccordionTrigger className="text-sm">Price</AccordionTrigger>
          <AccordionContent>
            <div className="px-1 pt-2">
              <Slider
                value={priceRange}
                min={floor}
                max={ceil}
                step={100}
                minStepsBetweenValues={1}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                onValueCommitted={(value) => {
                  const [min, max] = value as [number, number];
                  commit((p) => {
                    if (min <= floor) p.delete("priceMin");
                    else p.set("priceMin", String(min));
                    if (max >= ceil) p.delete("priceMax");
                    else p.set("priceMax", String(max));
                  });
                }}
              />
              <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                <span>{formatMoney(priceRange[0])}</span>
                <span>{formatMoney(priceRange[1])}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export function ProductFilters({ className, ...props }: FilterProps & { className?: string }) {
  return (
    <aside className={cn("hidden lg:block", className)}>
      <FilterControls {...props} />
    </aside>
  );
}

export function ProductFiltersMobile(props: FilterProps) {
  const searchParams = useSearchParams();
  const activeCount = FILTER_KEYS.filter((k) => searchParams.has(k)).length;
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" size="sm" className="lg:hidden" />}>
        <SlidersHorizontalIcon className="size-4" />
        Filters
        {activeCount > 0 && (
          <span className="ml-1 rounded-full bg-primary px-1.5 text-xs text-primary-foreground">{activeCount}</span>
        )}
      </SheetTrigger>
      <SheetContent side="left" className="overflow-y-auto data-[side=left]:w-[85vw] data-[side=left]:max-w-sm">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription className="sr-only">Refine the product list</SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-8">
          <FilterControls {...props} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
