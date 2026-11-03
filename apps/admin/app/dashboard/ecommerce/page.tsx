import { Button } from "@b2c/ui/components/button";
import { CalendarDays, Download } from "lucide-react";
import { BestSellingCard } from "@/components/ecommerce/best-selling";
import { CustomerReviewsCard } from "@/components/ecommerce/customer-reviews";
import { KpiCards } from "@/components/ecommerce/kpi-cards";
import { RecentOrdersCard } from "@/components/ecommerce/recent-orders";
import { ReturningRateCard, TotalRevenueCard } from "@/components/ecommerce/revenue-charts";
import { SalesByLocationCard } from "@/components/ecommerce/sales-by-location";
import { StoreVisitsCard } from "@/components/ecommerce/store-visits";
import { WelcomeCard } from "@/components/ecommerce/welcome-card";
import { adminProducts, initials, money, orders, unitsSold } from "@/lib/data";

export const metadata = { title: "E-Commerce Dashboard" };

export default function EcommerceDashboardPage() {
  const recent = orders.map((o) => ({
    id: o.id,
    customer: o.customer.name,
    initials: initials(o.customer.name),
    product: o.items[0]!.product.name,
    amount: o.total,
    amountLabel: money(o.total),
    status: o.paymentStatus,
  }));

  const best = [...adminProducts]
    .sort((a, b) => unitsSold(b) * b.price - unitsSold(a) * a.price)
    .slice(0, 8)
    .map((p) => ({ id: p.id, name: p.name, image: p.image, salesLabel: money(unitsSold(p) * p.price), sold: unitsSold(p) }));

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">E-Commerce Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="font-normal">
            <CalendarDays />
            07 Oct 2026 - 03 Nov 2026
          </Button>
          <Button size="sm">
            <Download />
            <span className="hidden lg:inline">Export</span>
          </Button>
        </div>
      </div>

      <div className="space-y-4 lg:space-y-6">
        <div className="grid gap-4 lg:grid-cols-12 lg:gap-6">
          <WelcomeCard />
          <KpiCards />
        </div>

        <div className="space-y-4 lg:space-y-6 xl:grid xl:grid-cols-2 xl:gap-6 xl:space-y-0">
          <TotalRevenueCard />
          <ReturningRateCard />
        </div>

        <div className="grid gap-4 lg:grid-cols-12 lg:gap-6">
          <SalesByLocationCard />
          <StoreVisitsCard />
          <CustomerReviewsCard />
        </div>

        <div className="space-y-4 lg:space-y-6 xl:grid xl:grid-cols-12 xl:gap-6 xl:space-y-0">
          <RecentOrdersCard rows={recent} />
          <BestSellingCard rows={best} />
        </div>
      </div>
    </div>
  );
}
