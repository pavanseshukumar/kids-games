// Original illustrations for Find It Fast. Every object is drawn centred on (0, 0),
// about 32 units across, so the game can scatter, turn and scale them freely.
const INK = "#3D2A1E";
const S = { stroke: INK, strokeWidth: 2.5, strokeLinejoin: "round", strokeLinecap: "round" };
const shine = (d) => <path d={d} fill="none" stroke="#fff" strokeOpacity="0.65" strokeWidth="2.5" strokeLinecap="round" />;

export const BRIGHT = ["#E5483B", "#3A8DE6", "#F8C630", "#3FB35F", "#F2709C", "#9B6BE0", "#F59A2E"];

const STAR_PTS = Array.from({ length: 10 }, (_, i) => {
  const a = (i * Math.PI) / 5 - Math.PI / 2;
  const r = i % 2 ? 7 : 16;
  return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r + 1).toFixed(1)}`;
}).join(" ");

function Star({ c }) {
  return (
    <g>
      <polygon points={STAR_PTS} fill={c} {...S} />
      {shine("M-4-6l3-5")}
    </g>
  );
}

function Bird({ c }) {
  return (
    <g>
      <path d="M-10 2l-8-6 2 10Z" fill={c} {...S} />
      <ellipse cx="-1" cy="3" rx="12" ry="8.5" fill={c} {...S} />
      <circle cx="9" cy="-5" r="6.5" fill={c} {...S} />
      <path d="M15-6l6 2-6 2Z" fill="#F59A2E" {...S} strokeWidth="2" />
      <path d="M-6 0q5 8 12 0" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="10.5" cy="-6" r="1.6" fill={INK} />
      <path d="M-2 11v5M3 11v5" stroke={INK} strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

function Umbrella({ c }) {
  return (
    <g>
      <path d="M0 0v12a4 4 0 0 1-8 0" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <path d="M-17 1a17 15 0 0 1 34 0q-4.25-4-8.5 0-4.25-4-8.5 0-4.25-4-8.5 0-4.25-4-8.5 0Z" fill={c} {...S} />
      <path d="M0-14v15M-8.5 1c0-8 3-13 8.5-15M8.5 1c0-8-3-13-8.5-15" fill="none" stroke={INK} strokeWidth="1.6" opacity="0.5" />
      <path d="M0-14v-3" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
    </g>
  );
}

function Balloon({ c }) {
  return (
    <g>
      <path d="M0 9c-3 4 3 6 0 10" fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
      <ellipse cx="0" cy="-4" rx="11" ry="13" fill={c} {...S} />
      <path d="M-2.5 9.5h5l-2.5-3Z" fill={c} {...S} strokeWidth="1.8" />
      {shine("M-6-9q1-5 5-6")}
    </g>
  );
}

function Flower({ c }) {
  return (
    <g>
      {[0, 72, 144, 216, 288].map((a) => (
        <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 8.5} cy={Math.sin((a * Math.PI) / 180) * 8.5 - 1} r="7" fill={c} {...S} />
      ))}
      <circle cx="0" cy="-1" r="5.5" fill="#F8C630" {...S} />
    </g>
  );
}

function Apple({ c }) {
  return (
    <g>
      <path d="M0-8c-1-4 0-7 3-9" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M2-12c4-5 10-4 11-1-4 3-8 3-11 1Z" fill="#3FB35F" {...S} strokeWidth="1.8" />
      <path d="M0-7c-6-5-16-3-15 7 1 9 7 15 11 15 2 0 3-1 4-1s2 1 4 1c4 0 10-6 11-15 1-10-9-12-15-7Z" fill={c} {...S} />
      {shine("M-9-1q0-4 3-5")}
    </g>
  );
}

function Ball({ c }) {
  return (
    <g>
      <circle r="13.5" fill="#FFF6DC" {...S} />
      <path d="M-13 0h26" stroke={c} strokeWidth="6" />
      <path d="M0-13.5a20 20 0 0 1 0 27" fill="none" stroke={c} strokeWidth="5" />
      <circle r="13.5" fill="none" {...S} />
      {shine("M-7-7a9 9 0 0 1 4-3")}
    </g>
  );
}

function Butterfly({ c }) {
  return (
    <g>
      <ellipse cx="-8" cy="-6" rx="8" ry="9" transform="rotate(-20 -8 -6)" fill={c} {...S} />
      <ellipse cx="8" cy="-6" rx="8" ry="9" transform="rotate(20 8 -6)" fill={c} {...S} />
      <ellipse cx="-7" cy="8" rx="6" ry="6.5" fill={c} {...S} />
      <ellipse cx="7" cy="8" rx="6" ry="6.5" fill={c} {...S} />
      <circle cx="-8" cy="-6" r="2.6" fill="#FFF6DC" />
      <circle cx="8" cy="-6" r="2.6" fill="#FFF6DC" />
      <rect x="-2" y="-11" width="4" height="24" rx="2" fill={INK} />
      <path d="M-1-11l-4-6M1-11l4-6" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
    </g>
  );
}

function Heart({ c }) {
  return (
    <g>
      <path d="M0 14C-10 6-16 0-16-7c0-5 4-9 8.5-9 3.5 0 6 2 7.5 5 1.5-3 4-5 7.5-5 4.5 0 8.5 4 8.5 9 0 7-6 13-16 21Z" fill={c} {...S} />
      {shine("M-10-6q0-4 4-5")}
    </g>
  );
}

function Mushroom({ c }) {
  return (
    <g>
      <path d="M-6 2h12l2 13H-8Z" fill="#FFF6DC" {...S} />
      <path d="M-17 3C-17-10-8-15 0-15S17-10 17 3Z" fill={c} {...S} />
      <circle cx="-8" cy="-5" r="2.8" fill="#fff" />
      <circle cx="4" cy="-9" r="2.4" fill="#fff" />
      <circle cx="9" cy="-2" r="2.2" fill="#fff" />
    </g>
  );
}

function Kite({ c }) {
  return (
    <g>
      <path d="M0 15c-4 4 4 6 0 10" fill="none" stroke={INK} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M-3 19l3 2 3-2-3-2Z" fill="#E5483B" stroke={INK} strokeWidth="1" />
      <path d="M0-16L12-2 0 15-12-2Z" fill={c} {...S} />
      <path d="M0-16V15M-12-2h24" stroke={INK} strokeWidth="1.6" />
      <path d="M0-16L12-2H0Z" fill="#fff" opacity="0.35" />
    </g>
  );
}

function Leaf({ c }) {
  return (
    <g>
      <path d="M-14 12C-16-6-2-16 14-14 16 2 4 16-14 12Z" fill={c} {...S} />
      <path d="M-14 12L8-8M-6 4l-1-8M0-2l7 1" fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
    </g>
  );
}

const LEAF = ["#3FB35F", "#7BC24A", "#F59A2E", "#E5483B"];

export const THINGS = {
  star: { one: "star", many: "stars", Art: Star, colours: ["#F8C630", "#F59A2E", "#F2709C", "#3A8DE6"] },
  bird: { one: "bird", many: "birds", Art: Bird, colours: ["#3A8DE6", "#E5483B", "#F8C630", "#9B6BE0"] },
  umbrella: { one: "umbrella", many: "umbrellas", Art: Umbrella, colours: BRIGHT },
  balloon: { one: "balloon", many: "balloons", Art: Balloon, colours: BRIGHT },
  flower: { one: "flower", many: "flowers", Art: Flower, colours: ["#F2709C", "#E5483B", "#9B6BE0", "#FFFDF6", "#3A8DE6"] },
  apple: { one: "apple", many: "apples", Art: Apple, colours: ["#E5483B", "#7BC24A", "#F8C630"] },
  ball: { one: "ball", many: "balls", Art: Ball, colours: BRIGHT },
  butterfly: { one: "butterfly", many: "butterflies", Art: Butterfly, colours: BRIGHT },
  heart: { one: "heart", many: "hearts", Art: Heart, colours: ["#E5483B", "#F2709C", "#9B6BE0"] },
  mushroom: { one: "mushroom", many: "mushrooms", Art: Mushroom, colours: ["#E5483B", "#F59A2E", "#9B6BE0"] },
  kite: { one: "kite", many: "kites", Art: Kite, colours: BRIGHT },
  leaf: { one: "leaf", many: "leaves", Art: Leaf, colours: LEAF },
};
export const THING_IDS = Object.keys(THINGS);

/** One object, drawn into an SVG group (used inside the scene). */
export function Thing({ id, colour }) {
  const { Art } = THINGS[id];
  return <Art c={colour} />;
}

/** One object in its own little SVG (for the find list). */
export function ThingIcon({ id, colour, className = "h-full w-full" }) {
  const { Art, colours } = THINGS[id];
  return (
    <svg viewBox="-20 -20 40 40" className={className} aria-hidden focusable={false} overflow="visible">
      <Art c={colour || colours[0]} />
    </svg>
  );
}

/** The park the objects are scattered over. Drawn for a 360×360 picture. */
export function ParkBackdrop() {
  return (
    <g>
      <defs>
        <linearGradient id="seek-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8FCBF5" />
          <stop offset="1" stopColor="#DDF1FB" />
        </linearGradient>
        <linearGradient id="seek-grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8ED16A" />
          <stop offset="1" stopColor="#5DB04A" />
        </linearGradient>
      </defs>
      <rect width="360" height="360" fill="url(#seek-sky)" />
      <circle cx="318" cy="42" r="24" fill="#FFE27A" stroke="#F5C443" strokeWidth="4" />
      {[
        [70, 50, 1],
        [210, 34, 0.8],
      ].map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`} opacity="0.95">
          <path d="M-30 10c-10 0-10-14 0-14 2-10 16-12 20-4 4-8 20-6 20 4 10 0 10 14 0 14Z" fill="#fff" />
        </g>
      ))}
      <path d="M0 150C60 120 120 130 180 146S300 120 360 136V360H0Z" fill="#A8DC86" />
      <path d="M0 196C80 170 160 182 230 196S330 186 360 180V360H0Z" fill="url(#seek-grass)" />
      {/* house */}
      <g transform="translate(250 118)">
        <rect x="0" y="22" width="56" height="40" fill="#FFF1C9" stroke={INK} strokeWidth="2.5" />
        <path d="M-6 24L28 0l34 24Z" fill="#E5483B" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        <rect x="22" y="38" width="12" height="24" fill="#9A6440" stroke={INK} strokeWidth="2" />
        <rect x="6" y="32" width="10" height="10" fill="#8FCBF5" stroke={INK} strokeWidth="2" />
        <rect x="40" y="32" width="10" height="10" fill="#8FCBF5" stroke={INK} strokeWidth="2" />
      </g>
      {/* trees */}
      {[
        [40, 150, 1.1],
        [150, 160, 0.9],
      ].map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
          <rect x="-5" y="0" width="10" height="34" fill="#8A5A32" stroke={INK} strokeWidth="2.5" />
          <circle cx="0" cy="-10" r="24" fill="#3FA65E" stroke={INK} strokeWidth="2.5" />
        </g>
      ))}
      {/* pond and path */}
      <ellipse cx="96" cy="300" rx="70" ry="24" fill="#73AEEF" stroke="#3A8DE6" strokeWidth="3" />
      <path d="M220 360C226 300 260 260 300 230" fill="none" stroke="#E8C9A0" strokeWidth="26" strokeLinecap="round" />
    </g>
  );
}

/** Magnifying glass for the home-page card. */
export function Magnifier({ className = "w-full" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden focusable={false}>
      <path d="M62 62l26 26" stroke={INK} strokeWidth="18" strokeLinecap="round" />
      <path d="M62 62l26 26" stroke="#9A6440" strokeWidth="11" strokeLinecap="round" />
      <circle cx="40" cy="40" r="30" fill="#DDF1FB" fillOpacity="0.55" stroke={INK} strokeWidth="12" />
      <circle cx="40" cy="40" r="30" fill="none" stroke="#F8C630" strokeWidth="6" />
      <path d="M24 30a18 18 0 0 1 12-10" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}
