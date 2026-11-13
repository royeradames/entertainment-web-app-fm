import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteName } from "./site";

export const alt = "Entertainment Web App: a dark catalogue of made-up movies and TV series with generated artwork";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const tiles = [
  { name: "The Lantern Keepers", meta: "2024 · Movie · PG", from: "#2a1a0c", to: "#e08a3a" },
  { name: "Salt and Static", meta: "2023 · TV Series · 18+", from: "#0c1f2a", to: "#2f8fb8" },
  { name: "Paper Satellites", meta: "2022 · TV Series · PG", from: "#1b1030", to: "#7a52c8" },
];

export default async function OpengraphImage() {
  const icon = await readFile(join(process.cwd(), "public/icon.svg"));
  const src = `data:image/svg+xml;base64,${icon.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 64, background: "#0e1116", color: "#f3f1ec" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 40 }}>
          <img src={src} width={80} height={80} alt="" />
          <div style={{ fontSize: 56, fontWeight: 700 }}>{siteName}</div>
        </div>
        <div style={{ display: "flex", gap: 28 }}>
          {tiles.map((tile) => (
            <div key={tile.name} style={{ display: "flex", flexDirection: "column", width: 336, borderRadius: 20, overflow: "hidden", background: "#171b23" }}>
              <div style={{ display: "flex", height: 190, background: `linear-gradient(180deg, ${tile.from}, ${tile.to})` }} />
              <div style={{ display: "flex", flexDirection: "column", padding: "18px 20px", gap: 6 }}>
                <div style={{ fontSize: 28, fontWeight: 700 }}>{tile.name}</div>
                <div style={{ fontSize: 22, color: "#b8bfcc" }}>{tile.meta}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 26, color: "#ffb547", marginTop: 36 }}>Search, browse and bookmark. A Frontend Mentor practice app.</div>
      </div>
    ),
    size,
  );
}
