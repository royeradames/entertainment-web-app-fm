"use client";

import { BookmarkIcon } from "../shell/icons";

type Props = { id: string; title: string; pressed: boolean; onToggle: (id: string, title: string) => void };

export function BookmarkButton({ id, title, pressed, onToggle }: Props) {
  return (
    <button type="button" className="bookmark-button" aria-pressed={pressed} aria-label={`Bookmark ${title}`} data-bookmark-id={id} onClick={() => onToggle(id, title)}>
      <BookmarkIcon filled={pressed} />
    </button>
  );
}
