"use client";

import { Search } from "lucide-react";
import { useId, useRef, useState } from "react";
import { Suggestions } from "@/components/search/suggestions";
import { useSuggestions } from "@/components/search/use-suggestions";

export function SearchPageInput({ initialQuery }: { initialQuery: string }) {
  const c = useSuggestions(initialQuery);
  const [interactive, setInteractive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const done = () => {
    setInteractive(false);
    inputRef.current?.blur();
  };
  const open = interactive && c.enoughChars;

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
        <div className="relative border-b border-foreground/30 transition-colors focus-within:border-foreground">
          <Search className="pointer-events-none absolute top-1/2 left-0 h-5 w-5 -translate-y-1/2 text-foreground/60" strokeWidth={1.5} />
          <input
            ref={inputRef}
            id={`${listId}-input`}
            type="search"
            placeholder="Search the store"
            value={c.query}
            onFocus={() => setInteractive(true)}
            onBlur={() => setTimeout(() => setInteractive(false), 150)}
            onChange={(e) => {
              setInteractive(true);
              c.setQuery(e.target.value);
            }}
            onKeyDown={(e) => c.onKeyDown(e, done)}
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            enterKeyHint="search"
            autoComplete="off"
            className="h-14 w-full border-0 bg-transparent pr-2 pl-8 text-2xl font-medium tracking-tight text-foreground placeholder:text-foreground/40 focus:outline-none sm:text-3xl"
          />
        </div>
        {open && (
          <div className="mt-4 border-t border-border pt-2">
            <Suggestions listboxId={listId} c={c} onDone={done} />
          </div>
        )}
      </form>
    </search>
  );
}
