"use client";

import { Button } from "@b2c/ui/components/button";
import { cn } from "@b2c/ui/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const go = (d: number) => setActive((a) => (a + d + images.length) % images.length);

  return (
    <div className="space-y-4">
      <div className="group relative overflow-hidden rounded-lg">
        <Image
          src={images[active]!}
          alt={name}
          width={800}
          height={800}
          priority
          className="aspect-3/2 w-full rounded-lg object-cover lg:aspect-square"
        />
        {images.length > 1 && (
          <>
            <Button variant="outline" size="icon-sm" className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full" onClick={() => go(-1)}>
              <ChevronLeft />
              <span className="sr-only">Previous image</span>
            </Button>
            <Button variant="outline" size="icon-sm" className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full" onClick={() => go(1)}>
              <ChevronRight />
              <span className="sr-only">Next image</span>
            </Button>
          </>
        )}
      </div>
      <div className="grid grid-cols-4 gap-3">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              "overflow-hidden rounded-lg border transition-opacity hover:opacity-100",
              i === active ? "ring-2 ring-primary" : "opacity-60",
            )}
          >
            <Image src={src} alt={`${name} ${i + 1}`} width={160} height={160} className="aspect-square w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
