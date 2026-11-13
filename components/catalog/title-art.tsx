import { useId } from "react";
import type { Title } from "../../lib/catalog/titles";

// Generated thumbnails: a gradient sky and one simple motif per title, drawn from its hue. No posters or photos.
const hsl = (h: number, s: number, l: number, a = 1) => `hsl(${((h % 360) + 360) % 360} ${s}% ${l}% / ${a})`;

export function TitleArt({ art }: { art: Title["art"] }) {
  const id = useId().replace(/:/g, "");
  const { hue: h, motif } = art;
  return (
    <svg className="title-art" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden focusable={false}>
      <defs>
        <linearGradient id={`sky${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={hsl(h, 45, 12)} />
          <stop offset="1" stopColor={hsl(h + 28, 62, 40)} />
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill={`url(#sky${id})`} />
      {motif === "sun" && (
        <>
          <circle cx="160" cy="128" r="58" fill={hsl(h + 20, 88, 64)} />
          <rect y="128" width="320" height="72" fill={hsl(h, 42, 13)} />
          {[142, 156, 170, 184].map((y, i) => <rect key={y} x={110 + i * 8} y={y} width={100 - i * 16} height="4" rx="2" fill={hsl(h + 20, 80, 58, 0.7 - i * 0.12)} />)}
        </>
      )}
      {motif === "waves" && [0, 1, 2, 3].map((i) => (
        <path key={i} d={`M0 ${88 + i * 26} C 60 ${70 + i * 26}, 100 ${110 + i * 26}, 160 ${90 + i * 26} S 260 ${70 + i * 26}, 320 ${92 + i * 26} V200 H0Z`} fill={hsl(h - 10 + i * 6, 55, 24 + i * 9, 0.9)} />
      ))}
      {motif === "peaks" && (
        <>
          <circle cx="238" cy="58" r="20" fill={hsl(h + 40, 70, 82)} />
          <path d="M0 150 70 70l50 50 40-40 80 90H0Z" fill={hsl(h, 30, 30)} />
          <path d="M60 200 170 92l60 56 30-26 60 78Z" fill={hsl(h, 32, 20)} />
          <path d="M0 200V164l60-30 70 66Z" fill={hsl(h, 36, 12)} />
        </>
      )}
      {motif === "orbit" && (
        <>
          {[[40, 40], [92, 150], [270, 36], [292, 140], [210, 172], [130, 30]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="2.5" fill={hsl(h + 60, 30, 88)} />)}
          <circle cx="160" cy="100" r="46" fill={hsl(h + 30, 70, 58)} />
          <ellipse cx="160" cy="100" rx="96" ry="24" fill="none" stroke={hsl(h + 70, 80, 74)} strokeWidth="6" transform="rotate(-14 160 100)" />
        </>
      )}
      {motif === "grid" && (
        <>
          <circle cx="160" cy="104" r="50" fill={hsl(h + 30, 90, 62)} />
          <rect y="104" width="320" height="96" fill={hsl(h, 50, 10)} />
          {[-150, -90, -40, 0, 40, 90, 150].map((dx) => <path key={dx} d={`M160 104 L${160 + dx * 2.4} 200`} stroke={hsl(h + 40, 85, 62)} strokeWidth="2" />)}
          {[116, 132, 154, 182].map((y) => <path key={y} d={`M0 ${y}H320`} stroke={hsl(h + 40, 85, 62)} strokeWidth="2" />)}
        </>
      )}
      {motif === "skyline" && (
        <>
          <circle cx="76" cy="54" r="16" fill={hsl(h + 50, 60, 84)} />
          {[[10, 100, 40], [56, 70, 34], [96, 118, 30], [132, 60, 44], [182, 94, 30], [218, 76, 40], [264, 110, 46]].map(([x, y, w]) => (
            <rect key={x} x={x} y={y} width={w} height={200 - y} fill={hsl(h, 28, 14)} />
          ))}
          {[[66, 84], [66, 104], [144, 76], [158, 96], [144, 116], [228, 92], [242, 112]].map(([x, y]) => <rect key={`${x}-${y}`} x={x} y={y} width="8" height="8" fill={hsl(h + 30, 90, 70)} />)}
        </>
      )}
    </svg>
  );
}
