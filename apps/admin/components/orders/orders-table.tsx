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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@b2c/ui/components/table";
import { Tabs, TabsList, TabsTrigger } from "@b2c/ui/components/tabs";
import { ChevronLeft, ChevronRight, ChevronsUpDown, Columns3, ListFilter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { RowActions } from "@/components/common/row-actions";
import { StatusBadge } from "@/components/common/status-badge";

export type OrderRow = {
  id: string;
  product: string;
  productImage: string;
  extraItems: number;
  customer: string;
  email: string;
  type: string;
  price: number;
  priceLabel: string;
  date: string;
  dateLabel: string;
  status: string;
};

type ColKey = "product" | "customer" | "type" | "price" | "date" | "status";
const columns: { key: ColKey; label: string }[] = [
  { key: "product", label: "Product" },
  { key: "customer", label: "Customer" },
  { key: "type", label: "Type" },
  { key: "price", label: "Price" },
  { key: "date", label: "Date" },
  { key: "status", label: "Status" },
];
const tabs = ["All", "Pending", "Shipped", "Delivered", "Cancelled"];

export function OrdersTable({ rows }: { rows: OrderRow[] }) {
  const [tab, setTab] = useState("All");
  const [q, setQ] = useState("");
  const [types, setTypes] = useState<string[]>([]);
  const [hidden, setHidden] = useState<ColKey[]>([]);
  const [sort, setSort] = useState<{ key: "id" | "price" | "date"; dir: 1 | -1 } | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    const list = rows.filter(
      (r) =>
        (tab === "All" || r.status === tab) &&
        (types.length === 0 || types.includes(r.type)) &&
        (!s || `${r.id} ${r.product} ${r.customer} ${r.email}`.toLowerCase().includes(s)),
    );
    if (sort) list.sort((a, b) => String(a[sort.key]).localeCompare(String(b[sort.key]), undefined, { numeric: true }) * sort.dir);
    return list;
  }, [rows, tab, q, types, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pages - 1);
  const visible = filtered.slice(current * pageSize, current * pageSize + pageSize);
  const show = (k: ColKey) => !hidden.includes(k);
  const onSort = (key: "id" | "price" | "date") =>
    setSort((s) => (s?.key === key ? (s.dir === 1 ? { key, dir: -1 } : null) : { key, dir: 1 }));
  const sortBtn = (label: string, key: "id" | "price" | "date") => (
    <Button variant="ghost" size="xs" className="-ml-2 h-7 gap-1 px-2" onClick={() => onSort(key)}>
      {label}
      <ChevronsUpDown className="size-3.5 opacity-50" />
    </Button>
  );

  return (
    <Tabs
      value={tab}
      onValueChange={(v) => {
        setTab(v as string);
        setPage(0);
      }}
      className="gap-4"
    >
      <TabsList>
        {tabs.map((t) => (
          <TabsTrigger key={t} value={t}>
            {t}
          </TabsTrigger>
        ))}
      </TabsList>

      <Card>
        <CardContent className="flex flex-col p-0">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b px-(--card-spacing) py-3">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search orders..."
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
                  {types.length > 0 && <span className="ml-1 rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">{types.length}</span>}
                </PopoverTrigger>
                <PopoverContent align="start" className="w-48 space-y-3 p-3">
                  <div className="text-xs font-medium text-muted-foreground">Type</div>
                  {["Sale", "Refund"].map((t) => (
                    <label key={t} className="flex cursor-pointer items-center gap-2 text-sm">
                      <Checkbox
                        checked={types.includes(t)}
                        onCheckedChange={() => setTypes((ts) => (ts.includes(t) ? ts.filter((x) => x !== t) : [...ts, t]))}
                      />
                      {t}
                    </label>
                  ))}
                </PopoverContent>
              </Popover>
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
                    checked={visible.length > 0 && visible.every((r) => selected.has(r.id))}
                    onCheckedChange={(v) =>
                      setSelected((s) => {
                        const n = new Set(s);
                        for (const r of visible) v ? n.add(r.id) : n.delete(r.id);
                        return n;
                      })
                    }
                  />
                </TableHead>
                <TableHead>{sortBtn("Order", "id")}</TableHead>
                {show("product") && <TableHead>Product</TableHead>}
                {show("customer") && <TableHead>Customer</TableHead>}
                {show("type") && <TableHead>Type</TableHead>}
                {show("price") && <TableHead>{sortBtn("Price", "price")}</TableHead>}
                {show("date") && <TableHead>{sortBtn("Date", "date")}</TableHead>}
                {show("status") && <TableHead>Status</TableHead>}
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((r) => (
                <TableRow key={r.id} data-state={selected.has(r.id) ? "selected" : undefined}>
                  <TableCell className="pl-(--card-spacing)">
                    <Checkbox
                      aria-label={`Select order ${r.id}`}
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
                    <Link href={`/dashboard/pages/orders/${r.id}`} className="font-medium hover:underline">
                      #{r.id}
                    </Link>
                  </TableCell>
                  {show("product") && (
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image src={r.productImage} alt={r.product} width={40} height={40} className="size-10 rounded-lg border object-cover" />
                        <div>
                          <div className="max-w-56 truncate font-medium">{r.product}</div>
                          {r.extraItems > 0 && <div className="text-xs text-muted-foreground">+{r.extraItems} more item</div>}
                        </div>
                      </div>
                    </TableCell>
                  )}
                  {show("customer") && (
                    <TableCell>
                      <div className="font-medium">{r.customer}</div>
                      <div className="text-xs text-muted-foreground">{r.email}</div>
                    </TableCell>
                  )}
                  {show("type") && <TableCell>{r.type}</TableCell>}
                  {show("price") && <TableCell>{r.priceLabel}</TableCell>}
                  {show("date") && <TableCell>{r.dateLabel}</TableCell>}
                  {show("status") && (
                    <TableCell>
                      <StatusBadge status={r.status} />
                    </TableCell>
                  )}
                  <TableCell className="pr-(--card-spacing)">
                    <RowActions
                      viewHref={`/dashboard/pages/orders/${r.id}`}
                      viewLabel="View order"
                      copyValue={r.id}
                      copyLabel="Copy order ID"
                      danger="Cancel order"
                    />
                  </TableCell>
                </TableRow>
              ))}
              {visible.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex flex-col items-center justify-between gap-3 border-t px-(--card-spacing) py-3 sm:flex-row">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
                {filtered.length === 0 ? 0 : current * pageSize + 1} - {Math.min(filtered.length, (current + 1) * pageSize)} of {filtered.length}
              </span>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon-sm" className="size-7" disabled={current === 0} onClick={() => setPage(current - 1)}>
                  <span className="sr-only">Previous page</span>
                  <ChevronLeft />
                </Button>
                {Array.from({ length: pages }, (_, i) => (
                  <Button key={i} variant={i === current ? "outline" : "ghost"} size="icon-sm" className="size-7" onClick={() => setPage(i)}>
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
    </Tabs>
  );
}
