// Pictures for Odd One Out. Many come from other games (animals from Shadow
// Animals, everyday things from Riddle Champion, sky and beach cards from Memory,
// painted things from Colours, garden things from Find It Fast); the rest are
// drawn here in the same outlined style on a 100 × 100 grid.
import { ANIMALS } from "../shadows/art";
import { THINGS as RIDDLE_THINGS } from "../riddles/art";
import { SHAPES, makeItem } from "../colours/art";
import { CARD_SETS } from "../memory/art";
import { THINGS as SEEK_THINGS } from "../seek/art";

const INK = "#3D2A1E";
const S = { stroke: INK, strokeWidth: 3.5, strokeLinejoin: "round", strokeLinecap: "round" };
const shine = (d) => <path d={d} fill="none" stroke="#fff" strokeOpacity="0.6" strokeWidth="4" strokeLinecap="round" />;
const eye = (x, y, r = 2.6) => <circle cx={x} cy={y} r={r} fill={INK} />;

/* ---------------- Food ---------------- */
function Apple() {
  return (
    <g>
      <path d="M50 30c-2-8 0-14 6-18" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <path d="M54 22c8-10 20-8 22-2-8 6-16 6-22 2Z" fill="#3FB35F" {...S} />
      <path d="M50 32c-12-10-34-6-32 14 2 20 14 34 24 34 4 0 6-2 8-2s4 2 8 2c10 0 22-14 24-34 2-20-20-24-32-14Z" fill="#E5483B" {...S} />
      {shine("M28 46q0-8 6-11")}
    </g>
  );
}

function Mango() {
  return (
    <g>
      <path d="M58 20c2-6 6-8 10-8" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <path d="M62 18c10-6 22-2 24 6-10 4-18 2-24-6Z" fill="#3FB35F" {...S} />
      <path d="M58 20C34 16 16 34 18 58c2 18 18 28 34 26 22-2 34-20 30-40-2-14-10-22-24-24Z" fill="#F8B533" {...S} />
      <path d="M58 20c14 2 22 10 24 24 1 6 0 12-2 17-6-16-14-28-22-41Z" fill="#E5483B" opacity="0.55" />
      <path d="M58 20C34 16 16 34 18 58c2 18 18 28 34 26 22-2 34-20 30-40-2-14-10-22-24-24Z" fill="none" {...S} />
      {shine("M28 52q0-12 10-20")}
    </g>
  );
}

function Carrot() {
  return (
    <g>
      <path d="M50 26c-6-10-14-14-20-12 2 8 10 12 20 12ZM50 26c0-12 4-18 10-20 2 8-2 16-10 20ZM50 26c8-8 16-8 20-4-4 6-12 6-20 4Z" fill="#3FB35F" {...S} />
      <path d="M34 30h32c2 0 3 2 2 4L52 90c-1 3-3 3-4 0L32 34c-1-2 0-4 2-4Z" fill="#F59A2E" {...S} />
      <path d="M40 44h8M44 58h8M46 72h6M56 50h6" stroke="#B9661A" strokeWidth="3" strokeLinecap="round" />
      {shine("M38 36l4 14")}
    </g>
  );
}

function Banana() {
  return (
    <g>
      <path d="M80 22c4-2 8 0 8 4l-4 4" fill="#8A5A32" {...S} />
      <path d="M82 28C86 56 66 82 36 82c-12 0-20-4-22-8 0-2 2-3 4-3 26 2 46-12 54-42 2-4 9-5 10-1Z" fill="#F8D23C" {...S} />
      <path d="M72 30c-6 26-26 42-50 42" fill="none" stroke="#C9A20A" strokeWidth="3" strokeLinecap="round" />
      <path d="M16 72c-3 0-5 2-4 4" fill="none" stroke="#5E3B1F" strokeWidth="5" strokeLinecap="round" />
      {shine("M76 40q-4 16-14 26")}
    </g>
  );
}

function Potato() {
  return (
    <g>
      <path d="M22 40c4-16 24-22 40-18 18 4 28 18 22 34-6 18-24 26-42 22C24 74 18 56 22 40Z" fill="#C9965A" {...S} />
      {[[38, 40], [62, 36], [54, 60], [34, 62], [72, 54]].map(([x, y], i) => (
        <path key={i} d={`M${x - 3} ${y}q3-3 6 0`} fill="none" stroke="#7A4A22" strokeWidth="3" strokeLinecap="round" />
      ))}
      {shine("M32 34q8-8 18-8")}
    </g>
  );
}

/* ---------------- Animals & plants ---------------- */
function Dog() {
  const c = "#C98A4A";
  return (
    <g>
      <path d="M90 50q10-6 8-18" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <path d="M90 50q10-6 8-18" fill="none" stroke={c} strokeWidth="5" strokeLinecap="round" />
      {[36, 46, 74, 84].map((x) => (
        <rect key={x} x={x} y="62" width="9" height="28" rx="4" fill={x === 46 || x === 84 ? "#A86F3A" : c} {...S} />
      ))}
      <ellipse cx="62" cy="58" rx="30" ry="16" fill={c} {...S} />
      <path d="M60 46c8 2 14 8 14 14" fill="none" stroke="#FFF1D6" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
      <circle cx="30" cy="38" r="17" fill={c} {...S} />
      <path d="M14 38c-6 0-8 4-6 8 2 6 10 6 14 2Z" fill="#FFF1D6" {...S} />
      <circle cx="9" cy="40" r="3.5" fill={INK} />
      <path d="M30 24c8-4 14 2 12 14-1 6-6 10-10 8Z" fill="#7A4A22" {...S} />
      {eye(24, 34)}
      <path d="M14 50q4 6 10 2" fill="#E5483B" stroke={INK} strokeWidth="2" />
      <rect x="38" y="48" width="12" height="6" rx="3" fill="#E5483B" {...S} strokeWidth="2.5" />
    </g>
  );
}

function Rose() {
  return (
    <g>
      <path d="M50 46V92" stroke="#2F8F4E" strokeWidth="6" strokeLinecap="round" />
      <path d="M50 70c-14-2-22 4-24 10 10 4 20 0 24-10ZM50 62c12-4 22 0 24 6-10 4-18 2-24-6Z" fill="#4CB860" {...S} />
      <path d="M50 46c-16 0-24-10-24-22 6 2 10 2 14-2 4 4 8 6 10 6s6-2 10-6c4 4 8 4 14 2 0 12-8 22-24 22Z" fill="#E5483B" {...S} />
      <path d="M38 22c2-10 8-14 12-14s10 4 12 14c-4 4-8 6-12 6s-8-2-12-6Z" fill="#F06A5E" {...S} />
      <path d="M44 22c2 4 10 4 12 0M42 32c4 6 12 6 16 0" fill="none" stroke="#A42C22" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  );
}

/* ---------------- Things that go ---------------- */
const wheel = (x, y, r = 9) => (
  <g key={`${x}-${y}`}>
    <circle cx={x} cy={y} r={r} fill={INK} />
    <circle cx={x} cy={y} r={r * 0.42} fill="#C9CDD2" />
  </g>
);

function Bus() {
  return (
    <g>
      <rect x="8" y="26" width="84" height="48" rx="9" fill="#F8C630" {...S} />
      {[16, 36, 56].map((x) => (
        <rect key={x} x={x} y="34" width="16" height="16" rx="3" fill="#BFE6FF" {...S} strokeWidth="2.5" />
      ))}
      <rect x="76" y="34" width="10" height="28" rx="2" fill="#BFE6FF" {...S} strokeWidth="2.5" />
      <path d="M10 58h64" stroke="#E5483B" strokeWidth="5" />
      <circle cx="88" cy="66" r="3" fill="#fff" stroke={INK} strokeWidth="2" />
      {wheel(26, 76)}
      {wheel(72, 76)}
    </g>
  );
}

function Car() {
  return (
    <g>
      <path d="M8 66v-10c0-6 4-10 10-10h8l12-14c2-2 4-3 7-3h20c3 0 5 1 7 3l12 14h4c6 0 6 4 6 10v10Z" fill="#E5483B" {...S} />
      <path d="M40 46l8-10h10v10ZM64 46V36h4l9 10Z" fill="#BFE6FF" {...S} strokeWidth="2.5" />
      <circle cx="90" cy="56" r="3" fill="#F8C630" stroke={INK} strokeWidth="2" />
      {shine("M18 54h20")}
      {wheel(28, 68, 10)}
      {wheel(74, 68, 10)}
    </g>
  );
}

function Train() {
  return (
    <g>
      <circle cx="74" cy="14" r="7" fill="#fff" stroke="#B9BEC4" strokeWidth="2.5" />
      <circle cx="84" cy="8" r="5" fill="#fff" stroke="#B9BEC4" strokeWidth="2.5" />
      <rect x="64" y="22" width="12" height="18" rx="2" fill={INK} />
      <rect x="10" y="22" width="34" height="50" rx="5" fill="#3A8DE6" {...S} />
      <rect x="6" y="16" width="42" height="10" rx="4" fill="#2261A8" {...S} />
      <rect x="18" y="32" width="18" height="16" rx="3" fill="#BFE6FF" {...S} strokeWidth="2.5" />
      <rect x="40" y="40" width="48" height="32" rx="8" fill="#3A8DE6" {...S} />
      <path d="M88 72l8 10H82Z" fill="#F8C630" {...S} strokeWidth="2.5" />
      {wheel(24, 76, 10)}
      {wheel(52, 78, 8)}
      {wheel(74, 78, 8)}
    </g>
  );
}

/* ---------------- Clothes & school ---------------- */
function Shirt() {
  return (
    <g>
      <path d="M36 14l14 8 14-8 26 14-8 18-10-4v44H28V42l-10 4-8-18Z" fill="#3A8DE6" {...S} />
      <path d="M36 14c2 8 26 8 28 0" fill="#2261A8" {...S} />
      <path d="M32 58h36" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
      {shine("M34 30v16")}
    </g>
  );
}

function Shoes() {
  const shoe = (dx, dy, c) => (
    <g transform={`translate(${dx} ${dy})`}>
      <path d="M10 56V36c0-4 4-6 8-6h10c4 0 6 2 7 6l3 8c14 0 28 4 34 10 2 2 2 6 0 8H12c-2 0-2-2-2-6Z" fill={c} {...S} />
      <path d="M10 62h62" stroke="#fff" strokeWidth="6" />
      <path d="M10 62h62" fill="none" {...S} strokeWidth="2.5" />
      <path d="M38 44l-6 6M44 46l-6 6" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
  return (
    <g>
      {shoe(18, -12, "#3FB35F")}
      {shoe(4, 16, "#E5483B")}
    </g>
  );
}

function Pencil() {
  return (
    <g transform="rotate(-40 50 50)">
      <rect x="10" y="40" width="58" height="20" fill="#F8C630" {...S} />
      <path d="M10 47h58" stroke="#E0A10A" strokeWidth="3" />
      <rect x="4" y="40" width="10" height="20" rx="3" fill="#F2709C" {...S} />
      <rect x="12" y="40" width="6" height="20" fill="#C9CDD2" {...S} strokeWidth="2.5" />
      <path d="M68 40l22 10-22 10Z" fill="#F3D3A0" {...S} />
      <path d="M83 47l7 3-7 3Z" fill={INK} />
    </g>
  );
}

/* ---------------- Sky ---------------- */
function Sun() {
  return (
    <g>
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d="M50 14v-10" stroke="#F59A2E" strokeWidth="6" strokeLinecap="round" transform={`rotate(${i * 45} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="26" fill="#FFD23F" {...S} />
      {shine("M36 42q2-8 10-10")}
    </g>
  );
}

function Moon() {
  return (
    <g>
      <path d="M58 12a38 38 0 1 0 28 56 30 30 0 0 1-28-56Z" fill="#FFE7A0" {...S} />
      <circle cx="40" cy="60" r="5" fill="#E8C870" />
      <circle cx="52" cy="76" r="3.5" fill="#E8C870" />
    </g>
  );
}

function Star() {
  return (
    <g>
      <polygon points="50,8 61,36 91,38 68,57 76,87 50,70 24,87 32,57 9,38 39,36" fill="#FFD23F" {...S} />
      {shine("M46 26l-5 12")}
    </g>
  );
}

function Cloud() {
  return (
    <g>
      <path d="M26 72a16 16 0 0 1-2-32 22 22 0 0 1 40-10 18 18 0 0 1 22 22 12 12 0 0 1-4 20Z" fill="#fff" {...S} />
      <path d="M30 64h44" stroke="#D6EAF8" strokeWidth="5" strokeLinecap="round" />
    </g>
  );
}

/* ---------------- More food ---------------- */
function Lemon() {
  return (
    <g>
      <path d="M14 52c0-18 16-30 36-30s36 12 36 30-16 30-36 30-36-12-36-30Z" fill="#FFE14D" {...S} />
      <path d="M14 52l-6-2M86 52l6-2" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <path d="M50 22c4-6 12-8 18-6-2 6-10 8-18 6Z" fill="#3FB35F" {...S} />
      {shine("M26 44q6-10 18-12")}
    </g>
  );
}

function Orange() {
  return (
    <g>
      <circle cx="50" cy="54" r="32" fill="#F59A2E" {...S} />
      {[[36, 46], [60, 40], [64, 64], [42, 68], [50, 56]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.6" fill="#C96E12" />
      ))}
      <path d="M50 22c-2-6 0-10 4-12" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <path d="M52 20c8-8 18-6 22 0-8 4-16 4-22 0Z" fill="#3FB35F" {...S} />
      {shine("M28 46q2-10 12-16")}
    </g>
  );
}

function Strawberry() {
  return (
    <g>
      <path d="M50 30c22-4 34 6 32 20-2 16-16 32-32 38-16-6-30-22-32-38-2-14 10-24 32-20Z" fill="#E5483B" {...S} />
      {[[38, 46], [54, 44], [66, 54], [44, 62], [58, 66], [50, 78], [30, 56]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="2" ry="3" fill="#FFE14D" />
      ))}
      <path d="M50 32 36 22l6 12-12 2 14 4M50 32l14-10-6 12 12 2-14 4M50 32V18" fill="#3FB35F" stroke={INK} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      {shine("M28 48q0-6 4-8")}
    </g>
  );
}

function Onion() {
  return (
    <g>
      <path d="M50 22c-14 12-32 22-32 42 0 14 14 24 32 24s32-10 32-24c0-20-18-30-32-42Z" fill="#B57BD6" {...S} />
      <path d="M50 26c-8 14-12 30-8 60M50 26c8 14 12 30 8 60" fill="none" stroke="#7E4AA6" strokeWidth="2.5" />
      <path d="M50 22c-2-8-6-12-10-14M50 22c2-8 6-12 10-14" fill="none" stroke="#3FB35F" strokeWidth="5" strokeLinecap="round" />
      <path d="M42 88l-4 6M50 88v6M58 88l4 6" stroke="#C9A06A" strokeWidth="2.5" strokeLinecap="round" />
      {shine("M28 58q2-12 10-20")}
    </g>
  );
}

/* ---------------- Hot & cold ---------------- */
function Fire() {
  return (
    <g>
      <path d="M50 8c4 18 26 26 26 50 0 18-12 30-26 30S24 76 24 58c0-14 8-20 12-30 4 8 4 14 8 16 0-12 2-24 6-36Z" fill="#F59A2E" {...S} />
      <path d="M50 46c2 10 14 14 14 26 0 8-6 14-14 14s-14-6-14-14c0-8 6-12 8-18 2 4 2 6 4 8 0-6 0-12 2-16Z" fill="#FFD23F" />
      <path d="M24 90h52" stroke="#8A5A32" strokeWidth="7" strokeLinecap="round" />
    </g>
  );
}

function Candle() {
  return (
    <g>
      <path d="M50 10c6 8 8 14 8 18a8 8 0 0 1-16 0c0-4 2-10 8-18Z" fill="#FFB020" {...S} />
      <path d="M50 22c2 3 3 6 3 8a3 3 0 0 1-6 0c0-2 1-5 3-8Z" fill="#FFF3B0" />
      <path d="M50 36v6" stroke={INK} strokeWidth="3" />
      <rect x="36" y="42" width="28" height="44" rx="4" fill="#F7A8C4" {...S} />
      <path d="M44 42v12q0 4 4 4" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
      <ellipse cx="50" cy="88" rx="26" ry="6" fill="#C9CDD2" {...S} />
    </g>
  );
}

function Snowman() {
  return (
    <g>
      <circle cx="50" cy="68" r="24" fill="#fff" {...S} />
      <circle cx="50" cy="34" r="17" fill="#fff" {...S} />
      <rect x="36" y="10" width="28" height="12" rx="3" fill={INK} />
      <rect x="30" y="20" width="40" height="5" rx="2" fill={INK} />
      {eye(44, 31, 2.4)}
      {eye(56, 31, 2.4)}
      <path d="M50 36l12 3-12 3Z" fill="#F59A2E" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M34 48c10 6 22 6 32 0" fill="none" stroke="#E5483B" strokeWidth="7" strokeLinecap="round" />
      <circle cx="50" cy="62" r="3" fill={INK} />
      <circle cx="50" cy="74" r="3" fill={INK} />
      <path d="M28 60 14 50M72 60l14-10" stroke="#8A5A32" strokeWidth="4" strokeLinecap="round" />
    </g>
  );
}

/* ---------------- Music & bathroom ---------------- */
function Drum() {
  return (
    <g>
      <path d="M16 38v32c0 8 16 14 34 14s34-6 34-14V38" fill="#E5483B" {...S} />
      <path d="M16 46l14 34M38 52l12 32M62 52 50 84M84 46 70 80" stroke="#F8C630" strokeWidth="3" />
      <ellipse cx="50" cy="38" rx="34" ry="12" fill="#FFF6E6" {...S} />
      <path d="M62 30 84 8M70 32l20-14" stroke="#8A5A32" strokeWidth="5" strokeLinecap="round" />
      <circle cx="86" cy="7" r="5" fill="#F3D3A0" {...S} strokeWidth="2.5" />
      <circle cx="92" cy="17" r="5" fill="#F3D3A0" {...S} strokeWidth="2.5" />
    </g>
  );
}

function Guitar() {
  return (
    <g transform="rotate(35 50 50)">
      <rect x="45" y="4" width="10" height="44" rx="2" fill="#8A5A32" {...S} />
      <rect x="42" y="0" width="16" height="10" rx="3" fill="#5E3B1F" {...S} strokeWidth="2.5" />
      <path d="M50 40c-12 0-18 6-16 14 1 4-6 6-6 14 0 12 10 20 22 20s22-8 22-20c0-8-7-10-6-14 2-8-4-14-16-14Z" fill="#F59A2E" {...S} />
      <circle cx="50" cy="64" r="7" fill="#5E3B1F" />
      <path d="M50 8v76" stroke="#F3F3F3" strokeWidth="1.5" />
      <rect x="42" y="76" width="16" height="4" rx="1.5" fill="#5E3B1F" />
    </g>
  );
}

function Toothbrush() {
  return (
    <g transform="rotate(-35 50 50)">
      <rect x="8" y="44" width="62" height="12" rx="6" fill="#3A8DE6" {...S} />
      <rect x="66" y="40" width="26" height="12" rx="3" fill="#fff" {...S} strokeWidth="2.5" />
      {[70, 76, 82, 88].map((x) => (
        <path key={x} d={`M${x} 40v-12`} stroke="#9ED8F5" strokeWidth="4" strokeLinecap="round" />
      ))}
      {shine("M16 48h30")}
    </g>
  );
}

/* ---------------- Drawings borrowed from other games ---------------- */
/** Shadow Animals: 120 × 100 grid, standing on y ≈ 92. */
function fromShadows(id) {
  const { Art } = ANIMALS[id];
  return function Animal() {
    return (
      <g transform="translate(0 6) scale(0.833)">
        <Art />
      </g>
    );
  };
}
/** Riddle Champion: already 100 × 100. */
const fromRiddles = (id) => RIDDLE_THINGS[id].Art;
/** Colours: 64 × 64, painted in one of its colours. */
function fromColours(id, colour) {
  const art = makeItem(id, colour).art;
  return function Painted() {
    return <g transform="translate(5 5) scale(1.4)">{art}</g>;
  };
}
/** Shape outlines from Colours with a custom fill. */
function fromShapes(id, fill) {
  const shape = SHAPES.find((s) => s.id === id);
  return function Shape() {
    return <g transform="translate(5 5) scale(1.4)">{shape.draw(fill)}</g>;
  };
}
/** Memory cards: 64 × 64. */
function fromCards(setIndex, name) {
  const art = CARD_SETS[setIndex].art[name];
  return function Card() {
    return <g transform="translate(5 5) scale(1.4)">{art}</g>;
  };
}
/** Find It Fast: centred on (0, 0), about 36 across. */
function fromSeek(id, colour) {
  const { Art } = SEEK_THINGS[id];
  return function Seek() {
    return (
      <g transform="translate(50 50) scale(2.3)">
        <Art c={colour} />
      </g>
    );
  };
}

const item = (word, Art, a = `a ${word}`) => ({ word, a, Art });
const an = (word, Art) => item(word, Art, `an ${word}`);

export const ITEMS = {
  /* food */
  apple: an("apple", Apple),
  mango: item("mango", Mango),
  carrot: item("carrot", Carrot),
  banana: item("banana", Banana),
  potato: item("potato", Potato),
  lemon: item("lemon", Lemon),
  orange: an("orange", Orange),
  strawberry: item("strawberry", Strawberry),
  onion: an("onion", Onion),
  icecream: an("ice cream", fromCards(2, "icecream")),
  donut: item("donut", fromCards(0, "donut")),
  /* animals */
  dog: item("dog", Dog),
  cat: item("cat", fromShadows("cat")),
  lion: item("lion", fromShadows("lion")),
  cow: item("cow", fromShadows("cow")),
  horse: item("horse", fromShadows("horse")),
  sheep: item("sheep", fromShadows("sheep")),
  pig: item("pig", fromShadows("pig")),
  hen: item("hen", fromShadows("hen")),
  duck: item("duck", fromShadows("duck")),
  owl: an("owl", fromShadows("owl")),
  penguin: item("penguin", fromShadows("penguin")),
  frog: item("frog", fromShadows("frog")),
  kangaroo: item("kangaroo", fromShadows("kangaroo")),
  rabbit: item("rabbit", fromShadows("rabbit")),
  snail: item("snail", fromShadows("snail")),
  tortoise: item("tortoise", fromShadows("tortoise")),
  crocodile: item("crocodile", fromShadows("crocodile")),
  camel: item("camel", fromShadows("camel")),
  elephant: an("elephant", fromShadows("elephant")),
  giraffe: item("giraffe", fromShadows("giraffe")),
  rhino: item("rhino", fromShadows("rhino")),
  fox: item("fox", fromShadows("fox")),
  bear: item("bear", fromShadows("bear")),
  bird: item("bird", fromSeek("bird", "#3A8DE6")),
  butterfly: item("butterfly", fromSeek("butterfly", "#F2709C")),
  fish: item("fish", fromColours("fish", "blue")),
  /* plants */
  rose: item("rose", Rose),
  leaf: item("leaf", fromSeek("leaf", "#3FB35F")),
  mushroom: item("mushroom", fromSeek("mushroom", "#E5483B")),
  flower: item("flower", fromSeek("flower", "#9B6BE0")),
  /* sky & space */
  sun: item("sun", Sun),
  moon: item("moon", Moon),
  star: item("star", Star),
  cloud: item("cloud", Cloud),
  rocket: item("rocket", fromCards(1, "rocket")),
  planet: item("planet", fromCards(1, "planet")),
  /* hot & cold */
  fire: item("fire", Fire),
  candle: item("candle", Candle),
  snowman: item("snowman", Snowman),
  sunglasses: item("sunglasses", fromCards(2, "shades"), "sunglasses"),
  /* things */
  clock: item("clock", fromRiddles("clock")),
  comb: item("comb", fromRiddles("comb")),
  bottle: item("bottle", fromRiddles("bottle")),
  towel: item("towel", fromRiddles("towel")),
  piano: item("piano", fromRiddles("piano")),
  needle: item("needle", fromRiddles("needle")),
  glove: item("glove", fromRiddles("glove")),
  spoon: item("spoon", fromRiddles("spoon")),
  cup: item("cup", fromRiddles("cup")),
  ball: item("ball", fromRiddles("ball")),
  book: item("book", fromRiddles("book")),
  hat: item("hat", fromRiddles("hat")),
  mug: item("mug", fromColours("mug", "red")),
  pencil: item("pencil", Pencil),
  shirt: item("shirt", Shirt),
  shoes: item("shoes", Shoes, "shoes"),
  drum: item("drum", Drum),
  guitar: item("guitar", Guitar),
  toothbrush: item("toothbrush", Toothbrush),
  umbrella: an("umbrella", fromColours("umbrella", "blue")),
  pyramid: item("pyramid", fromCards(2, "pyramid")),
  /* toys & things that go */
  kite: item("kite", fromColours("kite", "yellow")),
  balloon: item("balloon", fromColours("balloon", "red")),
  bus: item("bus", Bus),
  car: item("car", Car),
  train: item("train", Train),
  boat: item("boat", fromColours("boat", "blue")),
  /* shapes */
  circle: item("circle", fromShapes("circle", "#3A8DE6")),
  square: item("square", fromShapes("square", "#E5483B")),
  triangle: item("triangle", fromShapes("triangle", "#3FB35F")),
  /* the same thing in different colours, for colour questions */
  redBalloon: item("red balloon", fromColours("balloon", "red")),
  blueBalloon: item("blue balloon", fromColours("balloon", "blue")),
  redCar: item("red car", fromColours("car", "red")),
  blueCar: item("blue car", fromColours("car", "blue")),
  yellowKite: item("yellow kite", fromColours("kite", "yellow")),
  greenKite: item("green kite", fromColours("kite", "green")),
  yellowStar: item("yellow star", fromColours("star", "yellow")),
  blueFish: item("blue fish", fromColours("fish", "blue")),
  redFish: item("red fish", fromColours("fish", "red")),
  blueUmbrella: item("blue umbrella", fromColours("umbrella", "blue")),
  redHeart: item("red heart", fromColours("heart", "red")),
};

export function ItemArt({ id, className = "h-full w-full" }) {
  const { Art } = ITEMS[id];
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden focusable={false} overflow="visible">
      <Art />
    </svg>
  );
}
