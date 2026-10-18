import type { Scope } from "./search";

export type PageInfo = { scope: Scope; path: string; label: string; heading: string; searchLabel: string };

export const pages: Record<Scope, PageInfo> = {
  home: { scope: "home", path: "/", label: "Home", heading: "Home", searchLabel: "Search movies and TV series" },
  movies: { scope: "movies", path: "/movies", label: "Movies", heading: "Movies", searchLabel: "Search movies" },
  tv: { scope: "tv", path: "/tv-series", label: "TV Series", heading: "TV Series", searchLabel: "Search TV series" },
  bookmarks: { scope: "bookmarks", path: "/bookmarks", label: "Bookmarks", heading: "Bookmarks", searchLabel: "Search your bookmarks" },
};

export const navOrder: Scope[] = ["home", "movies", "tv", "bookmarks"];
