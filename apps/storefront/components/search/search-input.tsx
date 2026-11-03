"use client";

import { Search } from "lucide-react";
import { useId, useRef, useState } from "react";
import { Suggestions } from "@/components/search/suggestions";
import { useSuggestions } from "@/components/search/use-suggestions";
import { Popover, PopoverContent, PopoverTrigger } from "@b2c/ui/components/popover";

const inputClass =
  "w-full rounded-full border border-border bg-background pr-3 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30";

/** Header search: an icon popover on large screens, an inline field on extra-large screens. */
export function SearchInput() {
  const c = useSuggestions();
  const [iconOpen, setIconOpen] = useState(false);
  const [inlineOpen, setInlineOpen] = useState(false);
  const iconInputRef = useRef<HTMLInputElement>(null);
  const inlineInputRef = useRef<HTMLInputElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const iconListId = useId();
  const inlineListId = useId();

  const done = () => {
    setIconOpen(false);
    setInlineOpen(false);
    iconInputRef.current?.blur();
    inlineInputRef.current?.blur();
  };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    c.goToSearch(done);
  };
  const activeId = (listId: string, open: boolean) =>
    open && c.highlight >= 0 ? `${listId}-${c.highlight}` : undefined;

  const iconPanelOpen = iconOpen && c.enoughChars;
  const inlinePanelOpen = inlineOpen && c.enoughChars;

  return (
    <>
      <Popover open={iconOpen} onOpenChange={setIconOpen}>
        <PopoverTrigger
          aria-label="Search"
          className="hidden rounded-full p-2 transition-colors hover:bg-secondary lg:inline-flex xl:hidden"
        >
          <Search className="h-6 w-6" strokeWidth={1.75} />
        </PopoverTrigger>
        <PopoverContent
          align="end"
          sideOffset={8}
          initialFocus={iconInputRef}
          className="w-[min(24rem,calc(100vw-2rem))] rounded-2xl border-border bg-popover p-2 shadow-lg"
        >
          <form onSubmit={submit}>
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={iconInputRef}
                type="search"
                placeholder="Search products"
                value={c.query}
                onChange={(e) => c.setQuery(e.target.value)}
                onKeyDown={(e) => c.onKeyDown(e, done)}
                role="combobox"
                aria-expanded={iconPanelOpen}
                aria-controls={iconListId}
                aria-autocomplete="list"
                aria-activedescendant={activeId(iconListId, iconPanelOpen)}
                autoComplete="off"
                className={`h-10 ${inputClass}`}
              />
            </div>
          </form>
          {iconPanelOpen && (
            <div className="mt-2">
              <Suggestions listboxId={iconListId} c={c} onDone={done} />
            </div>
          )}
        </PopoverContent>
      </Popover>

      <form onSubmit={submit} className="hidden xl:block">
        <Popover open={inlinePanelOpen} onOpenChange={setInlineOpen}>
          <div ref={anchorRef} className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={inlineInputRef}
              type="search"
              placeholder="Search products"
              value={c.query}
              onChange={(e) => {
                c.setQuery(e.target.value);
                setInlineOpen(true);
              }}
              onFocus={() => setInlineOpen(true)}
              onKeyDown={(e) => c.onKeyDown(e, done)}
              role="combobox"
              aria-expanded={inlinePanelOpen}
              aria-controls={inlineListId}
              aria-autocomplete="list"
              aria-activedescendant={activeId(inlineListId, inlinePanelOpen)}
              autoComplete="off"
              className={`h-10 w-56 ${inputClass}`}
            />
          </div>
          <PopoverContent
            align="end"
            sideOffset={8}
            anchor={anchorRef}
            initialFocus={false}
            className="w-[min(22rem,calc(100vw-2rem))] rounded-2xl border-border bg-popover p-1.5 shadow-lg"
          >
            <Suggestions listboxId={inlineListId} c={c} onDone={done} />
          </PopoverContent>
        </Popover>
      </form>
    </>
  );
}
