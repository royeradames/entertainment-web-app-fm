import { z } from "zod";
import { titleIds } from "../catalog/titles";

export const storageKey = "entertainment-web-app-fm:bookmarks";

/** What this app writes to localStorage. Anything else found under the key is ignored. */
export const storedBookmarks = z.object({
  version: z.literal(1),
  ids: z.array(z.string().min(1).max(80)).max(500),
});

/** Parse stored bookmarks; unreadable, malformed or unknown entries give no bookmarks rather than an error. */
export function parseBookmarks(raw: string | null): string[] {
  if (!raw) return [];
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return [];
  }
  const result = storedBookmarks.safeParse(json);
  if (!result.success) return [];
  return [...new Set(result.data.ids)].filter((id) => titleIds.has(id));
}

export function serialiseBookmarks(ids: Iterable<string>): string {
  return JSON.stringify(storedBookmarks.parse({ version: 1, ids: [...new Set(ids)] }));
}
