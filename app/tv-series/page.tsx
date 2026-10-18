import type { Metadata } from "next";
import { connection } from "next/server";
import { CatalogView } from "../../components/catalog/catalog-view";
import { pageOpenGraph } from "../site";

export const metadata: Metadata = {
  title: "TV Series",
  description: "Every TV series in the made-up catalogue, with search and bookmarks. A Frontend Mentor practice app.",
  alternates: { canonical: "/tv-series" },
  openGraph: pageOpenGraph("/tv-series", "TV Series | Entertainment Web App", "Every TV series in the made-up catalogue, with search and bookmarks. A Frontend Mentor practice app."),
};

export default async function TvSeriesPage() {
  await connection();
  return <CatalogView scope="tv" />;
}
