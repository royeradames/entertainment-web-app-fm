import { expect, test } from "@playwright/test";
import { bookmarkButton, cards, movies, open, setStoredBookmarks, storedBookmarks, trending, waitForHydrated } from "./helpers";

test("a bookmark added on Home persists across reload and shows on Bookmarks; removing it there persists too", async ({ page }) => {
  await open(page);
  const series = trending.find((item) => item.category === "TV Series")!;
  const film = movies.find((item) => !item.trending)!;
  await bookmarkButton(page, series.title).click();
  await bookmarkButton(page, film.title).click();
  await expect(bookmarkButton(page, series.title)).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("status").filter({ hasText: "Added" })).toHaveText(`Added ${film.title} to bookmarks.`);
  expect(JSON.parse((await storedBookmarks(page)) ?? "null")).toEqual({ version: 1, ids: [series.id, film.id] });

  await page.reload();
  await waitForHydrated(page);
  await expect(bookmarkButton(page, series.title)).toHaveAttribute("aria-pressed", "true");
  await expect(bookmarkButton(page, film.title)).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("link", { name: "Bookmarks", exact: true }).click();
  await waitForHydrated(page);
  await expect(page.locator(".count-line")).toHaveText("2 bookmarks");
  await expect(page.getByRole("region", { name: "Bookmarked movies" }).getByRole("heading", { level: 3 })).toHaveText([film.title]);
  await expect(page.getByRole("region", { name: "Bookmarked TV series" }).getByRole("heading", { level: 3 })).toHaveText([series.title]);

  await bookmarkButton(page, film.title).click();
  await expect(page.getByRole("region", { name: "Bookmarked movies" })).toContainText("No movies bookmarked yet.");
  await expect(bookmarkButton(page, series.title)).toBeFocused();
  await expect(page.getByRole("status").filter({ hasText: "Removed" })).toHaveText(`Removed ${film.title} from bookmarks.`);

  await page.reload();
  await waitForHydrated(page);
  await expect(cards(page)).toHaveCount(1);
  await bookmarkButton(page, series.title).click();
  await expect(page.getByRole("heading", { name: "No bookmarks yet", exact: true })).toBeFocused();
  await page.reload();
  await waitForHydrated(page);
  await expect(page.getByRole("heading", { name: "No bookmarks yet", exact: true })).toBeVisible();
  await expect(page.getByText("Press the bookmark button on any movie or TV series to save it here. Bookmarks stay in this browser.")).toBeVisible();
  expect(JSON.parse((await storedBookmarks(page)) ?? "null")).toEqual({ version: 1, ids: [] });
});

test("bookmarks work on Movies and TV Series and show as pressed on every page", async ({ page }) => {
  await open(page, "/movies");
  await bookmarkButton(page, movies[3].title).click();
  await open(page, "/tv-series");
  await bookmarkButton(page, "Kestrel Station").click();
  await open(page);
  await expect(bookmarkButton(page, movies[3].title)).toHaveAttribute("aria-pressed", "true");
  await expect(bookmarkButton(page, "Kestrel Station")).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator('.bookmark-button[aria-pressed="true"]')).toHaveCount(2);
});

for (const [name, raw] of [
  ["not JSON", "{oops"],
  ["the wrong shape", JSON.stringify(["salt-and-static"])],
  ["a future version", JSON.stringify({ version: 2, ids: ["salt-and-static"] })],
  ["unknown ids only", JSON.stringify({ version: 1, ids: ["not-a-title", "x".repeat(81)] })],
] as const) {
  test(`stored bookmarks that are ${name} are ignored without breaking the page`, async ({ page }) => {
    await open(page, "/bookmarks");
    await setStoredBookmarks(page, raw);
    await page.reload();
    await waitForHydrated(page);
    await expect(page.getByRole("heading", { name: "No bookmarks yet", exact: true })).toBeVisible();
    await open(page);
    await bookmarkButton(page, "Salt and Static").click();
    expect(JSON.parse((await storedBookmarks(page)) ?? "null")).toEqual({ version: 1, ids: ["salt-and-static"] });
  });
}

test("valid stored bookmarks keep known ids and drop unknown ones", async ({ page }) => {
  await open(page, "/bookmarks");
  await setStoredBookmarks(page, JSON.stringify({ version: 1, ids: ["salt-and-static", "gone-title", "salt-and-static"] }));
  await page.reload();
  await waitForHydrated(page);
  await expect(page.getByRole("heading", { level: 3 })).toHaveText(["Salt and Static"]);
});

test("a bookmark made in another tab appears without a reload", async ({ page, context }) => {
  await open(page, "/bookmarks");
  const other = await context.newPage();
  await open(other);
  await bookmarkButton(other, "Paper Satellites").click();
  await expect(page.getByRole("heading", { level: 3 })).toHaveText(["Paper Satellites"]);
});
