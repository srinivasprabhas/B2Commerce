import { buttonVariants } from "@b2c/ui/components/button";
import { Separator } from "@b2c/ui/components/separator";
import { cn } from "@b2c/ui/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { StatCard } from "@/components/common/stat-card";

const kpis = [
  { title: "MRR", value: "$34.1K", change: "6.1%", direction: "up" as const },
  { title: "Users", value: "500.1K", change: "19.2%", direction: "up" as const },
  { title: "User growth", value: "11.3%", change: "1.2%", direction: "down" as const },
];

export function KpiCards() {
  return (
    <div className="md:col-span-12 lg:col-span-8">
      <div className="grid h-full w-full grid-cols-1 gap-4 md:grid-cols-3 lg:gap-6">
        {kpis.map((k) => (
          <StatCard
            key={k.title}
            {...k}
            footer={
              <>
                <Separator />
                <Link
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "link" }),
                    "h-auto w-full justify-between p-0 text-xs text-muted-foreground hover:text-foreground",
                  )}
                >
                  View more
                  <ArrowRight className="size-3" />
                </Link>
              </>
            }
          />
        ))}
      </div>
    </div>
  );
}
