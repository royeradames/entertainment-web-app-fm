"use client";

import { useDebouncer } from "@tanstack/react-pacer";
import { useRef, useState } from "react";
import { maxQueryLength, readQuery } from "../../lib/catalog/search";
import { CloseIcon, SearchIcon } from "../shell/icons";

type Props = { label: string; path: string; query: string };

/** Search lives in the URL (?q=). Typing replaces the current history entry after a short pause, so Back
 *  leaves the page instead of undoing keystrokes; Enter applies at once. Without JavaScript the form submits as GET. */
export function SearchField({ label, path, query }: Props) {
  const [draft, setDraft] = useState(query);
  const [seenQuery, setSeenQuery] = useState(query);
  const input = useRef<HTMLInputElement>(null);

  // Back, Forward or a nav link changed the query: show it, unless it is what the person is typing.
  if (query !== seenQuery) {
    setSeenQuery(query);
    if (query !== readQuery(draft)) setDraft(query);
  }

  const commit = (value: string) => {
    const next = readQuery(value);
    const url = next ? `${path}?q=${encodeURIComponent(next)}` : path;
    window.history.replaceState(null, "", url);
  };
  const debouncer = useDebouncer(commit, { wait: 300 });

  return (
    <form className="search-form" role="search" action={path} method="get" onSubmit={(event) => { event.preventDefault(); debouncer.cancel(); commit(draft); }}>
      <label className="search-label" htmlFor="search">{label}</label>
      <div className="search-box">
        <SearchIcon className="search-icon" />
        <input
          ref={input}
          id="search"
          className="search-input"
          type="search"
          name="q"
          value={draft}
          maxLength={maxQueryLength}
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="search"
          onChange={(event) => { setDraft(event.target.value); debouncer.maybeExecute(event.target.value); }}
        />
        {draft && (
          <button type="button" className="clear-button" onClick={() => { setDraft(""); debouncer.cancel(); commit(""); input.current?.focus(); }}>
            <CloseIcon className="clear-icon" />
            Clear search
          </button>
        )}
      </div>
    </form>
  );
}
