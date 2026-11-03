"use client";

import { Button } from "@b2c/ui/components/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function SimplePager({
  page,
  pageSize,
  total,
  noun,
  onPage,
}: {
  page: number;
  pageSize: number;
  total: number;
  noun: string;
  onPage: (p: number) => void;
}) {
  const from = total === 0 ? 0 : page * pageSize + 1;
  const to = Math.min(total, (page + 1) * pageSize);
  const last = Math.max(0, Math.ceil(total / pageSize) - 1);
  return (
    <div className="flex items-center justify-between gap-2 border-t px-(--card-spacing) py-3">
      <div className="text-sm text-muted-foreground">
        {from} - {to} of {total} {noun}
      </div>
      <div className="flex gap-1">
        <Button variant="outline" size="icon-sm" className="size-7" disabled={page === 0} onClick={() => onPage(page - 1)}>
          <span className="sr-only">Previous page</span>
          <ChevronLeft />
        </Button>
        <Button variant="outline" size="icon-sm" className="size-7" disabled={page >= last} onClick={() => onPage(page + 1)}>
          <span className="sr-only">Next page</span>
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
