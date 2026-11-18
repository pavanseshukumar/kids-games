// Original illustrations for Shape Sorter: wooden pieces and the holes they fit.
// Holes and pieces share the exact same outline, so a piece always fits its hole.

export const SHAPE_PATHS = {
  circle: "M32 9a23 23 0 1 1 0 46a23 23 0 1 1 0-46Z",
  square: "M18 11h28a7 7 0 0 1 7 7v28a7 7 0 0 1-7 7H18a7 7 0 0 1-7-7V18a7 7 0 0 1 7-7Z",
  triangle: "M32 7 58 54H6Z",
  star: "M32 5 40.2 22.7 59.6 24.9 45.2 38.1 49.1 57.2 32 47.5 14.9 57.2 18.8 38.1 4.4 24.9 23.8 22.7Z",
  heart: "M32 55C13 43 6 32 6 22.5 6 14 12.5 8.5 20 8.5c5.2 0 9.5 3 12 7.5 2.5-4.5 6.8-7.5 12-7.5 7.5 0 14 5.5 14 14 0 9.5-7 20.5-26 32.5Z",
  diamond: "M32 4 57 32 32 60 7 32Z",
};

export const SHAPE_NAMES = {
  circle: "circle",
  square: "square",
  triangle: "triangle",
  star: "star",
  heart: "heart",
  diamond: "diamond",
};

/** Paint for pieces: [face, edge]. */
export const PIECE_PAINTS = {
  red: ["#E5483B", "#9E2A20"],
  yellow: ["#F8C630", "#A87A08"],
  green: ["#3FB35F", "#1F7438"],
  blue: ["#3A8DE6", "#1F5A9E"],
  orange: ["#F59A2E", "#A85E0E"],
  purple: ["#9B6BE0", "#5E3A9E"],
};

const centre = (s) => `translate(32 32) scale(${s}) translate(-32 -32)`;

/** A hole cut into the wooden board. `tint` shows the piece colour faintly (Easy level hint). */
export function Hole({ shape, tint }) {
  const d = SHAPE_PATHS[shape];
  const clip = `hole-clip-${shape}`;
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden focusable={false} overflow="visible">
      <defs>
        <clipPath id={clip}>
          <path d={d} transform={centre(1.06)} />
        </clipPath>
      </defs>
      {/* lit lower lip of the cut */}
      <path d={d} transform={`translate(0.8 1.6) ${centre(1.06)}`} fill="rgba(255,226,180,0.45)" />
      {/* the recess */}
      <path d={d} transform={centre(1.06)} fill="#3B210F" />
      {tint && <path d={d} transform={centre(1.06)} fill={PIECE_PAINTS[tint][0]} opacity="0.5" />}
      {/* inner shadow along the top-left wall */}
      <g clipPath={`url(#${clip})`}>
        <path d={d} transform={`translate(2.5 3.5) ${centre(1.06)}`} fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth="7" />
      </g>
    </svg>
  );
}

/**
 * A painted wooden piece with a little grab-peg. `seated` drops the visible
 * thickness so it sits flush inside its hole.
 */
export function Piece({ shape, paint, seated = false }) {
  const d = SHAPE_PATHS[shape];
  const [face, edge] = PIECE_PAINTS[paint];
  const sheen = `piece-sheen`;
  const peg = `piece-peg`;
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden focusable={false} overflow="visible">
      <defs>
        <linearGradient id={sheen} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0.06" />
          <stop offset="1" stopColor="#000" stopOpacity="0.12" />
        </linearGradient>
        <radialGradient id={peg} cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#F3DDB8" />
          <stop offset="0.6" stopColor="#C99A62" />
          <stop offset="1" stopColor="#8A5A2B" />
        </radialGradient>
      </defs>
      {/* thickness of the wood */}
      {!seated && <path d={d} transform="translate(0 4)" fill={edge} stroke={edge} strokeWidth="2.5" strokeLinejoin="round" />}
      <path d={d} fill={face} stroke={edge} strokeWidth="2.5" strokeLinejoin="round" />
      <path d={d} fill={`url(#${sheen})`} />
      {/* grab peg */}
      <ellipse cx="32" cy={seated ? 34 : 35} rx="5.5" ry="2.4" fill="rgba(0,0,0,0.3)" />
      <circle cx="32" cy="32" r="5" fill={`url(#${peg})`} stroke="#6E4322" strokeWidth="1.2" />
    </svg>
  );
}

/** Menu preview: a small wooden board with `count` holes, one piece seated. */
export function BoardPreview({ count }) {
  const shapes = ["circle", "square", "triangle", "star", "heart", "diamond"].slice(0, count);
  const cols = count === 4 ? 2 : 3;
  return (
    <span
      className="sorter-board grid size-[60px] shrink-0 gap-[3px] p-[7px]"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, alignContent: "center" }}
      aria-hidden
    >
      {shapes.map((s, i) => (
        <span key={s} className="relative aspect-square">
          <Hole shape={s} />
          {i === 0 && (
            <span className="absolute inset-0">
              <Piece shape={s} paint="red" seated />
            </span>
          )}
        </span>
      ))}
    </span>
  );
}
