// Original illustrations for "What Comes Next?": painted wooden beads on a string.
import { PIECE_PAINTS, SHAPE_PATHS } from "../shapes/art";

export const COLOUR_NAMES = {
  red: "red",
  yellow: "yellow",
  green: "green",
  blue: "blue",
  orange: "orange",
  purple: "purple",
};

// Scale each outline so every bead fills its slot about equally.
const BEAD_SCALE = { circle: 1.28, square: 1.2, triangle: 1.06, star: 1.08, heart: 1.1, diamond: 1.08 };

/** A wooden bead seen from the front: painted shape, soft sheen, threading hole. */
export function Bead({ shape = "circle", paint }) {
  const d = SHAPE_PATHS[shape];
  const [face, edge] = PIECE_PAINTS[paint];
  const s = BEAD_SCALE[shape] || 1;
  const fit = `translate(32 32) scale(${s}) translate(-32 -32)`;
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden focusable={false} overflow="visible">
      <defs>
        <radialGradient id="bead-sheen" cx="35%" cy="28%" r="80%">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="1" stopColor="#000" stopOpacity="0.22" />
        </radialGradient>
      </defs>
      <path d={d} transform={fit} fill={face} stroke={edge} strokeWidth={3 / s} strokeLinejoin="round" />
      <path d={d} transform={fit} fill="url(#bead-sheen)" />
      {/* threading hole */}
      <ellipse cx="32" cy="32.5" rx="5.2" ry="5" fill="#5A3417" />
      <ellipse cx="32" cy="33.5" rx="3.6" ry="3.2" fill="#2A1608" />
      <path d="M27.2 31a5 5 0 0 1 9.6 0" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.2" />
    </svg>
  );
}

/** Menu / cover preview: a few beads on a string ending in a "?" gap. */
export function StringPreview({ beads, size = 60 }) {
  return (
    <span
      className="relative grid shrink-0 place-items-center rounded-[12px] drop-shadow-[0_2px_2px_rgba(40,18,0,0.35)]"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg viewBox="0 0 64 64" className="absolute inset-0 h-full w-full">
        <defs>
          <radialGradient id="sp-felt" cx="50%" cy="35%" r="75%">
            <stop offset="0" stopColor="#35915A" />
            <stop offset="1" stopColor="#1D5E38" />
          </radialGradient>
        </defs>
        <rect width="64" height="64" rx="12" fill="url(#sp-felt)" />
        <rect x="4" y="4" width="56" height="56" rx="9" fill="none" stroke="#FFF6D2" strokeOpacity="0.5" strokeWidth="1.2" strokeDasharray="2.5 2" />
        <path d="M6 32h52" stroke="#E9D7B0" strokeWidth="2" />
        <circle cx="52" cy="32" r="5.5" fill="rgba(255,246,210,0.12)" stroke="#FFF6D2" strokeWidth="1.3" strokeDasharray="2 1.6" />
        <text x="52" y="35.5" textAnchor="middle" fontSize="9" fontWeight="700" fill="#FFF6D2" style={{ fontFamily: "var(--font-fredoka), sans-serif" }}>
          ?
        </text>
      </svg>
      <span className="absolute top-1/2 left-[9%] flex w-[64%] -translate-y-1/2 gap-[4%]">
        {beads.map((b, i) => (
          <span key={i} className="aspect-square flex-1">
            <Bead shape={b.shape} paint={b.paint} />
          </span>
        ))}
      </span>
    </span>
  );
}
