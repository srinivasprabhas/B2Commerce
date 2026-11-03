"use client";

import { Search } from "lucide-react";
import { useId, useRef } from "react";
import { Suggestions } from "@/components/search/suggestions";
import { useSuggestions } from "@/components/search/use-suggestions";

export function MobileSearchInput({ onNavigate }: { onNavigate: () => void }) {
  const c = useSuggestions();
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const done = () => {
    inputRef.current?.blur();
    onNavigate();
  };

  return (
    <search>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          c.goToSearch(done);
        }}
      >
        <label htmlFor={`${listId}-input`} className="sr-only">
          Search products
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={inputRef}
            id={`${listId}-input`}
            type="search"
            placeholder="Search products"
            value={c.query}
            onChange={(e) => c.setQuery(e.target.value)}
            onKeyDown={(e) => c.onKeyDown(e, done)}
            role="combobox"
            aria-expanded={c.enoughChars}
            aria-controls={listId}
            aria-autocomplete="list"
            enterKeyHint="search"
            autoComplete="off"
            className="h-12 w-full rounded-full border border-border bg-background pr-4 pl-12 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
          />
        </div>
        {c.enoughChars && (
          <div className="mt-3 border-t border-border pt-1">
            <Suggestions listboxId={listId} c={c} onDone={done} />
          </div>
        )}
      </form>
    </search>
  );
}
