import { Badge } from "@b2c/ui/components/badge";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@b2c/ui/components/card";
import { Progress } from "@b2c/ui/components/progress";
import { Info } from "lucide-react";
import { ExportButton } from "@/components/common/export-button";

const locations = [
  { country: "Canada", change: 5.2, share: 85 },
  { country: "Greenland", change: 7.8, share: 80 },
  { country: "Russia", change: -2.1, share: 63 },
  { country: "China", change: 3.4, share: 60 },
  { country: "Australia", change: 1.2, share: 45 },
  { country: "Greece", change: 1, share: 40 },
];

export function SalesByLocationCard() {
  return (
    <Card className="lg:col-span-6 xl:col-span-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          Sales by Location
          <Info className="size-3.5 text-muted-foreground" />
        </CardTitle>
        <CardAction>
          <ExportButton size="xs" />
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {locations.map((l) => (
            <div key={l.country} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{l.country}</span>
                  <Badge variant="outline" className={l.change >= 0 ? "text-green-600" : "text-red-600"}>
                    {l.change >= 0 ? "+" : ""}
                    {l.change}%
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">{l.share}%</div>
              </div>
              <Progress value={l.share} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
