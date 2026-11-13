import { expect, test } from "@playwright/test";
import { challengeUrl, open, routes, siteName, siteUrl } from "./helpers";

const urlPattern = (path: string) => new RegExp(`^${siteUrl.replace(/[.]/g, "\\.").replace(/\/$/, "")}${path === "/" ? "/?" : path}$`);

test("home identity: title, description, canonical, sharing card, JSON-LD, icons and credit", async ({ page }) => {
  await open(page);
  await expect(page).toHaveTitle(`Home | ${siteName}`);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /made-up catalogue.*Frontend Mentor/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", urlPattern("/"));
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute("content", siteName);
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", urlPattern("/"));
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "website");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /opengraph-image/);
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute("content", /Entertainment Web App/);
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", "1200");
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute("content", "630");
  const jsonLd: unknown = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}");
  expect(jsonLd).toEqual({ "@context": "https://schema.org", "@type": "WebSite", name: siteName, url: siteUrl });
  await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveAttribute("href", "/icon.svg");
  await expect(page.locator('link[rel="icon"][sizes="96x96"]')).toHaveAttribute("href", "/icon-96.png");
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute("href", "/apple-touch-icon.png");
  for (const [path, type] of [["/icon.svg", "image/svg+xml"], ["/icon-96.png", "image/png"], ["/apple-touch-icon.png", "image/png"], ["/opengraph-image", "image/png"]]) {
    const response = await page.request.get(path);
    expect(response.status(), path).toBe(200);
    expect(response.headers()["content-type"], path).toContain(type);
  }
  await expect(page.locator(".site-footer p")).toHaveCount(2);
  await expect(page.locator(".site-footer p").nth(0)).toHaveText("Practice demo. Every title and picture here is made up. Bookmarks stay in this browser; nothing is sent.");
  await expect(page.locator(".site-footer p").nth(1)).toHaveText("Challenge by Frontend Mentor. Built by Royer Adames.");
  await expect(page.locator(".site-footer").getByRole("link", { name: "Frontend Mentor", exact: true })).toHaveAttribute("href", challengeUrl);
  await expect(page.locator(".site-footer").getByRole("link", { name: "Royer Adames", exact: true })).toHaveAttribute("href", "https://royeradames.com");
});

test("each page has its own title, canonical and full sharing card", async ({ page }) => {
  for (const route of routes) {
    await open(page, route.path);
    await expect(page).toHaveTitle(`${route.heading} | ${siteName}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(route.heading);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", urlPattern(route.path));
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", urlPattern(route.path));
    await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute("content", siteName);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /opengraph-image/);
    await expect(page.locator('meta[name="robots"]')).toHaveCount(route.path === "/bookmarks" ? 1 : 0);
  }
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("sitemap lists the three public catalogue pages and robots points to it", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const path of ["", "movies", "tv-series"]) expect(sitemap).toContain(`<loc>${siteUrl}${path}</loc>`);
  expect(sitemap).not.toContain("bookmarks");
  expect(await (await request.get("/robots.txt")).text()).toContain(`Sitemap: ${siteUrl}sitemap.xml`);
});

test("an unknown address says so and links back to Home", async ({ page }) => {
  const response = await page.goto("/no-such-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page not found");
  await page.getByRole("link", { name: "Go to Home", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
});
