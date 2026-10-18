import type { Metadata } from "next";
import { connection } from "next/server";
import { CatalogView } from "../../components/catalog/catalog-view";
import { pageOpenGraph } from "../site";

export const metadata: Metadata = {
  title: "Movies",
  description: "Every movie in the made-up catalogue, with search and bookmarks. A Frontend Mentor practice app.",
  alternates: { canonical: "/movies" },
  openGraph: pageOpenGraph("/movies", "Movies | Entertainment Web App", "Every movie in the made-up catalogue, with search and bookmarks. A Frontend Mentor practice app."),
};

export default async function MoviesPage() {
  await connection();
  return <CatalogView scope="movies" />;
}
