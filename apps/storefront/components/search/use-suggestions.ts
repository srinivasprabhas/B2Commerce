"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type Suggestion = {
  slug: string;
  name: string;
  image: string | null;
  price: { amount: number; compareAt: number | null; from: boolean };
};

/** Debounced product suggestions plus keyboard highlight state for a search combobox. */
export function useSuggestions(initialQuery = "") {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [response, setResponse] = useState<{ q: string; results: Suggestion[] }>({ q: "", results: [] });
  const [highlight, setHighlight] = useState(-1);
  const trimmed = query.trim();
  const enoughChars = trimmed.length >= 2;
  // Derived, not stored: results only count for the query they were fetched for.
  const loading = enoughChars && response.q !== trimmed;
  const results = enoughChars ? response.results : [];

  useEffect(() => {
    if (!enoughChars) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, { signal: controller.signal })
        .then((r) => r.json())
        .then((data: { results: Suggestion[] }) => {
          setResponse({ q: trimmed, results: data.results });
          setHighlight(-1);
        })
        .catch(() => undefined);
    }, 150);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmed, enoughChars]);

  const seeAllIndex = results.length;

  const goToSearch = (onDone?: () => void) => {
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    onDone?.();
  };
  const goToProduct = (slug: string, onDone?: () => void) => {
    router.push(`/product/${slug}`);
    onDone?.();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, onDone?: () => void) => {
    if (!enoughChars) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h >= seeAllIndex ? 0 : h + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h <= 0 ? seeAllIndex : h - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const picked = results[highlight];
      if (picked) goToProduct(picked.slug, onDone);
      else goToSearch(onDone);
    } else if (e.key === "Escape") {
      onDone?.();
    }
  };

  return {
    query,
    setQuery,
    trimmed,
    enoughChars,
    results,
    loading,
    highlight,
    setHighlight,
    seeAllIndex,
    goToSearch,
    goToProduct,
    onKeyDown,
  };
}

export type SuggestionsController = ReturnType<typeof useSuggestions>;
