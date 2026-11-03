import { Card, CardContent } from "@b2c/ui/components/card";
import { buttonVariants } from "@b2c/ui/components/button";
import Link from "next/link";

export function WelcomeCard() {
  return (
    <Card className="relative overflow-hidden bg-muted md:col-span-12 lg:col-span-4">
      <CardContent className="flex flex-col justify-between gap-6">
        <div className="space-y-2">
          <div className="text-2xl font-semibold tracking-tight">Congratulations Toby! 🎉</div>
          <div className="text-muted-foreground">Best seller of the month</div>
        </div>
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="text-3xl font-semibold tracking-tight">$15,231.89</div>
            <div className="text-xs text-muted-foreground">
              <span className="font-medium text-green-600">+65%</span> from last month
            </div>
          </div>
          <Link href="/dashboard/pages/orders" className={buttonVariants({ variant: "outline", size: "sm" })}>
            View Sales
          </Link>
        </div>
      </CardContent>
      {/* decorative star shape */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        className="pointer-events-none absolute -top-6 -right-6 size-32 text-primary/10"
        fill="currentColor"
      >
        <path d="M50 0 61 35 98 35 68 57 79 92 50 70 21 92 32 57 2 35 39 35Z" />
      </svg>
    </Card>
  );
}
