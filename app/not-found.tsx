import Link from "next/link";

export default function NotFound() {
  return (
    <div className="catalog">
      <div className="empty-state">
        <h1>Page not found</h1>
        <p>There is no page at this address. The catalogue has four pages: Home, Movies, TV Series and Bookmarks.</p>
        <Link className="text-link" href="/">Go to Home</Link>
      </div>
    </div>
  );
}
