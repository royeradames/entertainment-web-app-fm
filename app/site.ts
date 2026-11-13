export const siteName = "Entertainment Web App";
export const siteUrl = "https://entertainment-web-app-fm.royeradames.com/";
export const challengeUrl = "https://www.frontendmentor.io/challenges/entertainment-web-app-J-UhgAW1X";

export const siteDescription = "Browse a made-up catalogue of movies and TV series, search each page and keep bookmarks in your browser. A Frontend Mentor practice app.";

/** Child pages replace the whole openGraph object, so each page builds the full set. */
export function pageOpenGraph(path: string, title: string, description: string) {
  return { type: "website" as const, url: path, siteName, title, description, locale: "en_US" };
}
