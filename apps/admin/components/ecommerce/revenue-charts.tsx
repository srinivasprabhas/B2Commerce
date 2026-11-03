"use client";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@b2c/ui/components/card";
import { Badge } from "@b2c/ui/components/badge";
import { Info } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { ExportButton } from "@/components/common/export-button";
import { ChartFrame, ChartTooltip } from "@/components/ecommerce/chart";

// 90 days of deterministic demo traffic
const revenue = Array.from({ length: 90 }, (_, i) => {
  const d = new Date(Date.UTC(2026, 7, 5) + i * 86_400_000);
  return {
    date: d.toISOString().slice(0, 10),
    desktop: Math.round(180 + 140 * Math.abs(Math.sin(i * 0.37)) + 60 * Math.cos(i * 0.11)),
    mobile: Math.round(190 + 130 * Math.abs(Math.cos(i * 0.29)) + 50 * Math.sin(i * 0.17)),
  };
});
const totals = {
  desktop: revenue.reduce((s, r) => s + r.desktop, 0),
  mobile: revenue.reduce((s, r) => s + r.mobile, 0),
};

const returning = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 273, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 314, mobile: 240 },
  { month: "Jul", desktop: 280, mobile: 210 },
  { month: "Aug", desktop: 342, mobile: 260 },
];

const fmtDay = (v: string) =>
  new Date(`${v}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

export function TotalRevenueCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          Total Revenue
          <Info className="size-3.5 text-muted-foreground" />
        </CardTitle>
        <CardAction className="flex items-center gap-6">
          {(["desktop", "mobile"] as const).map((k) => (
            <div key={k} className="flex items-center gap-2">
              <span className={`size-2.5 rounded-[2px] ${k === "desktop" ? "bg-chart-1" : "bg-chart-2"}`} />
              <span className="text-xs text-muted-foreground capitalize">{k}</span>
              <span className="font-semibold tabular-nums">{totals[k].toLocaleString("en-US")}</span>
            </div>
          ))}
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartFrame className="aspect-video lg:aspect-auto lg:h-[300px]">
          <BarChart data={revenue} margin={{ left: 0, right: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} tickFormatter={fmtDay} />
            <Tooltip cursor={{ fill: "var(--muted)" }} content={<ChartTooltip labelFormatter={(l) => fmtDay(String(l))} />} />
            <Bar dataKey="desktop" fill="var(--chart-1)" radius={[2, 2, 0, 0]} />
            <Bar dataKey="mobile" fill="var(--chart-2)" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ChartFrame>
      </CardContent>
    </Card>
  );
}

export function ReturningRateCard() {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Returning Rate</CardDescription>
        <CardAction>
          <ExportButton />
        </CardAction>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-semibold tracking-tight">$42,379</span>
          <Badge variant="outline">+2.5%</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ChartFrame className="aspect-21/9 md:mt-6">
          <LineChart data={returning} margin={{ left: 0, right: 12, top: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} width={32} />
            <Tooltip content={<ChartTooltip />} />
            <Line dataKey="desktop" type="natural" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
            <Line dataKey="mobile" type="natural" stroke="var(--chart-2)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartFrame>
      </CardContent>
    </Card>
  );
}
