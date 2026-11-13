import { expect, test } from "@playwright/test";
import { cards, movies, open, routes, series, siteName, titles, trending, waitForHydrated } from "./helpers";

test("the nav reaches all four pages, marks the current one and Back returns", async ({ page }) => {
  await open(page);
  for (const route of routes) {
    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: route.nav, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${route.path === "/" ? "/" : route.path}$`));
    await waitForHydrated(page);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(route.heading);
    await expect(page).toHaveTitle(`${route.heading} | ${siteName}`);
    const current = page.locator('.nav-link[aria-current="page"]');
    await expect(current).toHaveCount(1);
    await expect(current).toHaveText(route.nav);
  }
  await page.goBack();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("TV Series");
  await page.getByRole("link", { name: "Entertainment Web App", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Home");
});

test("Home shows Trending and Recommended for you; Movies and TV Series list only their category", async ({ page }) => {
  await open(page);
  const trendingSection = page.getByRole("region", { name: "Trending" });
  await expect(trendingSection.locator(".title-card")).toHaveCount(trending.length);
  await expect(page.getByRole("region", { name: "Recommended for you" }).locator(".title-card")).toHaveCount(titles.length - trending.length);
  await expect(page.locator(".count-line")).toHaveText(`${movies.length} movies and ${series.length} TV series`);

  await open(page, "/movies");
  await expect(cards(page)).toHaveCount(movies.length);
  await expect(page.locator(".card-meta").filter({ hasText: "TV Series" })).toHaveCount(0);
  await expect(page.locator(".count-line")).toHaveText(`${movies.length} movies`);

  await open(page, "/tv-series");
  await expect(cards(page)).toHaveCount(series.length);
  await expect(page.locator(".card-meta").filter({ hasText: "Movie" })).toHaveCount(0);
  await expect(page.locator(".count-line")).toHaveText(`${series.length} TV series`);
});

test("each card shows its title, year, category and rating", async ({ page }) => {
  await open(page, "/movies");
  const first = cards(page).first();
  await expect(first.getByRole("heading", { level: 3 })).toHaveText(movies[0].title);
  for (const part of [String(movies[0].year), "Movie", `Rated ${movies[0].rating}`]) await expect(first.locator(".card-meta")).toContainText(part);
});
