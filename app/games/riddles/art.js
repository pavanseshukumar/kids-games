// Original illustrations for Riddle Champion: everyday things drawn on a 100×100 grid,
// chunky ink outlines to match the rest of the toy room.
const INK = "#3D2A1E";
const S = { stroke: INK, strokeWidth: 3.5, strokeLinejoin: "round", strokeLinecap: "round" };
const shine = (d) => <path d={d} fill="none" stroke="#fff" strokeOpacity="0.6" strokeWidth="4" strokeLinecap="round" />;

/* ---------- Riddle answers ---------- */

function Clock() {
  return (
    <g>
      {/* bells and legs make it an alarm clock: a friendly, toy-like face */}
      <path d="M22 22a12 12 0 0 1 18-8M78 22a12 12 0 0 0-18-8" fill="#F8C630" {...S} />
      <path d="M30 82l-6 9M70 82l6 9" fill="none" {...S} />
      <circle cx="50" cy="54" r="34" fill="#E5483B" {...S} />
      <circle cx="50" cy="54" r="26" fill="#FFF6DC" {...S} strokeWidth="2.5" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
        const a = (i * Math.PI) / 6;
        const r1 = i % 3 ? 22 : 19;
        return (
          <path
            key={i}
            d={`M${50 + Math.sin(a) * r1} ${54 - Math.cos(a) * r1}L${50 + Math.sin(a) * 24} ${54 - Math.cos(a) * 24}`}
            stroke={INK}
            strokeWidth={i % 3 ? 1.6 : 2.8}
            strokeLinecap="round"
          />
        );
      })}
      {/* the "hands": these spin when the clock is the answer */}
      <g className="clock-hand clock-hand-hour">
        <path d="M50 54V40" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />
      </g>
      <g className="clock-hand clock-hand-minute">
        <path d="M50 54h15" stroke={INK} strokeWidth="3.2" strokeLinecap="round" />
      </g>
      <circle cx="50" cy="54" r="3.5" fill={INK} />
      {shine("M27 40a26 26 0 0 1 10-11")}
    </g>
  );
}

function Comb() {
  return (
    <g transform="rotate(-12 50 50)">
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={16 + i * 6} y="44" width="3.6" height="30" rx="1.8" fill="#3A8DE6" stroke={INK} strokeWidth="2" />
      ))}
      <rect x="12" y="30" width="76" height="16" rx="7" fill="#3A8DE6" {...S} />
      {shine("M19 36h40")}
    </g>
  );
}

function Bottle() {
  return (
    <g>
      <rect x="41" y="6" width="18" height="10" rx="3" fill="#E5483B" {...S} />
      <path d="M43 16h14v14c0 6 15 10 15 22v36a6 6 0 0 1-6 6H34a6 6 0 0 1-6-6V52c0-12 15-16 15-22Z" fill="#A6E8CA" {...S} />
      <path d="M30 62h40v18H30Z" fill="#FFF6DC" stroke={INK} strokeWidth="2.5" />
      <path d="M38 71h24" stroke="#3E9C74" strokeWidth="3" strokeLinecap="round" />
      {shine("M36 54v28")}
    </g>
  );
}

function Towel() {
  return (
    <g>
      <path d="M10 22h80" stroke="#8E949C" strokeWidth="6" strokeLinecap="round" />
      <path d="M22 18h56v70a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4Z" fill="#F2709C" {...S} />
      <path d="M22 72h56M22 80h56" stroke="#fff" strokeWidth="3.5" />
      <path d="M22 18h56v10H22Z" fill="#E85A88" {...S} strokeWidth="3" />
      <path d="M8 22h84" stroke={INK} strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      {/* wet drips */}
      <path d="M36 92c0 4-3 6-3 8a3 3 0 0 0 6 0c0-2-3-4-3-8Z" fill="#73AEEF" stroke={INK} strokeWidth="1.8" />
      <path d="M62 92c0 3-2.5 5-2.5 6.5a2.5 2.5 0 0 0 5 0c0-1.5-2.5-3.5-2.5-6.5Z" fill="#73AEEF" stroke={INK} strokeWidth="1.8" />
      {shine("M30 36v26")}
    </g>
  );
}

function Piano() {
  return (
    <g>
      <rect x="8" y="22" width="84" height="58" rx="8" fill="#4E2E1A" {...S} />
      <path d="M16 30h68" stroke="#9A6440" strokeWidth="4" strokeLinecap="round" />
      <rect x="14" y="40" width="72" height="34" rx="3" fill="#FFF6DC" stroke={INK} strokeWidth="2.5" />
      {Array.from({ length: 7 }, (_, i) => (
        <path key={i} d={`M${14 + (i + 1) * (72 / 8)} 40v34`} stroke={INK} strokeWidth="1.8" />
      ))}
      {[1, 2, 4, 5, 6].map((i) => (
        <rect key={i} x={14 + i * 9 - 3} y="40" width="6" height="20" rx="1.5" fill={INK} />
      ))}
      <path d="M18 80v10M82 80v10" stroke={INK} strokeWidth="5" strokeLinecap="round" />
    </g>
  );
}

function Needle() {
  return (
    <g>
      {/* a curl of red thread through the eye */}
      <path d="M58 14c14-10 30 4 18 16-8 8-24 4-28 18-3 12 8 22 4 34" fill="none" stroke="#E5483B" strokeWidth="3.5" strokeLinecap="round" />
      <g transform="rotate(30 50 50)">
        <path d="M46 8h8a4 4 0 0 1 4 4l-4 76-4 8-4-8-4-76a4 4 0 0 1 4-4Z" fill="#D5DADF" {...S} />
        <ellipse cx="50" cy="18" rx="2.4" ry="6" fill="#FFF6DC" stroke={INK} strokeWidth="2.5" />
        {shine("M48 30v40")}
      </g>
      <path d="M58 14c-4 3-6 6-6 6" fill="none" stroke="#E5483B" strokeWidth="3.5" strokeLinecap="round" />
    </g>
  );
}

/* ---------- Tempting wrong answers ---------- */

function Glove() {
  return (
    <g>
      <path
        d="M30 88V50l-10-14a6 6 0 0 1 10-6l6 8V18a6 6 0 0 1 12 0v-4a6 6 0 0 1 12 0v4a6 6 0 0 1 12 2v8a6 6 0 0 1 10 2v30c0 14-6 22-14 28Z"
        fill="#F59A2E"
        {...S}
      />
      <path d="M48 18v26M60 14v30M72 20v24" stroke={INK} strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
      <rect x="28" y="80" width="48" height="12" rx="4" fill="#FFF6DC" {...S} />
      {shine("M38 26v18")}
    </g>
  );
}

function Spoon() {
  return (
    <g transform="rotate(-35 50 50)">
      <path d="M47 46h6l2 46a5 5 0 0 1-10 0Z" fill="#D5DADF" {...S} />
      <ellipse cx="50" cy="26" rx="15" ry="20" fill="#D5DADF" {...S} />
      <ellipse cx="50" cy="26" rx="9" ry="13" fill="#B9BEC4" />
      {shine("M44 16q-3 8 0 16")}
    </g>
  );
}

function Cup() {
  return (
    <g>
      <path d="M70 40c14 0 14 26 0 26" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <path d="M70 40c14 0 14 26 0 26" fill="none" stroke="#3FB35F" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M20 30h54l-6 52a8 8 0 0 1-8 7H34a8 8 0 0 1-8-7Z" fill="#3FB35F" {...S} />
      <ellipse cx="47" cy="30" rx="27" ry="6" fill="#9A6440" {...S} />
      <path d="M40 18c-4-5 4-8 0-13M54 18c-4-5 4-8 0-13" fill="none" stroke="#fff" strokeOpacity="0.8" strokeWidth="3" strokeLinecap="round" />
      {shine("M32 44l3 30")}
    </g>
  );
}

function Ball() {
  return (
    <g>
      <circle cx="50" cy="52" r="38" fill="#F8C630" {...S} />
      <path d="M14 46c20 8 52 8 72 0" fill="none" stroke="#E5483B" strokeWidth="8" />
      <path d="M50 14c-12 20-12 56 0 76" fill="none" stroke="#3A8DE6" strokeWidth="8" />
      <circle cx="50" cy="52" r="38" fill="none" {...S} />
      {shine("M28 32a30 30 0 0 1 12-10")}
    </g>
  );
}

function Book() {
  return (
    <g>
      <path d="M50 26c-10-8-26-10-40-8v62c14-2 30 0 40 8 10-8 26-10 40-8V18c-14-2-30 0-40 8Z" fill="#FFF6DC" {...S} />
      <path d="M50 26v62" stroke={INK} strokeWidth="3" />
      {[36, 46, 56, 66].map((y) => (
        <g key={y} stroke="#B8955A" strokeWidth="2.5" strokeLinecap="round">
          <path d={`M18 ${y - 4}q12-2 24 4`} />
          <path d={`M58 ${y + 0}q12-6 24-4`} />
        </g>
      ))}
      <path d="M10 80c14-2 30 0 40 8 10-8 26-10 40-8v6c-14-2-30 0-40 8-10-8-26-10-40-8Z" fill="#3A8DE6" {...S} />
    </g>
  );
}

function Hat() {
  return (
    <g>
      <ellipse cx="50" cy="74" rx="42" ry="12" fill="#9B6BE0" {...S} />
      <path d="M26 72V40c0-14 48-14 48 0v32c0 6-48 6-48 0Z" fill="#9B6BE0" {...S} />
      <path d="M26 58c0 6 48 6 48 0v8c0 6-48 6-48 0Z" fill="#F8C630" {...S} strokeWidth="2.5" />
      {shine("M34 40v12")}
    </g>
  );
}

export const THINGS = {
  clock: { name: "clock", Art: Clock },
  comb: { name: "comb", Art: Comb },
  bottle: { name: "bottle", Art: Bottle },
  towel: { name: "towel", Art: Towel },
  piano: { name: "piano", Art: Piano },
  needle: { name: "needle", Art: Needle },
  glove: { name: "glove", Art: Glove },
  spoon: { name: "spoon", Art: Spoon },
  cup: { name: "cup", Art: Cup },
  ball: { name: "ball", Art: Ball },
  book: { name: "book", Art: Book },
  hat: { name: "hat", Art: Hat },
};

/** One thing, drawn to fill its box. */
export function ThingArt({ id, className = "h-full w-full" }) {
  const { Art } = THINGS[id];
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden focusable={false} overflow="visible">
      <Art />
    </svg>
  );
}

/** A gold trophy for the champion. */
export function Trophy({ className = "w-full" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden focusable={false}>
      <defs>
        <linearGradient id="rd-gold" x1="0" x2="1">
          <stop offset="0" stopColor="#FFF0A8" />
          <stop offset="0.45" stopColor="#F7C948" />
          <stop offset="1" stopColor="#C98A14" />
        </linearGradient>
      </defs>
      <path d="M28 22H14c0 18 8 26 18 26M72 22h14c0 18-8 26-18 26" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <path d="M28 22H14c0 18 8 26 18 26M72 22h14c0 18-8 26-18 26" fill="none" stroke="#F7C948" strokeWidth="4" strokeLinecap="round" />
      <path d="M26 12h48v18c0 18-10 30-24 30S26 48 26 30Z" fill="url(#rd-gold)" {...S} />
      <path d="M44 60h12v12H44Z" fill="#E3B35C" {...S} />
      <rect x="30" y="72" width="40" height="18" rx="4" fill="#9A6440" {...S} />
      <rect x="38" y="77" width="24" height="8" rx="2" fill="#F7C948" stroke={INK} strokeWidth="2" />
      <text
        x="50"
        y="44"
        textAnchor="middle"
        fontSize="26"
        fontWeight="700"
        fill="#fff6dc"
        stroke={INK}
        strokeWidth="2"
        paintOrder="stroke"
        style={{ fontFamily: "var(--font-fredoka), ui-rounded, system-ui, sans-serif" }}
      >
        ?
      </text>
      {shine("M33 18v12")}
    </svg>
  );
}

/** Menu preview: a mini felt mat with one little card per choice. */
export function ChoicesPreview({ n }) {
  const angles = { 2: [-8, 8], 3: [-12, 0, 12], 4: [-18, -6, 6, 18] }[n];
  return (
    <span className="relative grid size-[60px] shrink-0 place-items-center rounded-[12px] drop-shadow-[0_2px_2px_rgba(40,18,0,0.35)]" aria-hidden>
      <svg viewBox="0 0 64 64" className="absolute inset-0 h-full w-full">
        <defs>
          <radialGradient id={`rp-felt-${n}`} cx="50%" cy="35%" r="75%">
            <stop offset="0" stopColor="#35915A" />
            <stop offset="1" stopColor="#1D5E38" />
          </radialGradient>
        </defs>
        <rect width="64" height="64" rx="12" fill={`url(#rp-felt-${n})`} />
        <rect x="4" y="4" width="56" height="56" rx="9" fill="none" stroke="#FFF6D2" strokeOpacity="0.5" strokeWidth="1.2" strokeDasharray="2.5 2" />
        {angles.map((a, i) => (
          <g key={i} transform={`rotate(${a} 32 78)`}>
            <rect x="24" y="14" width="16" height="22" rx="3" fill="#FFFAF0" stroke={INK} strokeWidth="1.5" />
            <text x="32" y="30" textAnchor="middle" fontSize="13" fontWeight="700" fill={i === angles.length - 1 ? "#E5483B" : "#7A5A3F"} style={{ fontFamily: "var(--font-fredoka), ui-rounded, system-ui, sans-serif" }}>
              ?
            </text>
          </g>
        ))}
      </svg>
    </span>
  );
}
