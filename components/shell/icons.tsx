// Original line icons, drawn for this app. All are decorative: the visible text or an accessible name carries the meaning.
type IconProps = { className?: string };
const base = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, focusable: false } as const;

export function LogoMark({ className }: IconProps) {
  return (
    <svg className={className} width={40} height={40} viewBox="0 0 96 96" aria-hidden focusable={false}>
      <rect width="96" height="96" rx="22" fill="#ffb547" />
      <rect x="18" y="24" width="60" height="40" rx="7" fill="#0e1116" />
      <path d="M42 34v20l17-10z" fill="#ffb547" />
      <rect x="34" y="70" width="28" height="6" rx="3" fill="#0e1116" />
    </svg>
  );
}

export function HomeIcon({ className }: IconProps) {
  return <svg className={className} {...base}><path d="M3 11 12 4l9 7" /><path d="M5 10v10h5v-6h4v6h5V10" /></svg>;
}

export function MovieIcon({ className }: IconProps) {
  return <svg className={className} {...base}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4" /></svg>;
}

export function TvIcon({ className }: IconProps) {
  return <svg className={className} {...base}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="m8 3 4 4 4-4" /></svg>;
}

export function BookmarkIcon({ className, filled = false }: IconProps & { filled?: boolean }) {
  return <svg className={className} {...base} fill={filled ? "currentColor" : "none"}><path d="M6 3h12v18l-6-4.5L6 21z" /></svg>;
}

export function SearchIcon({ className }: IconProps) {
  return <svg className={className} {...base}><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>;
}

export function CloseIcon({ className }: IconProps) {
  return <svg className={className} {...base}><path d="M6 6l12 12M18 6 6 18" /></svg>;
}
