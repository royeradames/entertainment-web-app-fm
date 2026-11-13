import type { Metadata } from "next";
import { connection } from "next/server";
import { CatalogView } from "../../components/catalog/catalog-view";
import { pageOpenGraph } from "../site";

// Bookmarks exist only in each visitor's browser, so this page has nothing for search engines.
export const metadata: Metadata = {
  title: "Bookmarks",
  description: "The movies and TV series you bookmarked in this browser. A Frontend Mentor practice app.",
  alternates: { canonical: "/bookmarks" },
  openGraph: pageOpenGraph("/bookmarks", "Bookmarks | Entertainment Web App", "The movies and TV series you bookmarked in this browser. A Frontend Mentor practice app."),
  robots: { index: false, follow: true },
};

export default async function BookmarksPage() {
  await connection();
  return <CatalogView scope="bookmarks" />;
}
