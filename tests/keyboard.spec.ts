import { expect, test } from "@playwright/test";
import { bookmarkButton, open, trending } from "./helpers";

test("Tab order runs skip link, brand, nav, search, then the cards' bookmark buttons", async ({ page }) => {
  await open(page);
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content", exact: true })).toBeFocused();
  await expect(page.getByRole("link", { name: "Skip to content", exact: true })).toBeInViewport();
  for (const name of ["Entertainment Web App", "Home", "Movies", "TV Series", "Bookmarks"]) {
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name, exact: true })).toBeFocused();
  }
  await page.keyboard.press("Tab");
  await expect(page.getByRole("searchbox", { name: "Search movies and TV series" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(bookmarkButton(page, trending[0].title)).toBeFocused();
});

test("skip link moves to the main content; Enter on a nav link changes page", async ({ page }) => {
  await open(page);
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("searchbox")).toBeFocused();
  await page.getByRole("link", { name: "Movies", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Movies");
});

test("Space and Enter toggle a bookmark, with a visible focus ring and a pressed state", async ({ page }) => {
  await open(page);
  const button = bookmarkButton(page, trending[1].title);
  await button.focus();
  await page.keyboard.press("Space");
  await expect(button).toHaveAttribute("aria-pressed", "true");
  await expect(button).toHaveCSS("outline-style", "solid");
  await expect(button).toHaveCSS("outline-width", "3px");
  await page.keyboard.press("Enter");
  await expect(button).toHaveAttribute("aria-pressed", "false");
});

test("a full keyboard journey: search, bookmark a result, open Bookmarks, remove it", async ({ page }) => {
  await open(page);
  await page.getByRole("searchbox").focus();
  await page.keyboard.type("lantern");
  await page.keyboard.press("Enter");
  await expect(page.locator(".results-status")).toHaveText("Found 1 result for 'lantern'");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Clear search", exact: true })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(bookmarkButton(page, "The Lantern Keepers")).toBeFocused();
  await page.keyboard.press("Space");
  await expect(bookmarkButton(page, "The Lantern Keepers")).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("link", { name: "Bookmarks", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Bookmarks");
  await bookmarkButton(page, "The Lantern Keepers").focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "No bookmarks yet", exact: true })).toBeFocused();
});

test("the search field shows the focus ring on its box", async ({ page }) => {
  await open(page);
  await page.getByRole("searchbox").focus();
  await expect(page.locator(".search-box")).toHaveCSS("outline-width", "3px");
});
