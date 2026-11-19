// Original illustrations for Shadow Animals. Each animal is drawn in colour on a
// 120×100 grid, side-on, standing on y ≈ 92. The game turns it into a silhouette
// with a CSS filter, so the outline alone has to say "elephant" or "giraffe".
const INK = "#3D2A1E";
const S = { stroke: INK, strokeWidth: 3, strokeLinejoin: "round", strokeLinecap: "round" };
const eye = (x, y, r = 2.4) => <circle cx={x} cy={y} r={r} fill={INK} />;

/** A thick limb or tail: an ink outline under a coloured stroke. */
function Limb({ d, w = 8, fill }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={INK} strokeWidth={w + 6} />
      <path d={d} stroke={fill} strokeWidth={w} />
    </g>
  );
}

function Elephant() {
  const c = "#A7AEB8";
  return (
    <g>
      <path d="M104 50q8 10 4 20" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      {[46, 60, 80, 92].map((x) => (
        <rect key={x} x={x} y="60" width="13" height="32" rx="5" fill={x === 60 || x === 92 ? "#959CA6" : c} {...S} />
      ))}
      <ellipse cx="74" cy="50" rx="34" ry="24" fill={c} {...S} />
      <Limb d="M28 50c-8 8-12 20-12 32 0 6 6 7 8 3" w={10} fill={c} />
      <circle cx="36" cy="40" r="19" fill={c} {...S} />
      <path d="M44 24c14-6 24 6 22 22-2 14-12 18-20 12Z" fill="#959CA6" {...S} />
      <path d="M26 52q-6 6-14 4" fill="none" stroke="#FFF6DC" strokeWidth="4" strokeLinecap="round" />
      <path d="M26 52q-6 6-14 4" fill="none" stroke={INK} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      {eye(30, 36)}
    </g>
  );
}

function Giraffe() {
  const c = "#F2B544";
  const spot = "#B86E2D";
  return (
    <g>
      <path d="M26 46l-6 22" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      {[30, 38, 58, 66].map((x) => (
        <rect key={x} x={x} y="52" width="7" height="40" rx="3" fill={x === 38 || x === 66 ? "#E3A53A" : c} {...S} />
      ))}
      <ellipse cx="50" cy="48" rx="26" ry="13" fill={c} {...S} />
      <path d="M60 42L82 10h10L76 50Z" fill={c} {...S} />
      <path d="M84 4v-5M92 4v-5" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="84" cy="-2" r="2.6" fill={spot} />
      <circle cx="92" cy="-2" r="2.6" fill={spot} />
      <ellipse cx="96" cy="10" rx="13" ry="7.5" transform="rotate(18 96 10)" fill={c} {...S} />
      <path d="M80 6l-6-4 2 8Z" fill={c} {...S} strokeWidth="2.5" />
      {eye(94, 7, 2)}
      {[
        [40, 44, 5],
        [54, 50, 4.5],
        [60, 41, 3.5],
        [72, 30, 3.5],
        [78, 20, 3],
        [44, 54, 3],
      ].map(([x, y, r], i) => (
        <rect key={i} x={x - r} y={y - r} width={r * 2} height={r * 2} rx={r * 0.6} transform={`rotate(${i * 23} ${x} ${y})`} fill={spot} />
      ))}
    </g>
  );
}

function Rabbit() {
  const c = "#C9A27E";
  return (
    <g>
      <ellipse cx="72" cy="22" rx="6" ry="20" transform="rotate(-14 72 22)" fill={c} {...S} />
      <ellipse cx="86" cy="22" rx="6" ry="20" transform="rotate(14 86 22)" fill={c} {...S} />
      <ellipse cx="86" cy="22" rx="2.5" ry="13" transform="rotate(14 86 22)" fill="#F2A7B8" />
      <ellipse cx="52" cy="70" rx="27" ry="21" fill={c} {...S} />
      <circle cx="26" cy="70" r="8" fill="#FFF6DC" {...S} />
      <circle cx="78" cy="50" r="15" fill={c} {...S} />
      <ellipse cx="62" cy="89" rx="15" ry="5" fill={c} {...S} />
      <circle cx="92" cy="52" r="2.5" fill="#E5708A" />
      {eye(82, 46)}
    </g>
  );
}

function Cat() {
  const c = "#F59A2E";
  return (
    <g>
      <Limb d="M74 88c20 0 26-16 18-32" w={7} fill={c} />
      <ellipse cx="56" cy="70" rx="21" ry="22" fill={c} {...S} />
      <path d="M42 34l0-20 14 10ZM70 34l0-20-14 10Z" fill={c} {...S} />
      <circle cx="56" cy="40" r="16" fill={c} {...S} />
      <ellipse cx="48" cy="90" rx="8" ry="4" fill={c} {...S} />
      <ellipse cx="64" cy="90" rx="8" ry="4" fill={c} {...S} />
      <path d="M50 66v14M58 64v16" stroke="#C96E12" strokeWidth="3" strokeLinecap="round" />
      {eye(50, 38)}
      {eye(62, 38)}
      <path d="M53 45l3 2 3-2M40 44h-10M40 48l-9 2M72 44h10M72 48l9 2" fill="none" stroke={INK} strokeWidth="1.5" strokeLinecap="round" />
    </g>
  );
}

function Cow() {
  const c = "#FFFDF6";
  return (
    <g>
      <path d="M100 40q8 14 4 30" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <circle cx="104" cy="72" r="4" fill={INK} />
      {[44, 54, 84, 94].map((x) => (
        <rect key={x} x={x} y="56" width="9" height="36" rx="3" fill={c} {...S} />
      ))}
      <rect x="38" y="30" width="66" height="34" rx="14" fill={c} {...S} />
      <path d="M78 64q4 8 10 0" fill="#F2A7B8" {...S} strokeWidth="2.5" />
      <path d="M52 32c6 8 18 6 16-2ZM84 36c8-2 14 6 10 14-6 2-12-4-10-14Z" fill={INK} />
      <path d="M22 24q-6-10 0-14M38 24q6-10 0-14" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <path d="M14 30l-10 4 10 4ZM46 30l10 4-10 4Z" fill={c} {...S} />
      <rect x="16" y="22" width="28" height="34" rx="12" fill={c} {...S} />
      <ellipse cx="30" cy="54" rx="15" ry="9" fill="#F2A7B8" {...S} />
      <circle cx="25" cy="54" r="1.8" fill={INK} />
      <circle cx="35" cy="54" r="1.8" fill={INK} />
      {eye(23, 36)}
      {eye(37, 36)}
    </g>
  );
}

function Kangaroo() {
  const c = "#C98A4A";
  return (
    <g>
      <Limb d="M44 80C30 88 18 90 4 90" w={10} fill={c} />
      <ellipse cx="62" cy="89" rx="20" ry="4.5" fill={c} {...S} />
      <Limb d="M60 38L70 26" w={11} fill={c} />
      <ellipse cx="56" cy="56" rx="15" ry="25" transform="rotate(14 56 56)" fill={c} {...S} />
      <ellipse cx="48" cy="76" rx="14" ry="14" fill={c} {...S} />
      <Limb d="M66 46q6 6 10 10M64 52q6 6 9 10" w={3.5} fill={c} />
      <path d="M58 66q6 4 8-6" fill="none" stroke="#9A6440" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="68" cy="10" rx="4.5" ry="10" transform="rotate(-14 68 10)" fill={c} {...S} />
      <ellipse cx="78" cy="22" rx="13" ry="8" transform="rotate(16 78 22)" fill={c} {...S} />
      <circle cx="90" cy="27" r="2.2" fill={INK} />
      {eye(76, 19)}
    </g>
  );
}

function Crocodile() {
  const c = "#3FA65E";
  return (
    <g>
      {[30, 46, 74, 88].map((x, i) => (
        <path key={x} d={`M${x} 74l${i % 2 ? 4 : -4} 16h10l-2-16Z`} fill={i % 2 ? "#2F8A4A" : c} {...S} strokeWidth="2.5" />
      ))}
      <path
        d="M2 78C20 72 36 62 60 62s38 2 46 6l12 2c4 1 4 9 0 10l-16 2C88 86 70 86 58 84 40 82 20 82 2 78Z"
        fill={c}
        {...S}
      />
      <path d="M30 66l3-6 3 5 3-6 3 5 3-6 3 5 3-6 3 5 3-6 3 5" fill="none" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="94" cy="62" r="5" fill={c} {...S} />
      {eye(95, 61, 1.8)}
      <path d="M96 78l2 3 2-3 2 3 2-3 2 3 2-3" fill="#fff" stroke={INK} strokeWidth="1.2" />
    </g>
  );
}

function Camel() {
  const c = "#D9A066";
  return (
    <g>
      <path d="M26 44q-6 10-4 22" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      {[32, 40, 62, 70].map((x) => (
        <rect key={x} x={x} y="50" width="7" height="42" rx="3" fill={x === 40 || x === 70 ? "#C68C52" : c} {...S} />
      ))}
      <ellipse cx="52" cy="46" rx="28" ry="14" fill={c} {...S} />
      <path d="M32 40C34 16 60 14 62 40Z" fill={c} {...S} />
      <Limb d="M76 46c10 4 14 0 14-10s2-14 8-14" w={9} fill={c} />
      <ellipse cx="102" cy="22" rx="12" ry="7" fill={c} {...S} />
      <path d="M96 16l-2-6 6 4Z" fill={c} {...S} strokeWidth="2.5" />
      {eye(102, 19)}
      <path d="M110 25h3" stroke={INK} strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

function Owl() {
  const c = "#9A6440";
  return (
    <g>
      <rect x="18" y="86" width="86" height="9" rx="4.5" fill="#6E4322" {...S} />
      <path d="M38 30l-4-18 14 10ZM82 30l4-18-14 10Z" fill={c} {...S} />
      <ellipse cx="60" cy="56" rx="24" ry="32" fill={c} {...S} />
      <ellipse cx="60" cy="66" rx="14" ry="18" fill="#E8C9A0" />
      <path d="M38 48c-8 12-6 26 4 34M82 48c8 12 6 26-4 34" fill="none" stroke="#6E4322" strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="40" r="9" fill="#FFF6DC" {...S} strokeWidth="2.5" />
      <circle cx="70" cy="40" r="9" fill="#FFF6DC" {...S} strokeWidth="2.5" />
      {eye(51, 40, 4)}
      {eye(69, 40, 4)}
      <path d="M57 48h6l-3 6Z" fill="#F59A2E" {...S} strokeWidth="2" />
      <path d="M52 86v4M58 86v4M64 86v4M70 86v4" stroke="#F59A2E" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

function Snail() {
  return (
    <g>
      <path d="M86 70l-4-24M94 70l2-24" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <circle cx="82" cy="44" r="3.5" fill={INK} />
      <circle cx="96" cy="44" r="3.5" fill={INK} />
      <path d="M14 90c0-6 10-8 20-8h50c4-6 6-14 10-18 8-6 18 0 16 10-2 8-8 12-12 16H20c-4 0-6 2-6 0Z" fill="#E8C9A0" {...S} />
      <circle cx="54" cy="58" r="26" fill="#F59A2E" {...S} />
      <path d="M54 58m-4 0a4 4 0 0 1 8 0 8 8 0 0 1-16 0 12 12 0 0 1 24 0 16 16 0 0 1-32 0" fill="none" stroke="#B86A12" strokeWidth="3" strokeLinecap="round" />
      {eye(98, 74, 2)}
    </g>
  );
}

function Tortoise() {
  const c = "#8BB85A";
  return (
    <g>
      <Limb d="M90 74c6-2 10-8 16-8" w={9} fill={c} />
      <circle cx="108" cy="64" r="8" fill={c} {...S} />
      {eye(110, 62, 1.8)}
      {[28, 44, 72, 86].map((x) => (
        <rect key={x} x={x} y="72" width="11" height="18" rx="5" fill={c} {...S} />
      ))}
      <path d="M16 70c-6 0-10 4-12 2" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <path d="M16 74C16 34 100 34 100 74Z" fill="#6E8F3A" {...S} />
      <path d="M44 46l14-6 14 6v14l-14 6-14-6ZM22 70l8-14 14 4M94 70l-8-14-14 4M58 66v8" fill="none" stroke="#4A6624" strokeWidth="3" strokeLinejoin="round" />
      <path d="M14 74h88" stroke={INK} strokeWidth="4" strokeLinecap="round" />
    </g>
  );
}

function Duck() {
  const c = "#F8D44C";
  return (
    <g>
      <path d="M6 90q20-8 40 0t40 0t34 0" fill="none" stroke="#3A8DE6" strokeWidth="4" strokeLinecap="round" />
      <path d="M40 64c0-14 20-22 40-18 12 2 22-6 30-14 2 14-2 30-14 38-12 8-36 10-46 6-6-2-10-6-10-12Z" fill={c} {...S} />
      <path d="M56 62c8 8 22 8 30 0" fill="none" stroke="#D9A91A" strokeWidth="3" strokeLinecap="round" />
      <Limb d="M44 58c-2-10-2-16 0-22" w={11} fill={c} />
      <circle cx="40" cy="30" r="14" fill={c} {...S} />
      <path d="M28 30c-8-2-16 0-20 4 6 4 14 4 20 2Z" fill="#F59A2E" {...S} />
      {eye(38, 26)}
    </g>
  );
}

export const ANIMALS = {
  elephant: { name: "Elephant", Art: Elephant },
  giraffe: { name: "Giraffe", Art: Giraffe },
  rabbit: { name: "Rabbit", Art: Rabbit },
  cat: { name: "Cat", Art: Cat },
  cow: { name: "Cow", Art: Cow },
  kangaroo: { name: "Kangaroo", Art: Kangaroo },
  crocodile: { name: "Crocodile", Art: Crocodile },
  camel: { name: "Camel", Art: Camel },
  owl: { name: "Owl", Art: Owl },
  snail: { name: "Snail", Art: Snail },
  tortoise: { name: "Tortoise", Art: Tortoise },
  duck: { name: "Duck", Art: Duck },
};

/** One animal. `shadow` paints it solid black: the game fades it into colour on the reveal. */
export function AnimalArt({ id, shadow = false, className = "h-full w-full" }) {
  const { Art } = ANIMALS[id];
  return (
    <svg viewBox="0 -6 120 104" className={`animal-art ${className}`} data-shadow={shadow} aria-hidden focusable={false} overflow="visible">
      <Art />
    </svg>
  );
}

/** Menu preview: a little lit screen with one shadow on it. */
export function ShadowPreview({ id }) {
  return (
    <span className="shadow-screen relative grid size-[60px] shrink-0 place-items-center overflow-hidden rounded-[12px] p-1.5" aria-hidden>
      <AnimalArt id={id} shadow />
    </span>
  );
}
