"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@b2c/ui/components/select";
import { sortOptions } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const DEFAULT_SORT = sortOptions[0]!.value;

function useSortHref() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") ?? DEFAULT_SORT;
  const hrefFor = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (value === DEFAULT_SORT) params.delete("sort");
    else params.set("sort", value);
    return params.size ? `${pathname}?${params}` : pathname;
  };
  return { current, hrefFor };
}

export function SortLinks() {
  const { current, hrefFor } = useSortHref();
  return (
    <>
      {sortOptions.map((option) => (
        <Link
          key={option.value}
          href={hrefFor(option.value)}
          scroll={false}
          className={cn(
            "text-sm transition-colors",
            option.value === current ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {option.label}
        </Link>
      ))}
    </>
  );
}

export function SortSelect({ className }: { className?: string }) {
  const router = useRouter();
  const { current, hrefFor } = useSortHref();
  return (
    <Select
      value={current}
      onValueChange={(value) => value && router.push(hrefFor(value), { scroll: false })}
      items={sortOptions}
    >
      <SelectTrigger size="sm" className={cn("w-auto min-w-[9rem]", className)} aria-label="Sort products">
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
