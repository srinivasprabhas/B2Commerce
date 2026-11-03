import { type LucideIcon, RotateCcw, Shield, Truck } from "lucide-react";

const badges: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: Truck, title: "Free Shipping", description: "Orders over $75" },
  { icon: Shield, title: "Secure Checkout", description: "Encrypted payments" },
  { icon: RotateCcw, title: "30-Day Returns", description: "Hassle-free" },
];

export function TrustBadges() {
  return (
    <div className="grid grid-cols-3 gap-4 rounded-xl bg-secondary/50 p-4">
      {badges.map((badge) => (
        <div key={badge.title} className="flex flex-col items-center text-center">
          <badge.icon className="mb-2 h-5 w-5 text-muted-foreground" />
          <span className="text-xs font-medium">{badge.title}</span>
          <span className="text-[10px] text-muted-foreground">{badge.description}</span>
        </div>
      ))}
    </div>
  );
}
