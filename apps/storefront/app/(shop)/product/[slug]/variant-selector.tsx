"use client";

import { useSelectedVariant } from "@/app/(shop)/product/[slug]/selected-variant";
import { cn } from "@/lib/utils";

type Group = { name: string; kind: "text" | "color"; values: { value: string; swatch?: string; available: boolean }[] };

export function VariantSelector() {
  const { variants, selection, select } = useSelectedVariant();

  const groups: Group[] = [];
  for (const variant of variants) {
    for (const o of variant.options) {
      let group = groups.find((g) => g.name === o.name);
      if (!group) {
        group = { name: o.name, kind: o.kind, values: [] };
        groups.push(group);
      }
      const existing = group.values.find((v) => v.value === o.value);
      const available = variant.stock !== 0;
      if (existing) existing.available ||= available;
      else group.values.push({ value: o.value, swatch: o.swatch, available });
    }
  }
  const withChoices = groups.filter((g) => g.values.length > 1);
  if (withChoices.length === 0) return null;

  return (
    <div className="space-y-8">
      {withChoices.map((group) => (
        <fieldset key={group.name} className="m-0 border-0 p-0">
          <div className="mb-3 flex items-center justify-between">
            <legend className="text-sm font-medium">{group.name}</legend>
            {group.kind === "color" && selection[group.name] && (
              <span className="text-sm text-muted-foreground">{selection[group.name]}</span>
            )}
          </div>
          <div className={cn("flex", group.kind === "color" ? "gap-3" : "flex-wrap gap-3")}>
            {group.values.map((option) => {
              const isSelected = selection[group.name] === option.value;
              if (group.kind === "color") {
                const light = ["#FFFFFF", "#FFF", "#FFFFF0"].includes(option.swatch?.toUpperCase() ?? "");
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => select(group.name, option.value)}
                    aria-label={option.value}
                    aria-pressed={isSelected}
                    title={option.value}
                    style={{ backgroundColor: option.swatch ?? "#fff" }}
                    className={cn(
                      "relative h-12 w-12 rounded-full transition-all duration-200",
                      isSelected
                        ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                        : "hover:ring-2 hover:ring-muted-foreground hover:ring-offset-2 hover:ring-offset-background",
                    )}
                  >
                    {light && <span className="absolute inset-0 rounded-full border border-border" />}
                  </button>
                );
              }
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => select(group.name, option.value)}
                  aria-pressed={isSelected}
                  className={cn(
                    "flex flex-col items-center rounded-lg border-2 px-6 py-3 transition-all duration-200",
                    isSelected
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background hover:border-muted-foreground",
                    !option.available && !isSelected && "text-muted-foreground line-through",
                  )}
                >
                  <span className="text-sm font-medium">{option.value}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
