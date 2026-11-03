"use client";

import { cn } from "@b2c/ui/lib/utils";
import type { ReactNode } from "react";
import { ResponsiveContainer } from "recharts";

/** Minimal chart frame: sizes the chart and styles recharts' axes/grid with theme tokens. */
export function ChartFrame({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      data-slot="chart"
      className={cn(
        "flex w-full justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border/50 [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
        className,
      )}
    >
      <ResponsiveContainer width="100%" height="100%">
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  );
}

type TooltipPayload = { name?: string | number; value?: number | string; color?: string; payload?: { fill?: string } };

export function ChartTooltip({
  active,
  payload,
  label,
  formatter = (v) => String(v),
  labelFormatter = (l) => String(l),
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string | number;
  formatter?: (v: number | string) => string;
  labelFormatter?: (l: string | number) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="grid min-w-32 gap-1.5 rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-xl">
      {label !== undefined && <div className="font-medium">{labelFormatter(label)}</div>}
      {payload.map((p) => (
        <div key={String(p.name)} className="flex items-center gap-2">
          <span className="size-2.5 shrink-0 rounded-[2px]" style={{ background: p.color ?? p.payload?.fill }} />
          <span className="text-muted-foreground capitalize">{p.name}</span>
          <span className="ml-auto font-mono font-medium tabular-nums">{p.value !== undefined ? formatter(p.value) : ""}</span>
        </div>
      ))}
    </div>
  );
}
