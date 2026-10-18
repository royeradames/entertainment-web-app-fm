import type { Title } from "./titles";

export type Scope = "home" | "movies" | "tv" | "bookmarks";

export const maxQueryLength = 100;

/** The query as the URL carries it: trimmed and capped. */
export function readQuery(value: string | null | undefined): string {
  return (value ?? "").trim().slice(0, maxQueryLength);
}

/** Case-, accent- and spacing-insensitive form used for matching. */
export function normalise(text: string): string {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/\s+/g, " ").trim();
}

export function inScope(item: Title, scope: Scope, bookmarked: ReadonlySet<string>): boolean {
  if (scope === "movies") return item.category === "Movie";
  if (scope === "tv") return item.category === "TV Series";
  if (scope === "bookmarks") return bookmarked.has(item.id);
  return true;
}

export function matchTitles(items: readonly Title[], query: string): Title[] {
  const needle = normalise(query);
  if (!needle) return [...items];
  return items.filter((item) => normalise(item.title).includes(needle));
}

export function plural(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`;
}

export function resultsLine(count: number, query: string): string {
  return `Found ${plural(count, "result", "results")} for '${query}'`;
}
