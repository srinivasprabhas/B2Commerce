"use client";

import { Button } from "@b2c/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@b2c/ui/components/dropdown-menu";
import { FolderUp } from "lucide-react";
import { toast } from "sonner";

export function ExportButton({ size = "sm" }: { size?: "sm" | "xs" }) {
  const go = (fmt: string) => toast.success(`Export as ${fmt} started`);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size={size === "xs" ? "xs" : "sm"} className={size === "xs" ? "h-7" : ""} />}>
        <FolderUp />
        <span className="hidden sm:inline">Export</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => go("Excel")}>Excel</DropdownMenuItem>
        <DropdownMenuItem onClick={() => go("PDF")}>PDF</DropdownMenuItem>
        <DropdownMenuItem onClick={() => go("CSV")}>CSV</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
