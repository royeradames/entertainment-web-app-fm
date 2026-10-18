import { expect, test } from "@playwright/test";
import { bookmarkButton, expectContrast, expectLayout, open, trending } from "./helpers";

// The app follows the reader's system theme: light when the system asks for light, dark otherwise.
const pageBackground = (page: import("@playwright/test").Page) =>
  page.evaluate(() => {
    const [r, g, b] = getComputedStyle(document.body).backgroundColor.match(/[\d.]+/g)!.map(Number);
    return { luminance: (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255, scheme: getComputedStyle(document.documentElement).colorScheme };
  });

for (const [colorScheme, light] of [["light", true], ["dark", false]] as const) {
  test.describe(`${colorScheme} system theme`, () => {
    test.use({ colorScheme });

    test(`the page, form controls and theme colour follow the ${colorScheme} system setting`, async ({ page }) => {
      await open(page);
      const background = await pageBackground(page);
      if (light) expect(background.luminance).toBeGreaterThan(0.85);
      else expect(background.luminance).toBeLessThan(0.15);
      expect(background.scheme).toBe(colorScheme);
      await expect(page.locator(`meta[name="theme-color"][media*="${colorScheme}"]`)).toHaveCount(1);
    });

    test(`${colorScheme}: text passes 4.5:1 and controls 3:1 on Home, results, no results and Bookmarks`, async ({ page }) => {
      test.setTimeout(120_000);
      await open(page);
      await bookmarkButton(page, trending[0].title).click();
      await bookmarkButton(page, trending[3].title).click();
      for (const width of [375, 1440]) {
        for (const path of ["/", "/?q=the", "/movies?q=zzzz", "/bookmarks"]) {
          await open(page, path, width);
          await expectContrast(page, `${colorScheme} ${path} ${width}`);
          const target = bookmarkButton(page, trending[0].title);
          if (await target.count()) {
            await target.hover();
            await expectContrast(page, `${colorScheme} ${path} ${width}, bookmark hover`);
          }
        }
      }
    });

    test(`${colorScheme}: 320 px keeps every page readable without sideways scroll`, async ({ page }) => {
      for (const path of ["/", "/movies", "/tv-series", "/bookmarks", "/?q=salt"]) {
        await open(page, path, 320);
        await expectLayout(page, `${colorScheme} ${path} 320`);
      }
    });
  });
}
