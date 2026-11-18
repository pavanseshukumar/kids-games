// Original illustrations for the Counting game: wooden number blocks.
const INK = "#3D2A1E";

/** Toy-block paints: [face, frame, top, side]. */
export const BLOCK_PAINTS = {
  red: ["#FFF6DC", "#E5483B", "#F07A6F", "#A42C22"],
  blue: ["#FFF6DC", "#3A8DE6", "#73AEEF", "#2261A8"],
  green: ["#FFF6DC", "#3FB35F", "#73CB8B", "#23803F"],
  yellow: ["#FFF6DC", "#F2B21C", "#F8CF63", "#B8870A"],
};

/**
 * A wooden alphabet-style block seen slightly from above: coloured frame,
 * cream face, big numeral. Drawn in SVG so it scales crisply.
 */
export function NumberBlock({ value, paint = "red", className = "w-full" }) {
  const [face, frame, top, side] = BLOCK_PAINTS[paint];
  const small = String(value).length > 1;
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden focusable={false}>
      {/* top and side faces give the cube its depth */}
      <polygon points="8,24 24,10 92,10 76,24" fill={top} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <polygon points="76,24 92,10 92,78 76,94" fill={side} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      {/* front face */}
      <rect x="8" y="24" width="68" height="70" rx="5" fill={frame} stroke={INK} strokeWidth="2.5" />
      <rect x="15" y="31" width="54" height="56" rx="4" fill={face} />
      <rect x="15" y="31" width="54" height="56" rx="4" fill="none" stroke="#000" strokeOpacity="0.12" strokeWidth="2" />
      <text
        x="42"
        y={small ? 72 : 76}
        textAnchor="middle"
        fontSize={small ? 36 : 50}
        fontWeight="700"
        fill={frame}
        stroke={INK}
        strokeWidth="2"
        paintOrder="stroke"
        style={{ fontFamily: "var(--font-fredoka), ui-rounded, system-ui, sans-serif" }}
      >
        {value}
      </text>
      {/* worn highlight on the top edge */}
      <path d="M14 26h58" stroke="#fff" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Menu preview: a mini felt mat with a little tower of blocks topped by the level's highest number. */
export function BlockPreview({ max }) {
  return (
    <span className="relative grid size-[60px] shrink-0 place-items-center rounded-[12px] drop-shadow-[0_2px_2px_rgba(40,18,0,0.35)]" aria-hidden>
      <svg viewBox="0 0 64 64" className="absolute inset-0 h-full w-full">
        <defs>
          <radialGradient id="bp-felt" cx="50%" cy="35%" r="75%">
            <stop offset="0" stopColor="#35915A" />
            <stop offset="1" stopColor="#1D5E38" />
          </radialGradient>
        </defs>
        <rect width="64" height="64" rx="12" fill="url(#bp-felt)" />
        <rect x="4" y="4" width="56" height="56" rx="9" fill="none" stroke="#FFF6D2" strokeOpacity="0.5" strokeWidth="1.2" strokeDasharray="2.5 2" />
      </svg>
      <span className="relative w-[64%]">
        <NumberBlock value={max} paint={max <= 5 ? "red" : max <= 10 ? "blue" : "green"} />
      </span>
    </span>
  );
}
