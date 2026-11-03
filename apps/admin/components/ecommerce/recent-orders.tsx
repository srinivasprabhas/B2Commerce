"use client";

import { Avatar, AvatarFallback } from "@b2c/ui/components/avatar";
import { Button } from "@b2c/ui/components/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@b2c/ui/components/card";
import { Input } from "@b2c/ui/components/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@b2c/ui/components/table";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ExportButton } from "@/components/common/export-button";
import { RowActions } from "@/components/common/row-actions";
import { SimplePager } from "@/components/common/simple-pager";
import { StatusBadge } from "@/components/common/status-badge";

export type RecentOrderRow = {
  id: string;
  customer: string;
  initials: string;
  product: string;
  amount: number;
  amountLabel: string;
  status: string;
};

const PAGE = 8;

export function RecentOrdersCard({ rows }: { rows: RecentOrderRow[] }) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"asc" | "desc" | null>(null);
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    const list = rows.filter((r) => !s || `${r.id} ${r.customer} ${r.product} ${r.status}`.toLowerCase().includes(s));
    if (sort) list.sort((a, b) => (sort === "asc" ? a.amount - b.amount : b.amount - a.amount));
    return list;
  }, [rows, q, sort]);
  const visible = filtered.slice(page * PAGE, page * PAGE + PAGE);

  return (
    <Card className="xl:col-span-7">
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardAction>
          <ExportButton />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col p-0">
        <div className="flex items-center gap-2 border-b px-(--card-spacing) py-3">
          <Input
            placeholder="Filter orders..."
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(0);
            }}
            className="h-8 max-w-xs"
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-(--card-spacing)">ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" className="p-0! hover:bg-transparent" onClick={() => setSort(sort === "asc" ? "desc" : "asc")}>
                  Amount
                  <ArrowUpDown className="size-3" />
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="pl-(--card-spacing)">
                  <Link href={`/dashboard/pages/orders/${r.id}`} className="hover:underline">
                    #{r.id}
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>{r.initials}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{r.customer}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-48 truncate">{r.product}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{r.amountLabel}</div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={r.status} />
                </TableCell>
                <TableCell className="pr-(--card-spacing)">
                  <RowActions viewHref={`/dashboard/pages/orders/${r.id}`} viewLabel="View order" copyValue={r.id} copyLabel="Copy order ID" />
                </TableCell>
              </TableRow>
            ))}
            {visible.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <SimplePager page={page} pageSize={PAGE} total={filtered.length} noun="orders" onPage={setPage} />
      </CardContent>
    </Card>
  );
}
