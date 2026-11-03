"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@b2c/ui/components/card";
import { Cell, Pie, PieChart, Tooltip } from "recharts";
import { ChartFrame, ChartTooltip } from "@/components/ecommerce/chart";

const sources = [
  { name: "Direct", value: 275, fill: "var(--chart-1)" },
  { name: "Social", value: 200, fill: "var(--chart-2)" },
  { name: "Email", value: 187, fill: "var(--chart-3)" },
  { name: "Referrals", value: 173, fill: "var(--chart-4)" },
  { name: "Other", value: 90, fill: "var(--chart-5)" },
];

export function StoreVisitsCard() {
  return (
    <Card className="lg:col-span-6 xl:col-span-3">
      <CardHeader>
        <CardTitle>Store Visits by Source</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-between gap-4">
        <ChartFrame className="mx-auto aspect-square max-h-[260px]">
          <PieChart>
            <Tooltip content={<ChartTooltip />} />
            <Pie data={sources} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="90%" paddingAngle={2} cornerRadius={4}>
              {sources.map((s) => (
                <Cell key={s.name} fill={s.fill} stroke="var(--card)" />
              ))}
            </Pie>
          </PieChart>
        </ChartFrame>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {sources.map((s) => (
            <div key={s.name} className="flex items-center gap-2 text-xs">
              <span className="size-2.5 rounded-[2px]" style={{ background: s.fill }} />
              {s.name}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
