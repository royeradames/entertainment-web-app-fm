"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { pages } from "../../lib/catalog/pages";
import { inScope, matchTitles, plural, readQuery, resultsLine, type Scope } from "../../lib/catalog/search";
import { titles, type Title } from "../../lib/catalog/titles";
import { useBookmarks } from "../../lib/client/bookmark-store";
import { SearchField } from "./search-field";
import { TitleCard } from "./title-card";

type Section = { key: string; heading: string; items: Title[]; feature?: boolean; empty?: string; hiddenHeading?: boolean };

function countLine(scope: Scope, items: Title[]): string {
  if (scope === "movies") return plural(items.length, "movie", "movies");
  if (scope === "tv") return plural(items.length, "TV series", "TV series");
  if (scope === "bookmarks") return plural(items.length, "bookmark", "bookmarks");
  return `${plural(items.filter((item) => item.category === "Movie").length, "movie", "movies")} and ${plural(items.filter((item) => item.category === "TV Series").length, "TV series", "TV series")}`;
}

export function CatalogView({ scope }: { scope: Scope }) {
  const page = pages[scope];
  const query = readQuery(useSearchParams().get("q"));
  const { loaded, ids, toggle } = useBookmarks();
  const [announcement, setAnnouncement] = useState("");
  const pendingFocus = useRef<string | null>(null);
  const emptyHeading = useRef<HTMLHeadingElement>(null);

  // Bookmarks are only known in the browser, so the Bookmarks page waits for them instead of flashing "none yet".
  const ready = scope !== "bookmarks" || loaded;
  const scoped = titles.filter((item) => inScope(item, scope, ids));
  const results = query ? matchTitles(scoped, query) : scoped;

  let sections: Section[];
  if (query) sections = [{ key: "results", heading: "Results", items: results, hiddenHeading: true }];
  else if (scope === "home") sections = [
    { key: "trending", heading: "Trending", items: scoped.filter((item) => item.trending), feature: true },
    { key: "recommended", heading: "Recommended for you", items: scoped.filter((item) => !item.trending) },
  ];
  else if (scope === "bookmarks") sections = [
    { key: "movies", heading: "Bookmarked movies", items: scoped.filter((item) => item.category === "Movie"), empty: "No movies bookmarked yet." },
    { key: "tv", heading: "Bookmarked TV series", items: scoped.filter((item) => item.category === "TV Series"), empty: "No TV series bookmarked yet." },
  ];
  else sections = [{ key: "all", heading: scope === "movies" ? "All movies" : "All TV series", items: scoped, hiddenHeading: true }];
  const shown = sections.flatMap((section) => section.items);

  const onToggle = (id: string, title: string) => {
    const index = shown.findIndex((item) => item.id === id);
    const added = toggle(id);
    // On the Bookmarks page a removed card disappears; keep focus on the next card's button instead of losing it.
    if (!added && scope === "bookmarks") pendingFocus.current = shown[index + 1]?.id ?? shown[index - 1]?.id ?? "";
    setAnnouncement("");
    requestAnimationFrame(() => setAnnouncement(`${added ? "Added" : "Removed"} ${title} ${added ? "to" : "from"} bookmarks.`));
  };

  useEffect(() => {
    const target = pendingFocus.current;
    if (target === null) return;
    pendingFocus.current = null;
    const next = target ? document.querySelector<HTMLButtonElement>(`[data-bookmark-id="${target}"]`) : null;
    (next ?? emptyHeading.current ?? document.querySelector<HTMLElement>("#search"))?.focus();
  });

  const noBookmarks = scope === "bookmarks" && loaded && scoped.length === 0 && !query;

  return (
    <div className="catalog" data-hydrated={loaded ? "true" : undefined}>
      <div className="page-head">
        <div className="page-title">
          <h1>{page.heading}</h1>
          <p className="count-line">{ready ? countLine(scope, scoped) : " "}</p>
        </div>
        <SearchField label={page.searchLabel} path={page.path} query={query} />
      </div>

      <div className="results-status" role="status">
        {query && ready ? <h2 className="results-heading">{resultsLine(results.length, query)}</h2> : null}
      </div>
      <p className="sr-only" role="status">{announcement}</p>

      {ready && query && results.length === 0 && (
        <div className="empty-state">
          <p>No {scope === "bookmarks" ? "bookmarked titles" : scope === "movies" ? "movies" : scope === "tv" ? "TV series" : "movies or TV series"} match that search. Check the spelling or try fewer words.</p>
          <Link className="text-link" href={page.path}>Clear search</Link>
        </div>
      )}

      {noBookmarks && (
        <div className="empty-state">
          <h2 ref={emptyHeading} tabIndex={-1}>No bookmarks yet</h2>
          <p>Press the bookmark button on any movie or TV series to save it here. Bookmarks stay in this browser.</p>
          <Link className="text-link" href="/">Browse Home</Link>
        </div>
      )}

      {ready && !noBookmarks && sections.map((section) => (section.items.length > 0 || section.empty) && (
        <section key={section.key} className="catalog-section" aria-labelledby={`section-${section.key}`}>
          <h2 id={`section-${section.key}`} className={section.hiddenHeading ? "sr-only" : "section-heading"}>{section.heading}</h2>
          {section.items.length > 0 ? (
            <ul className={section.feature ? "card-grid feature-grid" : "card-grid"}>
              {section.items.map((item) => <TitleCard key={item.id} item={item} feature={section.feature} bookmarked={ids.has(item.id)} onToggle={onToggle} />)}
            </ul>
          ) : (
            <p className="section-empty">{section.empty}</p>
          )}
        </section>
      ))}
    </div>
  );
}
