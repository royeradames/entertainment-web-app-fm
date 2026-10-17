// Original sample catalogue: every title, year and artwork setting here is made up for this practice app.
// No Frontend Mentor data, posters or images are used.

export type Category = "Movie" | "TV Series";
export type Rating = "E" | "PG" | "18+";
export type Motif = "sun" | "waves" | "peaks" | "orbit" | "grid" | "skyline";

export type Title = {
  id: string;
  title: string;
  year: number;
  category: Category;
  rating: Rating;
  trending: boolean;
  /** Generated artwork: a base hue (0–359) and a motif drawn as inline SVG. */
  art: { hue: number; motif: Motif };
};

export const titles: readonly Title[] = [
  { id: "the-lantern-keepers", title: "The Lantern Keepers", year: 2024, category: "Movie", rating: "PG", trending: true, art: { hue: 28, motif: "sun" } },
  { id: "salt-and-static", title: "Salt and Static", year: 2023, category: "TV Series", rating: "18+", trending: true, art: { hue: 196, motif: "waves" } },
  { id: "northbound-quiet", title: "Northbound Quiet", year: 2025, category: "Movie", rating: "E", trending: true, art: { hue: 214, motif: "peaks" } },
  { id: "paper-satellites", title: "Paper Satellites", year: 2022, category: "TV Series", rating: "PG", trending: true, art: { hue: 262, motif: "orbit" } },
  { id: "midnight-arcade-club", title: "Midnight Arcade Club", year: 2024, category: "TV Series", rating: "18+", trending: true, art: { hue: 318, motif: "grid" } },
  { id: "orchard-of-glass", title: "Orchard of Glass", year: 2021, category: "Movie", rating: "PG", trending: true, art: { hue: 150, motif: "skyline" } },
  { id: "tidewater-run", title: "Tidewater Run", year: 2019, category: "Movie", rating: "18+", art: { hue: 186, motif: "waves" }, trending: false },
  { id: "small-hours-bakery", title: "Small Hours Bakery", year: 2020, category: "TV Series", rating: "E", art: { hue: 38, motif: "skyline" }, trending: false },
  { id: "a-map-for-rainy-days", title: "A Map for Rainy Days", year: 2018, category: "Movie", rating: "E", art: { hue: 205, motif: "peaks" }, trending: false },
  { id: "copper-canyon-radio", title: "Copper Canyon Radio", year: 2022, category: "TV Series", rating: "PG", art: { hue: 18, motif: "peaks" }, trending: false },
  { id: "the-ninth-lighthouse", title: "The Ninth Lighthouse", year: 2017, category: "Movie", rating: "PG", art: { hue: 226, motif: "sun" }, trending: false },
  { id: "velvet-interval", title: "Velvet Interval", year: 2023, category: "Movie", rating: "18+", art: { hue: 340, motif: "orbit" }, trending: false },
  { id: "kestrel-station", title: "Kestrel Station", year: 2021, category: "TV Series", rating: "18+", art: { hue: 172, motif: "grid" }, trending: false },
  { id: "moss-and-marrow", title: "Moss and Marrow", year: 2016, category: "Movie", rating: "18+", art: { hue: 96, motif: "skyline" }, trending: false },
  { id: "lemon-street-detectives", title: "Lemon Street Detectives", year: 2019, category: "TV Series", rating: "PG", art: { hue: 52, motif: "grid" }, trending: false },
  { id: "second-breakfast-orbit", title: "Second Breakfast Orbit", year: 2025, category: "Movie", rating: "E", art: { hue: 282, motif: "orbit" }, trending: false },
  { id: "harbor-lights-down", title: "Harbor Lights Down", year: 2015, category: "Movie", rating: "PG", art: { hue: 238, motif: "skyline" }, trending: false },
  { id: "the-quiet-engine", title: "The Quiet Engine", year: 2020, category: "TV Series", rating: "PG", art: { hue: 8, motif: "grid" }, trending: false },
  { id: "sundial-summer", title: "Sundial Summer", year: 2024, category: "Movie", rating: "E", art: { hue: 44, motif: "sun" }, trending: false },
  { id: "fathom-line", title: "Fathom Line", year: 2022, category: "TV Series", rating: "18+", art: { hue: 200, motif: "waves" }, trending: false },
  { id: "clockwork-meadow", title: "Clockwork Meadow", year: 2018, category: "TV Series", rating: "E", art: { hue: 118, motif: "sun" }, trending: false },
  { id: "ember-valley-riders", title: "Ember Valley Riders", year: 2023, category: "Movie", rating: "PG", art: { hue: 12, motif: "peaks" }, trending: false },
  { id: "polaroid-ghosts", title: "Polaroid Ghosts", year: 2021, category: "Movie", rating: "18+", art: { hue: 270, motif: "waves" }, trending: false },
  { id: "library-after-dark", title: "Library After Dark", year: 2017, category: "TV Series", rating: "PG", art: { hue: 250, motif: "skyline" }, trending: false },
  { id: "saltwater-symphony", title: "Saltwater Symphony", year: 2020, category: "Movie", rating: "E", art: { hue: 180, motif: "orbit" }, trending: false },
  { id: "granite-and-gold", title: "Granite and Gold", year: 2016, category: "TV Series", rating: "18+", art: { hue: 46, motif: "peaks" }, trending: false },
  { id: "the-long-weekend-heist", title: "The Long Weekend Heist", year: 2024, category: "Movie", rating: "PG", art: { hue: 330, motif: "grid" }, trending: false },
  { id: "starling-crossing", title: "Starling Crossing", year: 2025, category: "TV Series", rating: "E", art: { hue: 160, motif: "orbit" }, trending: false },
];

export const titleIds: ReadonlySet<string> = new Set(titles.map((item) => item.id));
