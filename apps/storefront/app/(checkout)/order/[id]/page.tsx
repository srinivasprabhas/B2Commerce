import type { Metadata } from "next";
import { OrderConfirmation } from "@/app/(checkout)/order/[id]/order-confirmation";

export const metadata: Metadata = { title: "Order Confirmed", robots: { index: false } };

export default async function OrderPage({ params }: PageProps<"/order/[id]">) {
  const { id } = await params;
  return <OrderConfirmation id={id} />;
}
