"use client";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@b2c/ui/components/card";
import { Input } from "@b2c/ui/components/input";
import { Table, TableBody, TableCell, TableRow } from "@b2c/ui/components/table";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ExportButton } from "@/components/common/export-button";
import { RowActions } from "@/components/common/row-actions";
import { SimplePager } from "@/components/common/simple-pager";

export type BestSellerRow = { id: number; name: string; image: string; salesLabel: string; sold: number };

const PAGE = 8;

export function BestSellingCard({ rows }: { rows: BestSellerRow[] }) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const filtered = useMemo(() => rows.filter((r) => r.name.toLowerCase().includes(q.trim().toLowerCase())), [rows, q]);
  const visible = filtered.slice(page * PAGE, page * PAGE + PAGE);

  return (
    <Card className="xl:col-span-5">
      <CardHeader>
        <CardTitle>Best Selling Products</CardTitle>
        <CardAction>
          <ExportButton />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col p-0">
        <div className="flex items-center gap-2 border-b px-(--card-spacing) py-3">
          <Input
            placeholder="Filter products..."
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(0);
            }}
            className="h-8 max-w-xs"
          />
        </div>
        <Table>
          <TableBody>
            {visible.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="pl-(--card-spacing)">
                  <Link href={`/dashboard/pages/products/${r.id}`} className="flex items-center gap-3">
                    <Image src={r.image} alt={r.name} width={32} height={32} className="size-8 rounded-md object-cover" />
                    <div className="max-w-48 truncate font-medium hover:underline">{r.name}</div>
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{r.salesLabel}</div>
                </TableCell>
                <TableCell>
                  <div className="text-muted-foreground">{r.sold} sold</div>
                </TableCell>
                <TableCell className="pr-(--card-spacing)">
                  <RowActions
                    viewHref={`/dashboard/pages/products/${r.id}`}
                    viewLabel="View product"
                    copyValue={r.name}
                    copyLabel="Copy name"
                    editHref="/dashboard/pages/products/create"
                  />
                </TableCell>
              </TableRow>
            ))}
            {visible.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <SimplePager page={page} pageSize={PAGE} total={filtered.length} noun="products" onPage={setPage} />
      </CardContent>
    </Card>
  );
}
