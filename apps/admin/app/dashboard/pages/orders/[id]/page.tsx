import { Button } from "@b2c/ui/components/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@b2c/ui/components/card";
import { Progress } from "@b2c/ui/components/progress";
import { Separator } from "@b2c/ui/components/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@b2c/ui/components/table";
import { cn } from "@b2c/ui/lib/utils";
import { ChevronLeft, CircleCheck, CircleCheckBig, CreditCard, SquarePen, Truck, XCircle } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/common/status-badge";
import { CopyButton, EditOrderButton, PrintButton } from "@/components/orders/order-actions";
import { getOrder, longDate, money, orders } from "@/lib/data";

export function generateStaticParams() {
  return [{ id: "detail" }, ...orders.map((o) => ({ id: o.id }))];
}

export async function generateMetadata({ params }: PageProps<"/dashboard/pages/orders/[id]">): Promise<Metadata> {
  const o = getOrder((await params).id);
  return { title: o ? `Order #${o.id}` : "Order" };
}

const steps = [
  { label: "Processing", icon: CircleCheckBig },
  { label: "Shipped", icon: Truck },
  { label: "Out for Delivery", icon: Truck },
  { label: "Delivered", icon: CircleCheck },
];
const stepIndex: Record<string, number> = { Pending: 0, Shipped: 1, Delivered: 3, Cancelled: -1 };

export default async function OrderDetailPage({ params }: PageProps<"/dashboard/pages/orders/[id]">) {
  const order = getOrder((await params).id);
  if (!order) notFound();

  const reached = stepIndex[order.status] ?? 0;
  const itemCount = order.items.reduce((s, it) => s + it.quantity, 0);
  const { customer } = order;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/pages/orders" className="rounded-md p-1 hover:bg-muted" aria-label="Back to orders">
            <ChevronLeft className="size-5" />
          </Link>
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Order Details</h1>
        </div>
        <div className="flex gap-2">
          <PrintButton />
          <EditOrderButton />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Order #{order.id}</CardTitle>
            <CardAction className="text-sm text-muted-foreground">
              Placed on <span className="text-foreground">{order.date}</span>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-4 lg:space-y-6">
            <div className="space-y-2">
              <h3 className="font-medium">Customer Information</h3>
              <p className="text-sm text-muted-foreground">{customer.name}</p>
              <p className="text-sm text-muted-foreground">{customer.email}</p>
              <p className="text-sm text-muted-foreground">{customer.address}</p>
            </div>
            <div className="flex items-center justify-between rounded-md border bg-muted/50 p-4">
              <div className="space-y-1">
                <h4 className="font-medium">Payment Method</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="size-4" />
                  {customer.payment}
                </div>
              </div>
              <Button variant="outline" size="icon-sm" aria-label="Edit payment method">
                <SquarePen />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Subtotal <span>({itemCount} items)</span>
              </span>
              <span>{money(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Discount</span>
              <span className="text-green-600">-{money(order.discount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{order.shipping === 0 ? "Free" : money(order.shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Tax <span>(8%)</span>
              </span>
              <span>{money(order.tax)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{money(order.total)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Delivery Status</CardTitle>
          <CardAction className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <StatusBadge status={order.status} />
            {order.shippedOn && <span>on {longDate(order.shippedOn)}</span>}
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-6">
          {order.status === "Cancelled" ? (
            <div className="flex items-center gap-3 text-sm text-red-600">
              <XCircle className="size-5" />
              This order was cancelled and refunded.
            </div>
          ) : (
            <>
              <div className="flex justify-between">
                {steps.map((s, i) => (
                  <div key={s.label} className="flex flex-col items-center gap-2 text-center">
                    <div
                      className={cn(
                        "flex size-10 items-center justify-center rounded-full lg:size-12",
                        i <= reached ? "bg-green-500 text-white" : "border bg-muted text-muted-foreground",
                      )}
                    >
                      <s.icon className="size-4" />
                    </div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
              <Progress value={((reached + 1) / steps.length) * 100} />
            </>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-(--card-spacing)">Product</TableHead>
                  <TableHead className="w-24">Quantity</TableHead>
                  <TableHead className="w-28">Price</TableHead>
                  <TableHead className="w-28 pr-(--card-spacing)">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((it) => (
                  <TableRow key={it.product.id}>
                    <TableCell className="pl-(--card-spacing)">
                      <Link href={`/dashboard/pages/products/${it.product.id}`} className="flex items-center gap-3">
                        <Image
                          src={it.product.image}
                          alt={it.product.name}
                          width={48}
                          height={48}
                          className="size-10 rounded-md object-cover lg:size-12"
                        />
                        <span className="font-medium hover:underline">{it.product.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell>{it.quantity}</TableCell>
                    <TableCell>{money(it.price)}</TableCell>
                    <TableCell className="pr-(--card-spacing) font-medium">{money(it.price * it.quantity)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">Customer name</span>
              <span className="font-medium">{customer.name}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">Email</span>
              <span className="flex items-center gap-1">
                <a href={`mailto:${customer.email}`} className="text-sm font-medium hover:underline">
                  {customer.email}
                </a>
                <CopyButton value={customer.email} label="Email" />
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">Phone</span>
              <span className="flex items-center gap-1">
                <a href={`tel:${customer.phone.replace(/\s/g, "")}`} className="text-sm font-medium hover:underline">
                  {customer.phone}
                </a>
                <CopyButton value={customer.phone} label="Phone" />
              </span>
            </div>
            <div className="flex items-start justify-between gap-2">
              <span className="text-muted-foreground">Address</span>
              <span className="max-w-48 text-right font-medium">{customer.address}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
