// Original illustrations for the Colours game: things to sort + paint buckets.
const INK = "#3D2A1E";
const line = { stroke: INK, strokeWidth: 3, strokeLinejoin: "round", strokeLinecap: "round" };

export const COLOURS = {
  red: { name: "Red", paint: "#E5483B", dark: "#A42C22" },
  yellow: { name: "Yellow", paint: "#F8C630", dark: "#B8870A" },
  green: { name: "Green", paint: "#3FB35F", dark: "#23803F" },
  blue: { name: "Blue", paint: "#3A8DE6", dark: "#2261A8" },
};

const ORANGE = "#F59A2E";
const CREAM = "#FFF6D6";
const shine = { fill: "none", stroke: "#fff", strokeOpacity: 0.7, strokeWidth: 3, strokeLinecap: "round" };

/**
 * Things to sort. Each is drawn in whatever colour the round gives it:
 * `draw(fill, dark)` where `dark` is a deeper shade for details.
 */
export const SHAPES = [
  /* ----- simple shapes ----- */
  { id: "circle", name: "circle", draw: (f) => (
    <g {...line}>
      <circle cx="32" cy="32" r="23" fill={f} />
      <path {...shine} d="M18 26a15 15 0 0 1 9-10" />
    </g>
  ) },
  { id: "square", name: "square", draw: (f) => (
    <g {...line}>
      <rect x="11" y="11" width="42" height="42" rx="7" fill={f} />
      <path {...shine} d="M18 24v-6h6" />
    </g>
  ) },
  { id: "triangle", name: "triangle", draw: (f) => (
    <g {...line}>
      <polygon points="32,8 57,53 7,53" fill={f} />
      <path {...shine} d="M27 22l-6 11" />
    </g>
  ) },
  { id: "star", name: "star", draw: (f) => (
    <g {...line}>
      <polygon points="32,6 39.6,22.6 57.7,24.6 44.2,36.9 47.9,54.7 32,45.6 16.1,54.7 19.8,36.9 6.3,24.6 24.4,22.6" fill={f} />
      <path {...shine} d="M29 17l-3 7" />
    </g>
  ) },
  { id: "heart", name: "heart", draw: (f) => (
    <g {...line}>
      <path fill={f} d="M32 54C14 42 8 32 8 23c0-8 6-13 13-13 5 0 9 3 11 7 2-4 6-7 11-7 7 0 13 5 13 13 0 9-6 19-24 31Z" />
      <path {...shine} d="M15 22a6 6 0 0 1 5-6" />
    </g>
  ) },
  { id: "diamond", name: "diamond", draw: (f) => (
    <g {...line}>
      <polygon points="32,5 56,32 32,59 8,32" fill={f} />
      <path {...shine} d="M26 16l-8 9" />
    </g>
  ) },

  /* ----- things ----- */
  { id: "balloon", name: "balloon", draw: (f) => (
    <g {...line}>
      <path fill="none" strokeWidth="2" d="M32 47q-5 5 0 9t0 7" />
      <polygon fill={f} points="28.5,48 35.5,48 32,43" />
      <ellipse cx="32" cy="25" rx="16" ry="19" fill={f} />
      <path {...shine} d="M23 18a10 10 0 0 1 6-7" />
    </g>
  ) },
  { id: "car", name: "car", draw: (f) => (
    <g {...line}>
      <path fill={f} d="M6 44v-8c0-3 2-5 5-5h8l7-10h14l9 10h4c3 0 5 2 5 5v8Z" />
      <path fill="#DDF0FF" d="M28 24h4v7h-10ZM36 24h3l6 7h-9Z" />
      <circle cx="18" cy="45" r="7" fill={INK} />
      <circle cx="18" cy="45" r="2.5" fill="#E8E2D6" stroke="none" />
      <circle cx="46" cy="45" r="7" fill={INK} />
      <circle cx="46" cy="45" r="2.5" fill="#E8E2D6" stroke="none" />
    </g>
  ) },
  { id: "fish", name: "fish", draw: (f, d) => (
    <g {...line}>
      <polygon fill={d} points="44,32 59,19 59,45" />
      <ellipse cx="28" cy="32" rx="20" ry="14" fill={f} />
      <path fill="none" d="M34 21q5 11 0 22" strokeOpacity="0.6" />
      <circle cx="18" cy="29" r="2.6" fill={INK} stroke="none" />
      <path fill="none" d="M10 36q3 2 6 1" strokeWidth="2" />
    </g>
  ) },
  { id: "flower", name: "flower", draw: (f) => (
    <g {...line}>
      <path fill="none" stroke="#3FB35F" strokeWidth="4" d="M32 40v20" />
      {[[32, 13], [44, 22], [40, 36], [24, 36], [20, 22]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="9" fill={f} />
      ))}
      <circle cx="32" cy="26" r="7" fill={CREAM} />
    </g>
  ) },
  { id: "umbrella", name: "umbrella", draw: (f) => (
    <g {...line}>
      <path fill="none" strokeWidth="3.5" d="M32 32v18q0 6-6 6t-6-5" />
      <path fill={f} d="M8 34a24 24 0 0 1 48 0q-4-4-8 0-4-4-8 0-4-4-8 0-4-4-8 0-4-4-8 0Z" />
      <path fill="none" d="M32 10v-4M32 10q-8 10-8 24M32 10q8 10 8 24" strokeOpacity="0.5" />
    </g>
  ) },
  { id: "kite", name: "kite", draw: (f, d) => (
    <g {...line}>
      <path fill="none" strokeWidth="2" d="M32 48q-7 4 0 8t0 7" />
      <polygon fill={d} points="27,53 31,55 27,57" strokeWidth="1.5" />
      <polygon fill={f} points="32,5 51,25 32,48 13,25" />
      <path fill="none" d="M32 5v43M13 25h38" strokeOpacity="0.5" />
    </g>
  ) },
  { id: "butterfly", name: "butterfly", draw: (f, d) => (
    <g {...line}>
      <path fill="none" strokeWidth="2.2" d="M30 18q-3-8-8-10M34 18q3-8 8-10" />
      <ellipse cx="20" cy="24" rx="13" ry="11" fill={f} />
      <ellipse cx="44" cy="24" rx="13" ry="11" fill={f} />
      <ellipse cx="22" cy="43" rx="10" ry="9" fill={d} />
      <ellipse cx="42" cy="43" rx="10" ry="9" fill={d} />
      <circle cx="18" cy="23" r="3.5" fill="#fff" stroke="none" opacity="0.8" />
      <circle cx="46" cy="23" r="3.5" fill="#fff" stroke="none" opacity="0.8" />
      <ellipse cx="32" cy="34" rx="3.5" ry="16" fill={INK} />
    </g>
  ) },
  { id: "mug", name: "cup", draw: (f) => (
    <g {...line}>
      <path fill="none" stroke="#B9AFA3" strokeWidth="2.5" d="M22 13q-3-4 0-8M30 13q-3-4 0-8" />
      <path fill="none" stroke={INK} strokeWidth="9" d="M44 26h5a7 7 0 0 1 0 14h-5" />
      <path fill="none" stroke={f} strokeWidth="3.5" d="M44 26h5a7 7 0 0 1 0 14h-5" />
      <rect x="12" y="17" width="33" height="38" rx="5" fill={f} />
      <path {...shine} d="M19 26v16" />
    </g>
  ) },
  { id: "hat", name: "party hat", draw: (f) => (
    <g {...line}>
      <polygon fill={f} points="32,10 51,54 13,54" />
      <path fill="none" stroke="#fff" strokeWidth="3.5" strokeOpacity="0.85" d="M25 27l14 6M20 39l23 9" />
      <rect x="10" y="52" width="44" height="6" rx="3" fill={CREAM} />
      <circle cx="32" cy="9" r="5.5" fill={CREAM} />
    </g>
  ) },
  { id: "boat", name: "boat", draw: (f) => (
    <g {...line}>
      <path fill="none" d="M32 8v36" />
      <polygon fill={CREAM} points="35,10 35,40 54,40" />
      <polygon fill={CREAM} points="29,16 29,40 13,40" />
      <path fill={f} d="M7 44h50l-9 11H16Z" />
      <path fill="none" stroke="#7CC4F2" strokeWidth="2.5" d="M4 60q5-3 10 0t10 0 10 0 10 0 10 0" />
    </g>
  ) },
  { id: "house", name: "house", draw: (f, d) => (
    <g {...line}>
      <rect x="13" y="28" width="38" height="28" fill={f} />
      <polygon fill={d} points="32,7 57,30 7,30" />
      <rect x="27" y="39" width="10" height="17" rx="2" fill={CREAM} />
      <rect x="40" y="34" width="7" height="7" rx="1" fill="#DDF0FF" strokeWidth="2" />
    </g>
  ) },
  { id: "bird", name: "bird", draw: (f, d) => (
    <g {...line}>
      <path fill="none" stroke={ORANGE} strokeWidth="3" d="M28 52v6M36 52v6" />
      <polygon fill={d} points="12,30 4,24 6,36" />
      <circle cx="32" cy="34" r="19" fill={f} />
      <path fill={d} d="M20 36q8 12 18 2-8-4-18-2Z" />
      <polygon fill={ORANGE} points="49,30 58,33 49,37" />
      <circle cx="42" cy="28" r="2.6" fill={INK} stroke="none" />
    </g>
  ) },
];

const SHAPE_BY_ID = Object.fromEntries(SHAPES.map((s) => [s.id, s]));

/** A sortable thing: one shape painted in one colour. */
export function makeItem(shapeId, colour) {
  const shape = SHAPE_BY_ID[shapeId];
  const { paint, dark } = COLOURS[colour];
  const fill = colour === "yellow" ? "#FFD23F" : paint;
  return {
    key: `${shapeId}-${colour}`,
    id: shapeId,
    name: shape.name,
    colour,
    art: shape.draw(fill, dark),
  };
}

export function ItemArt({ item, className = "h-[78%] w-[78%]" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden focusable={false}>
      {item.art}
    </svg>
  );
}

/**
 * The item's card scrunched into a paper ball, with the picture still printed
 * on it (slightly squashed and creased) so kids know what they are holding.
 */
export function PaperBall({ item }) {
  // Irregular outline: a lumpy circle reads as crumpled paper.
  const pts = [
    [50, 5], [64, 9], [78, 8], [86, 20], [95, 33], [92, 48], [96, 62], [86, 74], [80, 88],
    [64, 92], [50, 96], [36, 91], [22, 90], [14, 77], [5, 64], [9, 50], [4, 35], [14, 22], [24, 10], [38, 9],
  ];
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden focusable={false} overflow="visible">
      <defs>
        <radialGradient id="ball-paper" cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.6" stopColor="#F6EEDC" />
          <stop offset="1" stopColor="#D9C7A4" />
        </radialGradient>
        <clipPath id="ball-clip">
          <polygon points={pts.map((p) => p.join(",")).join(" ")} />
        </clipPath>
      </defs>
      <polygon points={pts.map((p) => p.join(",")).join(" ")} fill="url(#ball-paper)" stroke="#BFA77C" strokeWidth="2" strokeLinejoin="round" />
      <g clipPath="url(#ball-clip)">
        <g transform="translate(50 52) rotate(-14) scale(0.78 0.7) skewX(-6) translate(-32 -32)" opacity="0.92">
          {item.art}
        </g>
        {/* creases: dark folds with a light edge beside each */}
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 30 34 40 30 58 46 70 44 92M58 6 54 26 70 40 92 44M70 40 66 62 84 76M30 58 10 66M54 26 34 40" stroke="#8E7650" strokeOpacity="0.45" strokeWidth="1.8" />
          <path d="M13 32 35 42 31 60 47 72M56 8 52 27 69 42 90 46M68 42 64 63" stroke="#fff" strokeOpacity="0.7" strokeWidth="1.2" />
        </g>
        <polygon points="54,26 70,40 66,62 46,70 30,58 34,40" fill="#000" opacity="0.05" />
        <polygon points="70,40 92,44 84,76 66,62" fill="#000" opacity="0.08" />
      </g>
    </svg>
  );
}

/** Metal pail full of paint. The paint surface is its own group so it can slosh. */
export function Bucket({ colour, className = "w-full" }) {
  const { paint, dark } = COLOURS[colour];
  const id = `pail-${colour}`;
  return (
    <svg viewBox="0 0 100 104" className={className} aria-hidden focusable={false} overflow="visible">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#9AA3AB" />
          <stop offset="0.3" stopColor="#EEF1F3" />
          <stop offset="0.55" stopColor="#C9CFD5" />
          <stop offset="1" stopColor="#8D969E" />
        </linearGradient>
      </defs>
      {/* handle */}
      <path d="M16 36Q50 -6 84 36" fill="none" stroke="#5B6168" strokeWidth="6" strokeLinecap="round" />
      <path d="M16 36Q50 -6 84 36" fill="none" stroke="#AEB5BC" strokeWidth="2.5" strokeLinecap="round" />
      {/* body */}
      <path d="M13 36h74l-8 56q-29 8-58 0Z" fill={`url(#${id})`} stroke="#4E545A" strokeWidth="3" strokeLinejoin="round" />
      {/* paint stripe label */}
      <path d="M17 58h66l-2 15H19Z" fill={paint} stroke={dark} strokeWidth="2" />
      <path d="M18 62h64" stroke="#fff" strokeOpacity="0.35" strokeWidth="2" />
      {/* ridges */}
      <path d="M15 46h70M20 84h60" stroke="#6F777F" strokeOpacity="0.45" strokeWidth="2" />
      {/* rim */}
      <ellipse cx="50" cy="36" rx="38" ry="9.5" fill="#D5DADF" stroke="#4E545A" strokeWidth="3" />
      {/* paint surface */}
      <g className="bucket-paint">
        <ellipse cx="50" cy="37" rx="32" ry="6.5" fill={paint} stroke={dark} strokeWidth="1.5" />
        <ellipse cx="40" cy="35.5" rx="10" ry="2" fill="#fff" opacity="0.4" />
      </g>
      {/* drip over the rim */}
      <path d="M27 40q-1 13 4 14t4-14Z" fill={paint} stroke={dark} strokeWidth="1.5" />
    </svg>
  );
}

/** Menu preview: a mini felt mat with paint blobs, one per colour in the level. */
export function ColourPreview({ count }) {
  const order = ["red", "yellow", "blue", "green"].slice(0, count);
  const box = 64;
  const pos = {
    2: [[22, 32], [42, 32]],
    3: [[21, 25], [43, 25], [32, 43]],
    4: [[22, 22], [42, 22], [22, 42], [42, 42]],
  }[count];
  const r = count === 2 ? 10 : 8.5;
  return (
    <svg width="60" height="60" viewBox={`0 0 ${box} ${box}`} aria-hidden className="shrink-0 drop-shadow-[0_2px_2px_rgba(40,18,0,0.35)]">
      <defs>
        <radialGradient id="cp-felt" cx="50%" cy="35%" r="75%">
          <stop offset="0" stopColor="#35915A" />
          <stop offset="1" stopColor="#1D5E38" />
        </radialGradient>
      </defs>
      <rect width={box} height={box} rx="12" fill="url(#cp-felt)" />
      <rect x="4" y="4" width={box - 8} height={box - 8} rx="9" fill="none" stroke="#FFF6D2" strokeOpacity="0.5" strokeWidth="1.2" strokeDasharray="2.5 2" />
      {order.map((c, i) => (
        <g key={c}>
          <circle cx={pos[i][0]} cy={pos[i][1] + 1} r={r} fill="#0F3A22" opacity="0.45" />
          <circle cx={pos[i][0]} cy={pos[i][1]} r={r} fill={COLOURS[c].paint} stroke="#FFFAF0" strokeWidth="2" />
          <ellipse cx={pos[i][0] - r * 0.3} cy={pos[i][1] - r * 0.35} rx={r * 0.35} ry={r * 0.2} fill="#fff" opacity="0.5" />
        </g>
      ))}
    </svg>
  );
}
