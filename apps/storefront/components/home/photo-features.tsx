"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type Feature = { title: string; text: string; images: [string, string] };

/** Expanding feature list on the left; the two photos on the right follow the selected item. */
export function PhotoFeatures({ features }: { features: Feature[] }) {
  const [active, setActive] = useState(0);
  const current = features[active]!;

  return (
    <div className="grid items-start gap-[clamp(32px,4vw,70px)] lg:grid-cols-[minmax(300px,30%)_1fr]">
      <div>
        <p className="text-lg">Photos &amp; Setups</p>
        <h2 className="mt-6 mb-12 text-[clamp(30px,3.2vw,48px)] leading-[1.12] font-medium tracking-[-0.045em]">Customers enjoy their setups everyday</h2>
        <div className="border-l-2 border-border">
          {features.map((f, i) => (
            <button
              key={f.title}
              type="button"
              aria-expanded={i === active}
              onClick={() => setActive(i)}
              className={cn("-ml-0.5 block w-full border-l-2 pb-8 pl-7 text-left transition-colors", i === active ? "border-primary" : "border-transparent")}
            >
              <span className={cn("block text-2xl font-medium tracking-[-0.02em] transition-colors", i === active ? "text-foreground" : "text-[#8c93a0]")}>
                {f.title}
              </span>
              <span className={cn("grid transition-[grid-template-rows] duration-500", i === active ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                <span className="overflow-hidden">
                  <span className="block pt-4 text-[17px]">{f.text}</span>
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3.5 sm:gap-9">
        {current.images.map((src, k) => (
          <figure key={src} className={cn("relative m-0 aspect-[.78] overflow-hidden rounded-[20px] bg-secondary", k === 1 && "mt-16 sm:mt-[120px]")}>
            <Image src={src} alt={current.title} fill sizes="(max-width: 1024px) 50vw, 35vw" className="animate-in object-cover fade-in duration-500" />
          </figure>
        ))}
      </div>
    </div>
  );
}
