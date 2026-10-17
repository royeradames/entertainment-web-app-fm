import type { Metadata } from "next";
import { connection } from "next/server";
import { CatalogView } from "../components/catalog/catalog-view";
import { pageOpenGraph, siteDescription } from "./site";

export const metadata: Metadata = {
  title: "Home",
  description: siteDescription,
  alternates: { canonical: "/" },
  openGraph: pageOpenGraph("/", "Home | Entertainment Web App", siteDescription),
};

// Search lives in ?q=, so each request renders the filtered list on the server (a shared link arrives filtered).
export default async function Home() {
  await connection();
  return <CatalogView scope="home" />;
}
