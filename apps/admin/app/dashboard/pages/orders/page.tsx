import { Button } from "@b2c/ui/components/button";
import { PlusCircle } from "lucide-react";
import { OrdersTable } from "@/components/orders/orders-table";
import { money, orders, shortDate } from "@/lib/data";

export const metadata = { title: "Orders" };

export default function OrdersPage() {
  const rows = orders.map((o) => ({
    id: o.id,
    product: o.items[0]!.product.name,
    productImage: o.items[0]!.product.image,
    extraItems: o.items.length - 1,
    customer: o.customer.name,
    email: o.customer.email,
    type: o.type,
    price: o.total,
    priceLabel: money(o.total),
    date: o.date,
    dateLabel: shortDate(o.date),
    status: o.status,
  }));

  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Orders</h1>
        <Button size="sm">
          <PlusCircle />
          Create Order
        </Button>
      </div>
      <OrdersTable rows={rows} />
    </div>
  );
}
