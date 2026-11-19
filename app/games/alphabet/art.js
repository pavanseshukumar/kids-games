// Original illustrations for Alphabet Speed Challenge: one badge per category,
// drawn on a 100×100 grid with the toy room's chunky ink outlines.
const INK = "#3D2A1E";
const S = { stroke: INK, strokeWidth: 4, strokeLinejoin: "round", strokeLinecap: "round" };
const shine = (d) => <path d={d} fill="none" stroke="#fff" strokeOpacity="0.6" strokeWidth="4" strokeLinecap="round" />;

function Paw() {
  return (
    <g>
      <path d="M50 52c-14 0-26 14-26 26 0 10 10 12 18 9 5-2 11-2 16 0 8 3 18 1 18-9 0-12-12-26-26-26Z" fill="#9A6440" {...S} />
      {[
        [22, 40, 9, 11, -20],
        [38, 24, 9, 12, -6],
        [62, 24, 9, 12, 6],
        [78, 40, 9, 11, 20],
      ].map(([x, y, rx, ry, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} transform={`rotate(${r} ${x} ${y})`} fill="#9A6440" {...S} />
      ))}
      {shine("M38 64q6-6 12-6")}
    </g>
  );
}

function Fruit() {
  return (
    <g>
      <path d="M50 26c-4-8-2-16 4-20" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <path d="M54 22c6-12 20-12 26-6-6 8-18 12-26 6Z" fill="#3FB35F" {...S} strokeWidth="3" />
      <path d="M50 30c-10-8-36-8-38 20-2 24 16 42 28 42 5 0 7-3 10-3s5 3 10 3c12 0 30-18 28-42-2-28-28-28-38-20Z" fill="#E5483B" {...S} />
      {shine("M24 46q2-10 10-12")}
    </g>
  );
}

function Place() {
  return (
    <g>
      {/* a little map with a pin on it */}
      <path d="M10 30l24-8 32 8 24-8v54l-24 8-32-8-24 8Z" fill="#A6E8CA" {...S} />
      <path d="M34 22v54M66 30v54" stroke={INK} strokeWidth="2.5" opacity="0.4" />
      <path d="M16 62c10-6 20 4 30-2s20-8 38 0" fill="none" stroke="#3A8DE6" strokeWidth="4" strokeLinecap="round" />
      <path d="M50 64C38 50 34 42 34 34a16 16 0 0 1 32 0c0 8-4 16-16 30Z" fill="#E5483B" {...S} />
      <circle cx="50" cy="34" r="6" fill="#FFF6DC" stroke={INK} strokeWidth="3" />
    </g>
  );
}

function Thing() {
  return (
    <g>
      {/* a wooden toy block and a pencil: everyday "things" */}
      <g transform="rotate(-8 34 64)">
        <rect x="12" y="42" width="44" height="44" rx="6" fill="#F8C630" {...S} />
        <text
          x="34"
          y="75"
          textAnchor="middle"
          fontSize="28"
          fontWeight="700"
          fill="#E5483B"
          style={{ fontFamily: "var(--font-fredoka), ui-rounded, system-ui, sans-serif" }}
        >
          a
        </text>
      </g>
      <g transform="rotate(35 70 46)">
        <path d="M62 8h16v62l-8 14-8-14Z" fill="#3A8DE6" {...S} />
        <path d="M62 70h16l-8 14Z" fill="#F3C98A" {...S} strokeWidth="3" />
        <path d="M67 79h6l-3 5Z" fill={INK} />
        <path d="M62 8h16v8H62Z" fill="#F2709C" {...S} strokeWidth="3" />
      </g>
    </g>
  );
}

export const CATEGORIES = [
  { id: "animal", name: "Animal", Art: Paw, paint: "#F59A2E" },
  { id: "fruit", name: "Fruit", Art: Fruit, paint: "#E5483B" },
  { id: "place", name: "Place", Art: Place, paint: "#3A8DE6" },
  { id: "object", name: "Object", Art: Thing, paint: "#3FB35F" },
];

export function CategoryArt({ id, className = "h-full w-full" }) {
  const { Art } = CATEGORIES.find((c) => c.id === id);
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden focusable={false} overflow="visible">
      <Art />
    </svg>
  );
}

/** Menu preview: a mini felt mat holding a letter tile per round. */
export function LettersPreview({ letters }) {
  return (
    <span className="relative grid size-[60px] shrink-0 place-items-center rounded-[12px] drop-shadow-[0_2px_2px_rgba(40,18,0,0.35)]" aria-hidden>
      <svg viewBox="0 0 64 64" className="absolute inset-0 h-full w-full">
        <defs>
          <radialGradient id="ap-felt" cx="50%" cy="35%" r="75%">
            <stop offset="0" stopColor="#35915A" />
            <stop offset="1" stopColor="#1D5E38" />
          </radialGradient>
        </defs>
        <rect width="64" height="64" rx="12" fill="url(#ap-felt)" />
        <rect x="4" y="4" width="56" height="56" rx="9" fill="none" stroke="#FFF6D2" strokeOpacity="0.5" strokeWidth="1.2" strokeDasharray="2.5 2" />
        {letters.map((l, i) => {
          const n = letters.length;
          const size = n === 1 ? 28 : n === 3 ? 18 : 14;
          const x = 32 + (i - (n - 1) / 2) * (size - 3);
          const y = 32 + (i % 2 ? 5 : -3) * (n > 1 ? 1 : 0);
          return (
            <g key={i} transform={`rotate(${(i - (n - 1) / 2) * 8} ${x} ${y})`}>
              <rect x={x - size / 2} y={y - size / 2} width={size} height={size} rx="3" fill="#FFFAF0" stroke={INK} strokeWidth="1.5" />
              <text
                x={x}
                y={y + size * 0.3}
                textAnchor="middle"
                fontSize={size * 0.8}
                fontWeight="700"
                fill={["#E5483B", "#3A8DE6", "#3FB35F", "#F59A2E", "#9B6BE0"][i]}
                style={{ fontFamily: "var(--font-fredoka), ui-rounded, system-ui, sans-serif" }}
              >
                {l}
              </text>
            </g>
          );
        })}
      </svg>
    </span>
  );
}
