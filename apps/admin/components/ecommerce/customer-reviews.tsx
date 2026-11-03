import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@b2c/ui/components/card";
import { buttonVariants } from "@b2c/ui/components/button";
import { ChevronRight, Info, Star } from "lucide-react";
import Link from "next/link";

const breakdown = [
  { stars: 5, count: 4000, color: "bg-green-400" },
  { stars: 4, count: 2100, color: "bg-lime-500" },
  { stars: 3, count: 800, color: "bg-yellow-400" },
  { stars: 2, count: 631, color: "bg-orange-400" },
  { stars: 1, count: 344, color: "bg-red-400" },
];
const max = Math.max(...breakdown.map((b) => b.count));

export function CustomerReviewsCard() {
  return (
    <Card className="lg:col-span-12 xl:col-span-5">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          Customer Reviews
          <Info className="size-3.5 text-muted-foreground" />
        </CardTitle>
        <CardAction>
          <Link href="/dashboard/pages/products/1" className={buttonVariants({ variant: "outline", size: "xs", className: "h-7" })}>
            View All
            <ChevronRight />
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid items-center space-y-4 lg:grid-cols-3 lg:space-y-0 lg:gap-6">
          <div className="flex flex-col gap-2 lg:col-span-1">
            <div className="flex gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className="size-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <div className="text-3xl font-bold">4.5</div>
            <div className="text-sm text-muted-foreground">out of 5</div>
          </div>
          <div className="w-full space-y-3 lg:col-span-2">
            {breakdown.map((b) => (
              <div key={b.stars} className="flex items-center gap-3">
                <div className="w-8 text-sm font-medium">{b.stars}★</div>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className={`h-full rounded-full ${b.color}`} style={{ width: `${(b.count / max) * 100}%` }} />
                </div>
                <div className="w-12 text-right text-sm font-medium">{b.count}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3 rounded-lg border bg-muted p-4">
          <div className="flex flex-col justify-between gap-1 md:flex-row md:items-center">
            <div className="space-y-1">
              <div className="flex gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <h4 className="font-medium">Exceeded my expectations!</h4>
            </div>
            <div className="text-xs text-muted-foreground">March 12, 2025</div>
          </div>
          <p className="text-sm text-muted-foreground">
            I was skeptical at first, but this product has made my daily routine so much easier. The quality is
            excellent and it&apos;s simple to use.
          </p>
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium">Sarah J.</span>
            <span className="text-muted-foreground">Verified Purchase</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
