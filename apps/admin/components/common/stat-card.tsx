import { Card, CardContent, CardHeader, CardTitle } from "@b2c/ui/components/card";
import type { ReactNode } from "react";
import { TrendBadge } from "@/components/common/trend-badge";

export function StatCard({
  title,
  value,
  change,
  direction = "up",
  footer,
}: {
  title: string;
  value: string;
  change?: string;
  direction?: "up" | "down";
  footer?: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-semibold tracking-tight">{value}</span>
          {change && <TrendBadge value={change} direction={direction} />}
        </div>
        {footer}
      </CardContent>
    </Card>
  );
}
