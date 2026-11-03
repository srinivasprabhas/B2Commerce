import { BadgeCheck, PackageCheck, Truck } from "lucide-react";

const features = [
  { icon: BadgeCheck, title: "Quality Checked", description: "Every product is inspected before it leaves our warehouse." },
  { icon: Truck, title: "Fast Delivery", description: "Orders ship within 1–3 business days with tracking included." },
  { icon: PackageCheck, title: "Easy Returns", description: "Changed your mind? Return it within 30 days, no questions asked." },
];

export function ProductFeatures() {
  return (
    <section className="mt-20 border-t border-border pt-16">
      <h2 className="mb-12 text-center text-3xl font-medium tracking-tight">Shop with confidence</h2>
      <div className="grid gap-8 md:grid-cols-3">
        {features.map(({ icon: Icon, title, description }) => (
          <div key={title} className="group flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary transition-colors group-hover:bg-foreground">
              <Icon className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-background" />
            </div>
            <h3 className="mb-2 text-lg font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
