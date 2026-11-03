"use client";

import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useSelectedVariant } from "@/app/(shop)/product/[slug]/selected-variant";
import { Button } from "@b2c/ui/components/button";
import { cn } from "@/lib/utils";

export function MediaGallery({ images, productName }: { images: string[]; productName: string }) {
  const { selected } = useSelectedVariant();
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  // Jump to the selected variant's first photo whenever the variant changes.
  const variantImage = selected?.images[0];
  const [lastVariantImage, setLastVariantImage] = useState(variantImage);
  if (variantImage !== lastVariantImage) {
    setLastVariantImage(variantImage);
    const i = variantImage ? images.indexOf(variantImage) : -1;
    if (i >= 0) setIndex(i);
  }

  const prev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl bg-secondary lg:sticky lg:top-24 lg:self-start">
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Product media gallery"
      onKeyDown={(e) => {
        if (images.length <= 1) return;
        if (e.key === "ArrowLeft") prev();
        if (e.key === "ArrowRight") next();
      }}
      className="flex flex-col gap-4 outline-none lg:sticky lg:top-24 lg:self-start"
    >
      <div className="group relative aspect-square overflow-hidden rounded-2xl bg-secondary">
        <Image
          src={images[index] ?? ""}
          alt={`${productName} - View ${index + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, min(50vw, 640px)"
          className={cn("object-cover transition-transform duration-500", zoomed && "scale-150 cursor-zoom-out")}
          onClick={() => setZoomed((z) => !z)}
          priority
        />

        {images.length > 1 && (
          <div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 justify-between opacity-0 transition-opacity group-hover:opacity-100">
            {[
              { label: "Previous image", onClick: prev, Icon: ChevronLeft },
              { label: "Next image", onClick: next, Icon: ChevronRight },
            ].map(({ label, onClick, Icon }) => (
              <Button
                key={label}
                variant="secondary"
                size="icon"
                aria-label={label}
                className="h-10 w-10 rounded-full bg-background/90 shadow-lg backdrop-blur-sm hover:bg-background"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
              >
                <Icon className="h-5 w-5" />
              </Button>
            ))}
          </div>
        )}

        <div className="absolute right-4 bottom-4 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex items-center gap-2 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
            <ZoomIn className="h-3.5 w-3.5" />
            Click to zoom
          </div>
        </div>

        {images.length > 1 && (
          <div className="absolute bottom-4 left-4 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
            {index + 1} / {images.length}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="-m-2 flex gap-3 overflow-x-auto p-2">
          {images.map((image, i) => (
            <button
              key={image}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1}`}
              className={cn(
                "relative aspect-square w-20 shrink-0 overflow-hidden rounded-lg transition-all duration-200",
                index === i ? "ring-2 ring-foreground ring-offset-2 ring-offset-background" : "opacity-60 hover:opacity-100",
              )}
            >
              <Image src={image} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
