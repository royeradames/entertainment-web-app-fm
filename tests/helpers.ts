import { expect, type Page } from "@playwright/test";
import { titles } from "../lib/catalog/titles";

export { titles };

export const siteName = "Entertainment Web App";
export const siteUrl = "https://entertainment-web-app-fm.royeradames.com/";
export const challengeUrl = "https://www.frontendmentor.io/challenges/entertainment-web-app-J-UhgAW1X";
export const storageKey = "entertainment-web-app-fm:bookmarks";
export const routes = [
  { path: "/", heading: "Home", nav: "Home" },
  { path: "/movies", heading: "Movies", nav: "Movies" },
  { path: "/tv-series", heading: "TV Series", nav: "TV Series" },
  { path: "/bookmarks", heading: "Bookmarks", nav: "Bookmarks" },
] as const;

export const movies = titles.filter((item) => item.category === "Movie");
export const series = titles.filter((item) => item.category === "TV Series");
export const trending = titles.filter((item) => item.trending);

export async function open(page: Page, path = "/", width = 1440) {
  await page.setViewportSize({ width, height: 1024 });
  await page.goto(path);
  await waitForHydrated(page);
}

export async function waitForHydrated(page: Page) {
  await expect(page.locator(".catalog")).toHaveAttribute("data-hydrated", "true");
  await page.evaluate(() => document.fonts.ready);
}

export const cards = (page: Page) => page.locator(".title-card");
export const bookmarkButton = (page: Page, title: string) => page.getByRole("button", { name: `Bookmark ${title}`, exact: true });

export async function setStoredBookmarks(page: Page, value: string) {
  await page.evaluate(([key, raw]) => window.localStorage.setItem(key, raw), [storageKey, value]);
}

export async function storedBookmarks(page: Page) {
  return page.evaluate((key) => window.localStorage.getItem(key), storageKey);
}

/** Visible text under 16 px, including input values and the search placeholder. */
export async function smallText(page: Page) {
  return page.evaluate(() => {
    const out: string[] = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const parent = node.parentElement;
      if (!parent || !node.textContent?.trim() || parent.closest("script,style,noscript,.sr-only,[hidden]")) continue;
      if (!parent.getClientRects().length) continue;
      if (parseFloat(getComputedStyle(parent).fontSize) < 16) out.push(node.textContent.trim());
    }
    for (const input of document.querySelectorAll<HTMLInputElement>("input")) {
      if (input.getClientRects().length && parseFloat(getComputedStyle(input).fontSize) < 16) out.push(input.value || input.name);
    }
    return out;
  });
}

const colourTools = `
  const parse = (colour) => { const v = colour.match(/[\\d.]+/g).map(Number); return { r: v[0], g: v[1], b: v[2], a: v.length > 3 ? v[3] : 1 }; };
  const over = (top, under) => ({ r: top.r * top.a + under.r * (1 - top.a), g: top.g * top.a + under.g * (1 - top.a), b: top.b * top.a + under.b * (1 - top.a), a: 1 });
  const lum = (c) => { const f = (x) => { const s = x / 255; return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
  const white = { r: 255, g: 255, b: 255, a: 1 };
  // Background behind an element: translucent layers composited down to the first opaque one. Text on the trending
  // scrim is measured against the scrim over pure white, the worst case for light text over any artwork.
  const background = (element) => {
    const layers = [];
    for (let node = element; node; node = node.parentElement) {
      const style = getComputedStyle(node);
      if (node.matches(".feature-card .card-text")) { layers.push(parse(getComputedStyle(document.documentElement).getPropertyValue("--scrim").trim())); return layers.reduceRight((under, top) => over(top, under), white); }
      const c = parse(style.backgroundColor);
      if (c.a > 0) { layers.push(c); if (c.a >= 1) break; }
    }
    if (!layers.length || layers[layers.length - 1].a < 1) layers.push(parse(getComputedStyle(document.body).backgroundColor));
    return layers.reduceRight((under, top) => over(top, under));
  };
`;

/** Every visible text node with its contrast ratio against what is behind it. */
export async function textContrast(page: Page) {
  return page.evaluate((tools) => {
    return new Function(`${tools}
      const pairs = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode; const parent = node.parentElement;
        if (!parent || !node.textContent.trim() || parent.closest("script,style,noscript,.sr-only,[hidden]") || !parent.getClientRects().length) continue;
        pairs.push({ text: node.textContent.trim(), ratio: ratio(over(parse(getComputedStyle(parent).color), background(parent)), background(parent)) });
      }
      for (const input of document.querySelectorAll("input")) {
        if (!input.getClientRects().length || !input.value) continue;
        pairs.push({ text: input.value, ratio: ratio(parse(getComputedStyle(input).color), background(input)) });
      }
      return pairs;`)() as { text: string; ratio: number }[];
  }, colourTools);
}

/** Non-text contrast: the search field border, bookmark icons, rating badges and the current-page marker. */
export async function controlContrast(page: Page) {
  return page.evaluate((tools) => {
    return new Function(`${tools}
      const out = [];
      const visible = (el) => el.getClientRects().length > 0;
      for (const box of document.querySelectorAll(".search-box")) if (visible(box)) {
        const border = parse(getComputedStyle(box).borderTopColor);
        out.push({ label: "search border outside", ratio: ratio(border, background(box.parentElement)) });
        out.push({ label: "search border inside", ratio: ratio(border, background(box)) });
      }
      for (const button of document.querySelectorAll(".bookmark-button")) if (visible(button)) {
        out.push({ label: button.getAttribute("aria-label"), ratio: ratio(parse(getComputedStyle(button).color), background(button)) });
      }
      for (const badge of document.querySelectorAll(".meta-rating")) if (visible(badge)) {
        out.push({ label: "rating badge", ratio: ratio(parse(getComputedStyle(badge).borderTopColor), background(badge)) });
      }
      for (const link of document.querySelectorAll('.nav-link[aria-current="page"]')) if (visible(link)) {
        const marker = parse(getComputedStyle(link).boxShadow.match(/rgba?\\([^)]+\\)/)[0]);
        out.push({ label: "current page marker", ratio: ratio(marker, background(link)) });
      }
      return out;`)() as { label: string; ratio: number }[];
  }, colourTools);
}

export async function layoutProblems(page: Page) {
  return page.evaluate(() => {
    const visible = (element: Element) => !!element.getClientRects().length;
    const wrapped: string[] = [];
    for (const element of document.querySelectorAll<HTMLElement>("button, .nav-link, .text-link, .skip-link:focus")) {
      if (!visible(element)) continue;
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (!node.textContent?.trim() || node.parentElement?.closest(".sr-only")) continue;
        const range = document.createRange();
        range.selectNodeContents(node);
        if (new Set([...range.getClientRects()].map((rect) => Math.round(rect.top))).size > 1) wrapped.push(element.textContent ?? "");
      }
    }
    const overflow = [...document.querySelectorAll<HTMLElement>(".site-header, .nav-list, .page-head, .search-form, .search-box, .card-grid, .title-card, .card-text, .card-meta, .empty-state, .site-footer, button")]
      .filter((element) => visible(element) && element.scrollWidth > element.clientWidth + 1)
      .map((element) => element.className || element.tagName);
    return { scroll: document.documentElement.scrollWidth - innerWidth, wrapped, overflow };
  });
}

export async function expectLayout(page: Page, context: string, { labels = true } = {}) {
  const problems = await layoutProblems(page);
  expect(problems.scroll, `sideways scroll: ${context}`).toBeLessThanOrEqual(0);
  if (labels) expect(problems.wrapped, `wrapped labels: ${context}`).toEqual([]);
  expect(problems.overflow, `content overflow: ${context}`).toEqual([]);
  expect(await smallText(page), `text below 16 px: ${context}`).toEqual([]);
}

export async function expectContrast(page: Page, context: string) {
  for (const pair of await textContrast(page)) expect(pair.ratio, `${context}: ${pair.text}`).toBeGreaterThanOrEqual(4.5);
  for (const pair of await controlContrast(page)) expect(pair.ratio, `${context}: ${pair.label}`).toBeGreaterThanOrEqual(3);
}

export async function search(page: Page, text: string) {
  const input = page.getByRole("searchbox");
  await input.fill(text);
  await input.press("Enter");
}
