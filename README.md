# Entertainment Web App

The [Frontend Mentor entertainment web app](https://www.frontendmentor.io/challenges/entertainment-web-app-J-UhgAW1X), built from its written user stories only (no design files or pictures), on Next.js 16.3.6, React 19.2.8, TypeScript 5.9.3 and Tailwind 4.2.1 on Node 24. TanStack Pacer 0.24.1 times the search; Zod 4.4.3 checks stored bookmarks.

- **Pages.** Home (Trending, then Recommended for you), Movies, TV Series and Bookmarks, linked from a header nav on phones and tablets and a left rail from 1024 px. The current page is marked by colour, a bar and `aria-current`.
- **Catalogue.** 28 made-up titles with generated SVG artwork. No Frontend Mentor data, posters, icons or images are used, so nothing here needs their starter-file terms.
- **Search.** Each page searches only its own set, ignoring case, accents and extra spaces. The query lives in `?q=`: typing applies it after 300 ms and replaces the history entry, Enter applies it at once, a shared link arrives filtered from the server, and without JavaScript the form submits as GET. The result line uses the brief's wording ("Found 2 results for 'salt'"). No match shows a plain message and a Clear search link.
- **Bookmarks.** A pressed-state button on every card saves to this browser's localStorage (Zod-checked; malformed or unknown entries are ignored). The Bookmarks page splits movies and TV series, keeps focus on the next card when one is removed, and explains what to do when there are none. Another tab's change shows without a reload.
- **Themes.** Dark by default; light when the system asks for light. Both pass 4.5:1 for text and 3:1 for controls; text on the Trending scrim stays light in both.
- **Readability.** All text is at least 16 px; no sideways scroll from 320 px; text at 200 % reflows. Keyboard: skip link, visible 3 px focus ring, Space and Enter on bookmarks.

## Development

```bash
npm ci
npm run lint && npm run typecheck && npm run build
npm test   # Playwright against the production build: navigation, search, bookmarks, keyboard, identity, widths, contrast, both themes
```
