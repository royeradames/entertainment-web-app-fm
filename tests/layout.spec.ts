import { expect, test, type Page } from "@playwright/test";
import { bookmarkButton, expectContrast, expectLayout, open, routes, search, trending } from "./helpers";

async function addTwoBookmarks(page: Page) {
  await open(page);
  await bookmarkButton(page, trending[0].title).click();
  await bookmarkButton(page, trending[1].title).click();
}

type State = { name: string; path: string; setup?: (page: Page) => Promise<void> };
const states: State[] = [
  ...routes.map((route) => ({ name: route.heading, path: route.path })),
  { name: "Home results", path: "/?q=the" },
  { name: "Movies no results", path: "/movies?q=zzzz" },
  { name: "Bookmarks with items", path: "/bookmarks", setup: addTwoBookmarks },
  { name: "Long query", path: `/?q=${"VeryLongUnbrokenSearchWord".repeat(3)}` },
];

test("320, 375, 768 and 1440 px: no sideways scroll, no spill, no wrapped labels, nothing under 16 px", async ({ page }) => {
  test.setTimeout(120_000);
  for (const state of states) {
    if (state.setup) await state.setup(page);
    for (const width of [320, 375, 768, 1440]) {
      await open(page, state.path, width);
      await expectLayout(page, `${state.name}, ${width}`);
    }
  }
});

test("width sweep 320 to 1920 px in 40 px steps on Home, results and Bookmarks", async ({ page }) => {
  test.setTimeout(240_000);
  const widths = [...new Set([...Array.from({ length: 41 }, (_, i) => 320 + i * 40), 359, 360, 767, 768, 1023, 1024])].sort((a, b) => a - b);
  for (const state of [states[0], states[4], states[6]]) {
    if (state.setup) await state.setup(page);
    await open(page, state.path, 1440);
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      await expectLayout(page, `${state.name}, ${width}`);
    }
  }
});

test("200% text reflows without sideways scroll or spilled content", async ({ page }) => {
  test.setTimeout(120_000);
  for (const state of [states[0], states[1], states[3], states[4], states[5]]) {
    for (const width of [320, 768, 1440]) {
      await open(page, state.path, width);
      await page.addStyleTag({ content: "html { font-size: 200%; }" });
      await expectLayout(page, `200% ${state.name}, ${width}`, { labels: false });
    }
  }
});

test("text passes 4.5:1 and controls 3:1 at rest and on hover", async ({ page }) => {
  test.setTimeout(180_000);
  for (const width of [1440, 375]) {
    for (const state of [states[0], states[4], states[5], states[6]]) {
      if (state.setup) await state.setup(page);
      await open(page, state.path, width);
      await expectContrast(page, `${state.name} ${width}, rest`);
      const targets = page.locator(".nav-link:visible, .brand:visible, .bookmark-button:visible, .clear-button:visible, .text-link:visible, .site-footer a:visible, .search-box:visible");
      const count = Math.min(await targets.count(), 14);
      for (let index = 0; index < count; index++) {
        await targets.nth(index).hover();
        await expectContrast(page, `${state.name} ${width}, hover ${index}`);
      }
    }
  }
});

test("hover changes every interactive element's appearance", async ({ page }) => {
  await open(page, "/?q=salt");
  for (const selector of [".nav-link:not([aria-current])", ".brand", ".bookmark-button", ".clear-button", ".search-box", ".site-footer a"]) {
    const target = page.locator(selector).first();
    const before = await target.evaluate((el) => { const s = getComputedStyle(el); return `${s.color}|${s.backgroundColor}|${s.borderTopColor}`; });
    await target.hover();
    await expect.poll(() => target.evaluate((el) => { const s = getComputedStyle(el); return `${s.color}|${s.backgroundColor}|${s.borderTopColor}`; }), selector).not.toBe(before);
    await page.mouse.move(0, 0);
  }
});

test("phones get the nav under the brand; from 1024 px it is a left rail", async ({ page }) => {
  await open(page, "/", 375);
  const brand375 = await page.locator(".brand").boundingBox();
  const nav375 = await page.getByRole("navigation", { name: "Main" }).boundingBox();
  expect(nav375!.y).toBeGreaterThan(brand375!.y + brand375!.height - 1);
  await open(page, "/", 1440);
  const nav1440 = await page.getByRole("navigation", { name: "Main" }).boundingBox();
  const main1440 = await page.locator("main").boundingBox();
  expect(nav1440!.x + nav1440!.width).toBeLessThanOrEqual(main1440!.x);
});

test("transitions run only when the reader allows motion", async ({ browser }) => {
  for (const [reducedMotion, duration] of [["reduce", "0s"], ["no-preference", "0.15s"]] as const) {
    const context = await browser.newContext({ reducedMotion });
    const page = await context.newPage();
    await open(page);
    await expect(page.locator(".nav-link").first()).toHaveCSS("transition-duration", new RegExp(`^${duration.replace(".", "\\.")}`));
    await context.close();
  }
});
