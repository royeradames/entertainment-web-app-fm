"use client";

import type { Title } from "../../lib/catalog/titles";
import { MovieIcon, TvIcon } from "../shell/icons";
import { BookmarkButton } from "./bookmark-button";
import { TitleArt } from "./title-art";

type Props = { item: Title; feature?: boolean; bookmarked: boolean; onToggle: (id: string, title: string) => void };

export function TitleCard({ item, feature = false, bookmarked, onToggle }: Props) {
  const CategoryIcon = item.category === "Movie" ? MovieIcon : TvIcon;
  return (
    <li className={feature ? "title-card feature-card" : "title-card"}>
      <div className="card-art">
        <TitleArt art={item.art} />
      </div>
      <div className="card-text">
        <h3 className="card-title">{item.title}</h3>
        <p className="card-meta">
          <span>{item.year}</span>
          <span className="meta-category"><CategoryIcon className="meta-icon" />{item.category}</span>
          <span className="meta-rating"><span className="sr-only">Rated </span>{item.rating}</span>
        </p>
      </div>
      <BookmarkButton id={item.id} title={item.title} pressed={bookmarked} onToggle={onToggle} />
    </li>
  );
}
