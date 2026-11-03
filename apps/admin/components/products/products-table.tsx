"use client";

import { Button } from "@b2c/ui/components/button";
import { Card, CardContent } from "@b2c/ui/components/card";
import { Checkbox } from "@b2c/ui/components/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@b2c/ui/components/dropdown-menu";
import { Input } from "@b2c/ui/components/input";
import { Popover, PopoverContent, PopoverTrigger } from "@b2c/ui/components/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@b2c/ui/components/select";
import { Separator } from "@b2c/ui/components/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@b2c/ui/components/table";
import { cn } from "@b2c/ui/lib/utils";
import { ChevronLeft, ChevronRight, ChevronsUpDown, Columns3, ListFilter, Star, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { RowActions } from "@/components/common/row-actions";
import { StatusBadge } from "@/components/common/status-badge";

export type ProductRow = {
  id: number;
  name: string;
  sku: string;
  image: string;
  category: string;
  price: number;
  priceLabel: string;
  stock: number;
  rating: number;
  status: string;
};

type ColKey = "category" | "price" | "stock" | "rating" | "status";
type SortKey = "name" | ColKey;

const columns: { key: ColKey; label: string }[] = [
  { key: "category", label: "Category" },
  { key: "price", label: "Price" },
  { key: "stock", label: "Stock" },
  { key: "rating", label: "Rating" },
  { key: "status", label: "Status" },
];

function SortHeader({ label, k, sort, onSort }: { label: string; k: SortKey; sort: { key: SortKey; dir: 1 | -1 } | null; onSort: (k: SortKey) => void }) {
  return (
    <Button variant="ghost" size="xs" className="-ml-2 h-7 gap-1 px-2" onClick={() => onSort(k)}>
      {label}
      <ChevronsUpDown className={cn("size-3.5 opacity-50", sort?.key === k && "opacity-100")} />
    </Button>
  );
}

export function ProductsTable({ rows, categories, statuses }: { rows: ProductRow[]; categories: string[]; statuses: string[] }) {
  const [q, setQ] = useState("");
  const [catFilter, setCatFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [hidden, setHidden] = useState<ColKey[]>([]);
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 } | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    const list = rows.filter(
      (r) =>
        (!s || `${r.name} ${r.sku}`.toLowerCase().includes(s)) &&
        (catFilter.length === 0 || catFilter.includes(r.category)) &&
        (statusFilter.length === 0 || statusFilter.includes(r.status)),
    );
    if (sort) {
      list.sort((a, b) => {
        const av = a[sort.key];
        const bv = b[sort.key];
        return (typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv))) * sort.dir;
      });
    }
    return list;
  }, [rows, q, catFilter, statusFilter, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pages - 1);
  const visible = filtered.slice(current * pageSize, current * pageSize + pageSize);
  const show = (k: ColKey) => !hidden.includes(k);
  const allOnPage = visible.length > 0 && visible.every((r) => selected.has(r.id));
  const activeFilters = catFilter.length + statusFilter.length;

  const onSort = (k: SortKey) => setSort((s) => (s?.key === k ? (s.dir === 1 ? { key: k, dir: -1 } : null) : { key: k, dir: 1 }));
  const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  return (
    <Card>
      <CardContent className="flex flex-col p-0">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b px-(--card-spacing) py-3">
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Search products..."
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(0);
              }}
              className="h-7 w-48 lg:w-64"
            />
            <Popover>
              <PopoverTrigger render={<Button variant="outline" size="xs" className="h-7 gap-1" />}>
                <ListFilter />
                Filters
                {activeFilters > 0 && (
                  <span className="ml-1 rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">{activeFilters}</span>
                )}
              </PopoverTrigger>
              <PopoverContent align="start" className="w-60 p-3">
                <div className="space-y-3">
                  <div className="text-xs font-medium text-muted-foreground">Status</div>
                  {statuses.map((s) => (
                    <label key={s} className="flex cursor-pointer items-center gap-2 text-sm">
                      <Checkbox checked={statusFilter.includes(s)} onCheckedChange={() => (setStatusFilter(toggle(statusFilter, s)), setPage(0))} />
                      {s}
                    </label>
                  ))}
                  <Separator />
                  <div className="text-xs font-medium text-muted-foreground">Category</div>
                  {categories.map((c) => (
                    <label key={c} className="flex cursor-pointer items-center gap-2 text-sm">
                      <Checkbox checked={catFilter.includes(c)} onCheckedChange={() => (setCatFilter(toggle(catFilter, c)), setPage(0))} />
                      {c}
                    </label>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            {activeFilters > 0 && (
              <Button variant="ghost" size="xs" className="h-7" onClick={() => (setCatFilter([]), setStatusFilter([]))}>
                Reset
                <X />
              </Button>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" size="xs" className="h-7 gap-1" />}>
              <Columns3 />
              Columns
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {columns.map((c) => (
                <DropdownMenuCheckboxItem
                  key={c.key}
                  checked={show(c.key)}
                  onCheckedChange={() => setHidden((h) => (h.includes(c.key) ? h.filter((x) => x !== c.key) : [...h, c.key]))}
                >
                  {c.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10 pl-(--card-spacing)">
                <Checkbox
                  aria-label="Select all"
                  checked={allOnPage}
                  onCheckedChange={(v) =>
                    setSelected((s) => {
                      const n = new Set(s);
                      for (const r of visible) v ? n.add(r.id) : n.delete(r.id);
                      return n;
                    })
                  }
                />
              </TableHead>
              <TableHead>
                <SortHeader label="Product" k="name" sort={sort} onSort={onSort} />
              </TableHead>
              {columns.filter((c) => show(c.key)).map((c) => (
                <TableHead key={c.key}>
                  <SortHeader label={c.label} k={c.key} sort={sort} onSort={onSort} />
                </TableHead>
              ))}
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((r) => (
              <TableRow key={r.id} data-state={selected.has(r.id) ? "selected" : undefined}>
                <TableCell className="pl-(--card-spacing)">
                  <Checkbox
                    aria-label={`Select ${r.name}`}
                    checked={selected.has(r.id)}
                    onCheckedChange={() =>
                      setSelected((s) => {
                        const n = new Set(s);
                        n.has(r.id) ? n.delete(r.id) : n.add(r.id);
                        return n;
                      })
                    }
                  />
                </TableCell>
                <TableCell>
                  <Link href={`/dashboard/pages/products/${r.id}`} className="flex items-center gap-3">
                    <Image src={r.image} alt={r.name} width={40} height={40} className="size-10 rounded-lg border object-cover" />
                    <div>
                      <div className="max-w-60 truncate font-medium hover:underline">{r.name}</div>
                      <div className="text-xs text-muted-foreground">{r.sku}</div>
                    </div>
                  </Link>
                </TableCell>
                {show("category") && <TableCell>{r.category}</TableCell>}
                {show("price") && <TableCell>{r.priceLabel}</TableCell>}
                {show("stock") && <TableCell>{r.stock}</TableCell>}
                {show("rating") && (
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="size-3.5 fill-orange-400 text-orange-400" />
                      {r.rating.toFixed(1)}
                    </div>
                  </TableCell>
                )}
                {show("status") && (
                  <TableCell>
                    <StatusBadge status={r.status} />
                  </TableCell>
                )}
                <TableCell className="pr-(--card-spacing)">
                  <RowActions
                    viewHref={`/dashboard/pages/products/${r.id}`}
                    viewLabel="View product"
                    copyValue={r.sku}
                    copyLabel="Copy SKU"
                    editHref="/dashboard/pages/products/create"
                    danger="Delete"
                  />
                </TableCell>
              </TableRow>
            ))}
            {visible.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex flex-col items-center justify-between gap-3 border-t px-(--card-spacing) py-3 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {selected.size > 0 ? `${selected.size} of ${filtered.length} row(s) selected · ` : null}
            Rows per page
            <Select
              value={String(pageSize)}
              onValueChange={(v) => {
                setPageSize(Number(v));
                setPage(0);
              }}
            >
              <SelectTrigger size="sm" className="w-fit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {filtered.length === 0 ? 0 : current * pageSize + 1} - {Math.min(filtered.length, (current + 1) * pageSize)} of{" "}
              {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon-sm" className="size-7" disabled={current === 0} onClick={() => setPage(current - 1)}>
                <span className="sr-only">Previous page</span>
                <ChevronLeft />
              </Button>
              {Array.from({ length: pages }, (_, i) => (
                <Button
                  key={i}
                  variant={i === current ? "outline" : "ghost"}
                  size="icon-sm"
                  className="size-7"
                  onClick={() => setPage(i)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button variant="outline" size="icon-sm" className="size-7" disabled={current >= pages - 1} onClick={() => setPage(current + 1)}>
                <span className="sr-only">Next page</span>
                <ChevronRight />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
