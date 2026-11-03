"use client";

import Image from "next/image";
import type { SuggestionsController } from "@/components/search/use-suggestions";
import { formatMoney } from "@/lib/money";

function Highlighted({ text, query }: { text: string; query: string }) {
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (!query || index < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)}
      <mark className="bg-transparent font-semibold text-foreground">{text.slice(index, index + query.length)}</mark>
      {text.slice(index + query.length)}
    </>
  );
}

export function Suggestions({
  listboxId,
  c,
  onDone,
}: {
  listboxId: string;
  c: SuggestionsController;
  onDone?: () => void;
}) {
  const { results, loading, highlight, setHighlight, trimmed, seeAllIndex } = c;

  return (
    <div id={listboxId} role="listbox" aria-label="Search suggestions" className="flex max-h-96 flex-col overflow-y-auto">
      {loading && results.length === 0
        ? [0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-4 border-b border-border py-3">
              <span className="h-10 w-10 flex-none animate-pulse rounded bg-secondary" />
              <span className="flex flex-1 flex-col gap-2">
                <span className="block h-3 w-2/3 animate-pulse bg-secondary" />
                <span className="block h-2.5 w-1/3 animate-pulse bg-secondary/60" />
              </span>
            </div>
          ))
        : null}

      {results.map((item, idx) => {
        const active = idx === highlight;
        return (
          <button
            key={item.slug}
            type="button"
            role="option"
            id={`${listboxId}-${idx}`}
            aria-selected={active}
            onMouseEnter={() => setHighlight(idx)}
            onClick={() => c.goToProduct(item.slug, onDone)}
            className={`flex items-center gap-4 border-b border-border py-3 text-left transition-opacity ${active ? "opacity-100" : "opacity-80 hover:opacity-100"}`}
          >
            <span className="relative h-10 w-10 flex-none overflow-hidden rounded bg-secondary">
              {item.image && <Image src={item.image} alt={item.name} fill sizes="40px" className="object-cover" />}
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm text-foreground/90">
                <Highlighted text={item.name} query={trimmed} />
              </span>
              <span className="text-xs text-muted-foreground">
                {item.price.from ? "From " : ""}
                {formatMoney(item.price.amount)}
              </span>
            </span>
            <span aria-hidden className={`transition-opacity ${active ? "opacity-100" : "opacity-0"}`}>
              →
            </span>
          </button>
        );
      })}

      {!loading && results.length === 0 ? (
        <div className="flex flex-col gap-1 border-b border-border py-6">
          <span className="text-base font-medium">Nothing for &ldquo;{trimmed}&rdquo;</span>
          <span className="text-xs text-muted-foreground">Try a shorter or different word.</span>
        </div>
      ) : null}

      {results.length > 0 && (
        <button
          type="button"
          role="option"
          id={`${listboxId}-${seeAllIndex}`}
          aria-selected={highlight === seeAllIndex}
          onMouseEnter={() => setHighlight(seeAllIndex)}
          onClick={() => c.goToSearch(onDone)}
          className="flex items-center justify-between py-3 text-left"
        >
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            See all results for <span className="font-medium normal-case tracking-normal text-foreground">{trimmed}</span>
          </span>
          <span aria-hidden>→</span>
        </button>
      )}
    </div>
  );
}
