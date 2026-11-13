"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { parseBookmarks, serialiseBookmarks, storageKey } from "../bookmarks/schema";

// Bookmarks live only in this browser's localStorage. If storage is blocked (some private windows),
// they last until the tab closes.
const listeners = new Set<() => void>();
let memoryCopy = "";

function readRaw(): string {
  try {
    return window.localStorage.getItem(storageKey) ?? "";
  } catch {
    return memoryCopy;
  }
}

function emit() {
  for (const listener of listeners) listener();
}

function onStorage(event: StorageEvent) {
  if (event.key === null || event.key === storageKey) emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

// The server has no bookmarks to read; null keeps "not loaded yet" apart from "none saved".
const getServerSnapshot = () => null;

export function useBookmarks() {
  const raw = useSyncExternalStore<string | null>(subscribe, readRaw, getServerSnapshot);
  const ids = useMemo(() => new Set(parseBookmarks(raw)), [raw]);
  const toggle = useCallback((id: string) => {
    const next = new Set(parseBookmarks(readRaw()));
    const added = !next.has(id);
    if (added) next.add(id);
    else next.delete(id);
    const value = serialiseBookmarks(next);
    try {
      window.localStorage.setItem(storageKey, value);
    } catch {
      memoryCopy = value;
    }
    emit();
    return added;
  }, []);
  return { loaded: raw !== null, ids: ids as ReadonlySet<string>, toggle };
}
