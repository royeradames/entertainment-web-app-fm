import { expect, test } from "@playwright/test";
import { matchTitles } from "../lib/catalog/search";
import { bookmarkButton, cards, movies, open, search, series, titles, waitForHydrated } from "./helpers";

const status = (page: import("@playwright/test").Page) => page.locator(".results-status");

test("Home searches every title and reports the count in the brief's wording", async ({ page }) => {
  await open(page);
  const expected = matchTitles(titles, "the");
  expect(expected.length).toBeGreaterThan(1);
  await search(page, "the");
  await expect(page).toHaveURL(/\/\?q=the$/);
  await expect(status(page)).toHaveText(`Found ${expected.length} results for 'the'`);
  await expect(cards(page)).toHaveCount(expected.length);
  await expect(page.getByRole("heading", { name: "Trending", exact: true })).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 3 })).toHaveText(expected.map((item) => item.title));
});

test("each page searches only its own set", async ({ page }) => {
  await open(page);
  await search(page, "salt");
  await expect(status(page)).toHaveText("Found 2 results for 'salt'");

  await open(page, "/movies");
  await search(page, "salt");
  await expect(status(page)).toHaveText("Found 1 result for 'salt'");
  await expect(page.getByRole("heading", { level: 3 })).toHaveText(matchTitles(movies, "salt").map((item) => item.title));

  await open(page, "/tv-series");
  await search(page, "salt");
  await expect(status(page)).toHaveText("Found 1 result for 'salt'");
  await expect(page.getByRole("heading", { level: 3 })).toHaveText(matchTitles(series, "salt").map((item) => item.title));

  await open(page, "/movies");
  await search(page, "Salt and Static");
  await expect(status(page)).toHaveText("Found 0 results for 'Salt and Static'");
  await expect(page.getByText("No movies match that search. Check the spelling or try fewer words.")).toBeVisible();
  await page.getByRole("link", { name: "Clear search", exact: true }).click();
  await expect(page).toHaveURL(/\/movies$/);
  await expect(cards(page)).toHaveCount(movies.length);
  await expect(page.getByRole("searchbox")).toHaveValue("");
});

test("Bookmarks searches only bookmarked titles", async ({ page }) => {
  await open(page);
  await bookmarkButton(page, "Salt and Static").click();
  await bookmarkButton(page, "The Lantern Keepers").click();
  await open(page, "/bookmarks");
  await search(page, "salt");
  await expect(status(page)).toHaveText("Found 1 result for 'salt'");
  await expect(page.getByRole("heading", { level: 3 })).toHaveText(["Salt and Static"]);
  await search(page, "orchard");
  await expect(status(page)).toHaveText("Found 0 results for 'orchard'");
  await expect(page.getByText("No bookmarked titles match that search.", { exact: false })).toBeVisible();
});

test("typing searches after a pause, keeps the query in the URL across reload, and Back leaves the page", async ({ page }) => {
  await open(page, "/tv-series");
  await page.getByRole("link", { name: "Movies", exact: true }).click();
  await waitForHydrated(page);
  await page.getByRole("searchbox").pressSequentially("ember", { delay: 40 });
  await expect(page).toHaveURL(/\/movies\?q=ember$/);
  await expect(status(page)).toHaveText("Found 1 result for 'ember'");

  await page.reload();
  await waitForHydrated(page);
  await expect(page.getByRole("searchbox")).toHaveValue("ember");
  await expect(status(page)).toHaveText("Found 1 result for 'ember'");

  await page.getByRole("link", { name: "TV Series", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("TV Series");
  await expect(page.getByRole("searchbox")).toHaveValue("");
  await page.goBack();
  await expect(page).toHaveURL(/\/movies\?q=ember$/);
  await expect(page.getByRole("searchbox")).toHaveValue("ember");
  await expect(status(page)).toHaveText("Found 1 result for 'ember'");
  // Keystrokes replaced one history entry instead of adding five.
  await page.goBack();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("TV Series");
});

test("Clear search empties the field and the URL and brings the sections back", async ({ page }) => {
  await open(page);
  await search(page, "orbit");
  await expect(status(page)).toHaveText("Found 1 result for 'orbit'");
  await page.getByRole("button", { name: "Clear search", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("searchbox")).toHaveValue("");
  await expect(page.getByRole("searchbox")).toBeFocused();
  await expect(status(page)).toHaveText("");
  await expect(page.getByRole("heading", { name: "Trending", exact: true })).toBeVisible();
});

test("a shared search link arrives filtered in the server HTML", async ({ request }) => {
  const html = await (await request.get("/tv-series?q=station")).text();
  expect(html).toContain("Found 1 result for &#x27;station&#x27;");
  expect(html).toContain("Kestrel Station");
  expect(html).not.toContain("Salt and Static");
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("the search form still submits and filters", async ({ page }) => {
    await page.goto("/movies");
    await page.getByRole("searchbox").fill("heist");
    await page.getByRole("searchbox").press("Enter");
    await expect(page).toHaveURL(/\/movies\?q=heist$/);
    await expect(status(page)).toHaveText("Found 1 result for 'heist'");
  });
});
