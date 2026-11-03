"use client";

import { Button } from "@b2c/ui/components/button";
import { Copy, Pencil, Printer } from "lucide-react";
import { toast } from "sonner";

export function PrintButton() {
  return (
    <Button variant="outline" size="sm" onClick={() => window.print()}>
      <Printer />
      Print
    </Button>
  );
}

export function EditOrderButton() {
  return (
    <Button size="sm" onClick={() => toast.info("Order editing will be enabled once the API is connected.")}>
      <Pencil />
      Edit
    </Button>
  );
}

export function CopyButton({ value, label }: { value: string; label: string }) {
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className="size-7"
      onClick={() => {
        navigator.clipboard?.writeText(value);
        toast.success(`${label} copied`);
      }}
    >
      <span className="sr-only">Copy {label.toLowerCase()}</span>
      <Copy />
    </Button>
  );
}
