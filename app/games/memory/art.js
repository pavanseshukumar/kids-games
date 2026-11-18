// Original card illustrations: bold outlines + flat neon fills, 64x64 grid.
// Printed-card palette: warm, saturated, readable on paper.
const INK = "#3D2A1E";
const FACE = "#FFFAF0";
const C = {
  pink: "#F2709C",
  blue: "#3FA9F5",
  mint: "#4CCB7E",
  purple: "#9B6BE0",
  lemon: "#FFD84D",
  aqua: "#2FC9C0",
  coral: "#FF8A5C",
  sand: "#F4C98B",
};
const line = { stroke: INK, strokeWidth: 3, strokeLinejoin: "round", strokeLinecap: "round" };

/* ---------------- Shapes ---------------- */
const shapes = {
  star: (
    <polygon {...line} fill={C.lemon}
      points="32,9 38.5,24.1 54.8,25.6 42.5,36.4 46.1,52.4 32,44 17.9,52.4 21.5,36.4 9.2,25.6 25.5,24.1" />
  ),
  heart: (
    <path {...line} fill={C.pink}
      d="M32 54C14 42 8 32 8 23c0-8 6-13 13-13 5 0 9 3 11 7 2-4 6-7 11-7 7 0 13 5 13 13 0 9-6 19-24 31Z" />
  ),
  moon: (
    <path {...line} fill={C.blue} d="M32.2 10.1A22 22 0 1 0 51.1 38.4 17 17 0 0 1 32.2 10.1Z" />
  ),
  triangle: <polygon {...line} fill={C.mint} points="32,8 57,52 7,52" />,
  gem: (
    <g {...line}>
      <polygon fill={C.aqua} points="20,12 44,12 56,26 32,56 8,26" />
      <path fill="none" d="M8 26h48M26 12l-4 14 10 30 10-30-4-14" />
    </g>
  ),
  bolt: <polygon {...line} fill={C.coral} points="38,6 14,36 30,36 24,58 50,26 34,26" />,
  flower: (
    <g {...line}>
      {[[32, 19], [44.4, 28], [39.6, 42.5], [24.4, 42.5], [19.6, 28]].map(([x, y]) => (
        <circle key={x + "-" + y} cx={x} cy={y} r="10" fill={C.purple} />
      ))}
      <circle cx="32" cy="32" r="8" fill={C.lemon} />
    </g>
  ),
  donut: (
    <g {...line}>
      <circle cx="32" cy="32" r="23" fill={C.sand} />
      <path fill={C.pink} d="M13 28c2-10 10-16 19-16s18 6 19 16c-3 4-6 1-9 4s-7 0-10 3-7-2-10 0-7-3-9-7Z" />
      <circle cx="32" cy="32" r="8" fill={FACE} />
      <path stroke={C.blue} strokeWidth="3" d="M22 20l3 2M40 18l-2 3M46 26l-3 1M19 28l3-1" />
    </g>
  ),
};

/* ---------------- Sky ---------------- */
const sky = {
  sun: (
    <g>
      <defs>
        <linearGradient id="art-sun" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.lemon} />
          <stop offset="1" stopColor={C.pink} />
        </linearGradient>
      </defs>
      <circle {...line} cx="32" cy="32" r="23" fill="url(#art-sun)" />
      <rect x="6" y="37" width="52" height="2.5" fill={FACE} />
      <rect x="6" y="43" width="52" height="3.2" fill={FACE} />
      <rect x="6" y="49.5" width="52" height="4" fill={FACE} />
    </g>
  ),
  cloud: (
    <path {...line} fill="#E3F2FD"
      d="M18 46a10 10 0 0 1 0-20 14 14 0 0 1 26-4 12.5 12.5 0 0 1 4 24Z" />
  ),
  rocket: (
    <g {...line}>
      <path fill={C.purple} d="M22 38 12 50l10-2ZM42 38l10 12-10-2Z" />
      <path fill={C.lemon} d="M26 46l6 12 6-12Z" />
      <path fill={C.pink} d="M32 6c12 10 14 26 10 40H22c-4-14-2-30 10-40Z" />
      <circle cx="32" cy="26" r="6" fill={C.blue} />
    </g>
  ),
  planet: (
    <g {...line}>
      <ellipse transform="rotate(-20 32 32)" cx="32" cy="32" rx="27" ry="8" fill="none" stroke={C.aqua} strokeWidth="4" />
      <circle cx="32" cy="32" r="15" fill={C.purple} />
      <path transform="rotate(-20 32 32)" d="M5 32a27 8 0 0 0 54 0" fill="none" stroke={INK} strokeWidth="8" />
      <path transform="rotate(-20 32 32)" d="M5 32a27 8 0 0 0 54 0" fill="none" stroke={C.aqua} strokeWidth="3.5" />
    </g>
  ),
  rainbow: (
    <g fill="none" strokeLinecap="round">
      <path d="M8 48a24 24 0 0 1 48 0" stroke={INK} strokeWidth="10" />
      <path d="M8 48a24 24 0 0 1 48 0" stroke={C.pink} strokeWidth="6" />
      <path d="M15 48a17 17 0 0 1 34 0" stroke={INK} strokeWidth="10" />
      <path d="M15 48a17 17 0 0 1 34 0" stroke={C.lemon} strokeWidth="6" />
      <path d="M22 48a10 10 0 0 1 20 0" stroke={INK} strokeWidth="10" />
      <path d="M22 48a10 10 0 0 1 20 0" stroke={C.blue} strokeWidth="6" />
    </g>
  ),
  ufo: (
    <g {...line}>
      <path fill="#BFE3FB" d="M20 32a12 12 0 0 1 24 0Z" />
      <ellipse cx="32" cy="36" rx="26" ry="9" fill={C.mint} />
      {[18, 32, 46].map((x) => (
        <circle key={x} cx={x} cy="37" r="3" fill={C.lemon} strokeWidth="2" />
      ))}
      <path fill="none" d="M24 48l-4 8M40 48l4 8" />
    </g>
  ),
  comet: (
    <g {...line}>
      <path fill="none" stroke={C.pink} strokeWidth="5" d="M31 33 10 54M34 38 20 56M27 28 8 42" />
      <circle cx="41" cy="23" r="12" fill={C.lemon} />
    </g>
  ),
  sparkle: (
    <g {...line}>
      <path fill={C.aqua} d="M32 6q4 22 26 26-22 4-26 26-4-22-26-26 22-4 26-26Z" />
      <circle cx="51" cy="12" r="4" fill={C.pink} />
    </g>
  ),
};

/* ---------------- Beach ---------------- */
const beach = {
  palm: (
    <g {...line}>
      <ellipse cx="30" cy="56" rx="20" ry="4" fill={C.sand} />
      <path fill={C.coral} d="M27 56c0-12 2-22 7-33l4 1c-4 11-6 21-5 32Z" />
      <path fill={C.mint} d="M36 22C28 12 16 12 10 18c10-2 18 0 26 4ZM36 22c8-12 20-10 24-2-10-4-18-2-24 2ZM36 22c-6 4-14 12-16 22 8-10 12-16 16-22ZM36 22c8 4 14 12 14 22-4-10-10-16-14-22Z" />
    </g>
  ),
  icecream: (
    <g {...line}>
      <circle cx="32" cy="25" r="14" fill={C.pink} />
      <polygon fill={C.sand} points="18,30 46,30 32,58" />
      <path fill="none" d="M25 37l11 9M39 37l-11 9" strokeWidth="2" />
      <circle cx="32" cy="9" r="4.5" fill={C.coral} />
    </g>
  ),
  shades: (
    <g {...line}>
      <defs>
        <linearGradient id="art-lens" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.pink} />
          <stop offset="1" stopColor={C.purple} />
        </linearGradient>
      </defs>
      <path fill="none" d="M8 28 4 20M56 28l4-8M28 30q4-4 8 0" />
      <rect x="7" y="24" width="21" height="17" rx="6" fill="url(#art-lens)" />
      <rect x="36" y="24" width="21" height="17" rx="6" fill="url(#art-lens)" />
      <path fill="none" stroke="#fff" strokeWidth="2.5" d="M12 29l4-2M41 29l4-2" />
    </g>
  ),
  cassette: (
    <g {...line}>
      <rect x="6" y="14" width="52" height="36" rx="5" fill={C.blue} />
      <rect x="12" y="19" width="40" height="13" rx="3" fill={C.lemon} />
      <circle cx="23" cy="39" r="5" fill={FACE} />
      <circle cx="41" cy="39" r="5" fill={FACE} />
      <path fill={C.purple} d="M16 50l4-5h24l4 5Z" />
    </g>
  ),
  ball: (
    <g {...line}>
      <path fill={C.pink} d="M32 32V10a22 22 0 0 1 19 33Z" />
      <path fill={C.blue} d="M32 32l19 11a22 22 0 0 1-38 0Z" />
      <path fill={C.lemon} d="M32 32 13 43a22 22 0 0 1 19-33Z" />
      <circle cx="32" cy="32" r="22" fill="none" />
      <circle cx="32" cy="32" r="5" fill={FACE} />
    </g>
  ),
  pyramid: (
    <g {...line}>
      <polygon fill={C.lemon} points="32,10 58,52 6,52" />
      <polygon fill={C.coral} points="32,10 58,52 40,52" />
    </g>
  ),
  fish: (
    <g {...line}>
      <polygon fill={C.purple} points="42,32 58,19 58,45" />
      <ellipse cx="28" cy="32" rx="19" ry="13" fill={C.aqua} />
      <path fill="none" d="M33 22q4 10 0 20" />
      <circle cx="19" cy="29" r="2.5" fill={INK} />
    </g>
  ),
  boat: (
    <g {...line}>
      <path fill="none" d="M32 8v36" />
      <polygon fill={C.lemon} points="35,10 35,40 54,40" />
      <polygon fill={C.pink} points="29,16 29,40 13,40" />
      <path fill={C.coral} d="M8 44h48l-8 10H16Z" />
    </g>
  ),
};

export const CARD_SETS = [
  { id: "shapes", name: "Shapes", preview: ["star", "heart", "moon"], art: shapes },
  { id: "sky", name: "Sky", preview: ["sun", "rocket", "planet"], art: sky },
  { id: "beach", name: "Beach", preview: ["icecream", "palm", "fish"], art: beach },
];

/** Three cards fanned out, for menus. Pass `null` as a name to show a card back. */
export function CardFan({ set, names = set.preview }) {
  const tilt = [-14, 0, 14];
  return (
    <span className="card-fan" aria-hidden>
      {names.map((name, i) => (
        <span
          key={i}
          className={`mini-card ${name ? "mini-card-front" : "mini-card-back"}`}
          style={{ "--r": `${tilt[i]}deg`, "--x": `${(i - 1) * 50}%`, "--y": i === 1 ? "-6%" : "4%", zIndex: i === 1 ? 2 : 1 }}
        >
          {name ? <CardArt set={set} name={name} className="h-[74%] w-[74%]" /> : <CardBack className="h-[52%] w-[52%]" />}
        </span>
      ))}
    </span>
  );
}

export function CardArt({ set, name, className = "mem-art" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden focusable={false}>
      {set.art[name]}
    </svg>
  );
}

/** Medallion printed in the middle of every card back (the lattice is CSS). */
export function CardBack({ className = "h-[50%] w-[50%]" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden focusable={false}>
      <defs>
        <linearGradient id="medal-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF3B0" />
          <stop offset="0.5" stopColor="#F7C948" />
          <stop offset="1" stopColor="#D89A1C" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="27" fill="#fffaf0" />
      <circle cx="32" cy="32" r="22" fill="#c43a31" stroke="#fffaf0" strokeWidth="2" strokeDasharray="2 3" />
      <polygon
        points="32,15 36.7,25.5 48,26.7 39.5,34.4 41.9,45.6 32,39.9 22.1,45.6 24.5,34.4 16,26.7 27.3,25.5"
        fill="url(#medal-gold)"
        stroke="#A86F0C"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Small gold star sticker stuck on a matched card. */
export function MatchSticker() {
  return (
    <svg viewBox="0 0 64 64" className="match-sticker" aria-hidden focusable={false}>
      <circle cx="32" cy="32" r="30" fill="#fff" />
      <circle cx="32" cy="32" r="25" fill="url(#medal-gold-s)" />
      <defs>
        <linearGradient id="medal-gold-s" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF3B0" />
          <stop offset="0.5" stopColor="#F7C948" />
          <stop offset="1" stopColor="#D89A1C" />
        </linearGradient>
      </defs>
      <polygon
        points="32,14 37.2,25 49.4,26.4 40.3,34.6 42.8,46.6 32,40.5 21.2,46.6 23.7,34.6 14.6,26.4 26.8,25"
        fill="#fff"
      />
    </svg>
  );
}
