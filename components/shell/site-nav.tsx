"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navOrder, pages } from "../../lib/catalog/pages";
import { BookmarkIcon, HomeIcon, LogoMark, MovieIcon, TvIcon } from "./icons";

const icons = { home: HomeIcon, movies: MovieIcon, tv: TvIcon, bookmarks: BookmarkIcon };

export function SiteNav() {
  const pathname = usePathname();
  return (
    <header className="site-header">
      <Link href="/" className="brand">
        <LogoMark className="brand-mark" />
        <span>Entertainment Web App</span>
      </Link>
      <nav aria-label="Main">
        <ul className="nav-list">
          {navOrder.map((scope) => {
            const page = pages[scope];
            const Icon = icons[scope];
            const current = pathname === page.path;
            return (
              <li key={scope}>
                <Link href={page.path} className="nav-link" aria-current={current ? "page" : undefined}>
                  <Icon className="nav-icon" />
                  <span>{page.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
