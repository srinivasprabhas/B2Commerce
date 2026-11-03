"use client";

import { Button } from "@b2c/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@b2c/ui/components/dropdown-menu";
import { Ellipsis } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export function RowActions({
  viewHref,
  viewLabel = "View details",
  copyValue,
  copyLabel = "Copy ID",
  editHref,
  danger,
}: {
  viewHref: string;
  viewLabel?: string;
  copyValue: string;
  copyLabel?: string;
  editHref?: string;
  danger?: string;
}) {
  return (
    <div className="text-right">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" className="size-7" />}>
          <span className="sr-only">Open menu</span>
          <Ellipsis />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard?.writeText(copyValue);
                toast.success("Copied to clipboard");
              }}
            >
              {copyLabel}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem render={<Link href={viewHref} />}>{viewLabel}</DropdownMenuItem>
          {editHref && <DropdownMenuItem render={<Link href={editHref} />}>Edit</DropdownMenuItem>}
          {danger && (
            <DropdownMenuItem variant="destructive" onClick={() => toast.error(`${danger} — connect the API to enable`)}>
              {danger}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
