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


function Horse() {
  const c = "#A0622D";
  const mane = "#4E2E1A";
  return (
    <g>
      <Limb d="M26 42c-8 6-10 18-8 32" w={6} fill={mane} />
      {[30, 38, 64, 72].map((x) => (
        <rect key={x} x={x} y="50" width="8" height="42" rx="3" fill={x === 38 || x === 72 ? "#8A5226" : c} {...S} />
      ))}
      <ellipse cx="52" cy="46" rx="29" ry="14" fill={c} {...S} />
      <path d="M66 42L82 14h10L82 52Z" fill={c} {...S} />
      <path d="M84 8l2-8 5 9Z" fill={c} {...S} strokeWidth="2.5" />
      <ellipse cx="96" cy="24" rx="14" ry="7.5" transform="rotate(38 96 24)" fill={c} {...S} />
      <path d="M80 12C74 22 70 32 66 40" fill="none" stroke={mane} strokeWidth="5" strokeLinecap="round" />
      {eye(92, 19)}
      <circle cx="103" cy="32" r="1.6" fill={INK} />
    </g>
  );
}

function Lion() {
  const c = "#E8B04A";
  const mane = "#B86A12";
  const rays = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2;
    const r = i % 2 ? 17 : 23;
    return `${84 + Math.cos(a) * r},${38 + Math.sin(a) * r}`;
  }).join(" ");
  return (
    <g>
      <Limb d="M24 46c-10 4-14 14-12 22" w={4} fill={c} />
      <circle cx="12" cy="70" r="5" fill={mane} {...S} strokeWidth="2.5" />
      {[30, 40, 62, 72].map((x) => (
        <rect key={x} x={x} y="56" width="10" height="36" rx="4" fill={x === 40 || x === 72 ? "#D49A36" : c} {...S} />
      ))}
      <ellipse cx="52" cy="52" rx="30" ry="15" fill={c} {...S} />
      <polygon points={rays} fill={mane} {...S} />
      <circle cx="86" cy="40" r="12" fill={c} {...S} />
      <circle cx="78" cy="29" r="3.5" fill={c} {...S} strokeWidth="2" />
      <circle cx="93" cy="29" r="3.5" fill={c} {...S} strokeWidth="2" />
      {eye(82, 37)}
      {eye(91, 37)}
      <path d="M84 44l2 2 2-2M86 46v3" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" />
    </g>
  );
}

function Bear() {
  const c = "#7A4A22";
  return (
    <g>
      {[26, 40, 64, 78].map((x) => (
        <rect key={x} x={x} y="58" width="14" height="34" rx="6" fill={x === 40 || x === 78 ? "#67401D" : c} {...S} />
      ))}
      <path d="M22 62C16 40 30 26 52 28s38 4 42 18c2 12-4 20-14 22H30c-4 0-7-2-8-6Z" fill={c} {...S} />
      <circle cx="84" cy="34" r="5" fill={c} {...S} />
      <circle cx="92" cy="44" r="14" fill={c} {...S} />
      <ellipse cx="104" cy="49" rx="8" ry="6" fill="#B9844F" {...S} />
      <circle cx="110" cy="47" r="2.4" fill={INK} />
      {eye(92, 40)}
    </g>
  );
}

function Pig() {
  const c = "#F7A8C4";
  return (
    <g>
      <path d="M26 50c-8 0-10-8-4-10s6 6 0 8" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      {[34, 46, 70, 82].map((x) => (
        <rect key={x} x={x} y="66" width="10" height="26" rx="4" fill={x === 46 || x === 82 ? "#E58FAF" : c} {...S} />
      ))}
      <ellipse cx="58" cy="56" rx="34" ry="22" fill={c} {...S} />
      <circle cx="92" cy="50" r="15" fill={c} {...S} />
      <path d="M84 38l2-12 10 8Z" fill={c} {...S} strokeWidth="2.5" />
      <ellipse cx="107" cy="53" rx="6" ry="8" fill="#E58FAF" {...S} />
      <circle cx="106" cy="50" r="1.4" fill={INK} />
      <circle cx="106" cy="56" r="1.4" fill={INK} />
      {eye(94, 44)}
    </g>
  );
}

function Sheep() {
  const wool = "#FFFDF6";
  const bumps = [
    [30, 44], [40, 34], [54, 30], [68, 32], [80, 40], [84, 54], [76, 66], [62, 70], [46, 70], [32, 64], [26, 54],
  ];
  return (
    <g>
      {[38, 48, 66, 76].map((x) => (
        <rect key={x} x={x} y="60" width="7" height="32" rx="3" fill="#3D2A1E" {...S} />
      ))}
      {bumps.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="10" fill={wool} {...S} />
      ))}
      <ellipse cx="56" cy="50" rx="28" ry="18" fill={wool} />
      <path d="M84 42l-6-6 2 10Z" fill="#4E3A2E" {...S} strokeWidth="2.5" />
      <ellipse cx="92" cy="50" rx="10" ry="13" transform="rotate(-20 92 50)" fill="#4E3A2E" {...S} />
      <circle cx="94" cy="46" r="2" fill="#FFF6DC" />
      <circle cx="84" cy="38" r="6" fill={wool} {...S} strokeWidth="2.5" />
    </g>
  );
}

function Penguin() {
  const c = "#2E3440";
  return (
    <g>
      <ellipse cx="50" cy="90" rx="9" ry="4" fill="#F59A2E" {...S} />
      <ellipse cx="68" cy="90" rx="9" ry="4" fill="#F59A2E" {...S} />
      <path d="M60 10c14 0 22 14 22 34 0 26-8 44-22 44S38 70 38 44c0-20 8-34 22-34Z" fill={c} {...S} />
      <path d="M62 30c10 2 14 16 14 30 0 18-6 26-14 26s-12-10-12-26c0-14 4-28 12-30Z" fill="#FFFDF6" />
      <path d="M78 24l14 5-14 4Z" fill="#F59A2E" {...S} strokeWidth="2.5" />
      <path d="M44 42c-8 10-10 22-6 32" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <path d="M44 42c-8 10-10 22-6 32" fill="none" stroke="#3B4252" strokeWidth="4" strokeLinecap="round" />
      <circle cx="70" cy="22" r="3.4" fill="#fff" />
      {eye(71, 22, 1.8)}
    </g>
  );
}

function Fox() {
  const c = "#E86A2C";
  return (
    <g>
      <path d="M34 48C12 38 2 58 8 70c6 10 20 6 26-10Z" fill={c} {...S} />
      <path d="M8 70c-2-6 0-10 4-12 2 6 0 10-4 12Z" fill="#FFFDF6" />
      {[38, 46, 64, 72].map((x) => (
        <rect key={x} x={x} y="54" width="6" height="38" rx="3" fill={INK} {...S} strokeWidth="2" />
      ))}
      <ellipse cx="55" cy="50" rx="24" ry="11" fill={c} {...S} />
      <path d="M72 46l4-16 2-12 8 10 8-10 0 14 16 12-14 6Z" fill={c} {...S} />
      <path d="M96 48l14-4-6 6Z" fill="#FFFDF6" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <circle cx="110" cy="44" r="2" fill={INK} />
      {eye(92, 34)}
    </g>
  );
}

function Deer() {
  const c = "#B9783F";
  return (
    <g>
      <path d="M28 40l-6-6 2 8Z" fill="#FFFDF6" {...S} strokeWidth="2.5" />
      {[32, 39, 62, 69].map((x) => (
        <rect key={x} x={x} y="52" width="5" height="40" rx="2.5" fill={x === 39 || x === 69 ? "#A66A34" : c} {...S} strokeWidth="2.5" />
      ))}
      <ellipse cx="50" cy="46" rx="24" ry="12" fill={c} {...S} />
      <path d="M64 42L80 22h8L76 50Z" fill={c} {...S} />
      <g fill="none" stroke="#6E4322" strokeWidth="3.5" strokeLinecap="round">
        <path d="M82 18L74 2M78 10l-8 0M76 6l-2-6" />
        <path d="M88 18L96 2M92 10l8 0M94 6l2-6" />
      </g>
      <ellipse cx="92" cy="26" rx="11" ry="6" transform="rotate(25 92 26)" fill={c} {...S} />
      <path d="M80 20l-6-2 4 6Z" fill={c} {...S} strokeWidth="2.5" />
      {eye(90, 23, 2)}
      {[
        [42, 42],
        [52, 40],
        [60, 46],
        [46, 50],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2" fill="#FFF6DC" />
      ))}
    </g>
  );
}

function Rhino() {
  const c = "#8E949C";
  return (
    <g>
      <path d="M22 48q-6 6-4 14" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      {[26, 40, 62, 76].map((x) => (
        <rect key={x} x={x} y="60" width="13" height="32" rx="5" fill={x === 40 || x === 76 ? "#7B828B" : c} {...S} />
      ))}
      <ellipse cx="52" cy="52" rx="32" ry="20" fill={c} {...S} />
      <path d="M76 40c8-4 20 2 28 10l6 8c2 4 0 8-4 8H84c-6 0-10-6-10-12Z" fill={c} {...S} />
      <path d="M100 50c2-8 4-16 2-24 6 8 8 18 6 28Z" fill="#E3DACB" {...S} strokeWidth="2.5" />
      <path d="M90 44c0-4 2-8 2-12 4 4 4 8 4 12Z" fill="#E3DACB" {...S} strokeWidth="2.5" />
      <path d="M78 38l-2-10 8 8Z" fill={c} {...S} strokeWidth="2.5" />
      {eye(86, 50, 2)}
    </g>
  );
}

function Squirrel() {
  const c = "#B5652A";
  return (
    <g>
      <path d="M46 86C14 84 6 46 20 22 30 6 52 10 48 28c-2 10-12 14-14 26-2 12 6 22 12 32Z" fill={c} {...S} />
      <path d="M26 30c6-10 14-12 16-6" fill="none" stroke="#D98A4A" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="62" cy="70" rx="16" ry="20" fill={c} {...S} />
      <ellipse cx="66" cy="74" rx="8" ry="13" fill="#E8C9A0" />
      <ellipse cx="62" cy="90" rx="12" ry="4" fill={c} {...S} />
      <path d="M66 36l0-12 8 8Z" fill={c} {...S} strokeWidth="2.5" />
      <circle cx="72" cy="44" r="12" fill={c} {...S} />
      <ellipse cx="80" cy="64" rx="5.5" ry="6.5" fill="#9A6440" {...S} strokeWidth="2.5" />
      <path d="M75 58h10" stroke="#5E3A1C" strokeWidth="4" strokeLinecap="round" />
      {eye(76, 41)}
      <circle cx="84" cy="46" r="1.8" fill={INK} />
    </g>
  );
}

function Frog() {
  const c = "#5FBF4A";
  return (
    <g>
      <ellipse cx="34" cy="80" rx="18" ry="10" fill="#4AA838" {...S} />
      <ellipse cx="86" cy="80" rx="18" ry="10" fill="#4AA838" {...S} />
      <ellipse cx="60" cy="66" rx="32" ry="20" fill={c} {...S} />
      <circle cx="46" cy="46" r="10" fill={c} {...S} />
      <circle cx="74" cy="46" r="10" fill={c} {...S} />
      <circle cx="46" cy="45" r="5.5" fill="#FFF6DC" />
      <circle cx="74" cy="45" r="5.5" fill="#FFF6DC" />
      {eye(47, 45, 3)}
      {eye(75, 45, 3)}
      <path d="M44 66q16 10 32 0" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <path d="M48 86h-8l-4 4M72 86h8l4 4" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <circle cx="56" cy="76" r="3" fill="#4AA838" />
      <circle cx="68" cy="78" r="2.4" fill="#4AA838" />
    </g>
  );
}

function Hen() {
  const c = "#C9733A";
  return (
    <g>
      <path d="M54 76v14M66 76v14M48 92h10M60 92h10" fill="none" stroke="#F59A2E" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M24 26c10 10 4 30 22 46 16 14 42 8 46-12 2-12-6-18-14-16l-8 4C56 46 40 34 24 26Z" fill={c} {...S} />
      <path d="M24 26c-2 8 2 14 8 18M24 26c6 2 10 8 10 14" fill="none" stroke="#8E4A1E" strokeWidth="3" strokeLinecap="round" />
      <path d="M50 54c8 10 22 10 28 0" fill="none" stroke="#8E4A1E" strokeWidth="3" strokeLinecap="round" />
      <path d="M78 22c0-6 4-8 6-4 2-6 6-6 7 0 3-4 7-2 6 4Z" fill="#E5483B" {...S} strokeWidth="2.5" />
      <circle cx="84" cy="32" r="10" fill={c} {...S} />
      <path d="M93 30l9 3-9 4Z" fill="#F8C630" {...S} strokeWidth="2.5" />
      <path d="M90 40c2 4 0 8-3 7-2-1-1-5 1-8Z" fill="#E5483B" {...S} strokeWidth="2" />
      {eye(86, 29)}
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
  horse: { name: "Horse", Art: Horse },
  lion: { name: "Lion", Art: Lion },
  bear: { name: "Bear", Art: Bear },
  pig: { name: "Pig", Art: Pig },
  sheep: { name: "Sheep", Art: Sheep },
  penguin: { name: "Penguin", Art: Penguin },
  fox: { name: "Fox", Art: Fox },
  deer: { name: "Deer", Art: Deer },
  rhino: { name: "Rhino", Art: Rhino },
  squirrel: { name: "Squirrel", Art: Squirrel },
  frog: { name: "Frog", Art: Frog },
  hen: { name: "Hen", Art: Hen },
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
