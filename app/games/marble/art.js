// Original illustrations for Marble Run (SVG units: one pegboard square = 100).
const INK = "#3D2A1E";

export const TILT = 20; // degrees a ramp leans
export const MARBLE_R = 14;

/** Ramp paints for flippable ramps. */
const PAINTS = [
  ["#E5483B", "#A42C22"],
  ["#3A8DE6", "#2261A8"],
  ["#F8C630", "#B8870A"],
  ["#3FB35F", "#23803F"],
];

/**
 * A wooden ramp on a peg. `dir` = 1 slopes down to the right, -1 down to the left.
 * Locked ramps are bare wood with nails; the others are painted and can flip.
 */
export function Ramp({ dir, locked, paint = 0 }) {
  const [face, edge] = locked ? ["#9C6A3C", "#5E3B1F"] : PAINTS[paint % PAINTS.length];
  return (
    <g>
      <g className="ramp-tilt" style={{ rotate: `${dir * TILT}deg` }}>
        <rect x="-46" y="-8" width="92" height="20" rx="9" fill="#0F0A05" opacity="0.25" transform="translate(2 5)" />
        <rect x="-46" y="-10" width="92" height="20" rx="9" fill={face} stroke={edge} strokeWidth="3" />
        <path d="M-37-4h74" stroke="#fff" strokeOpacity="0.4" strokeWidth="3.5" strokeLinecap="round" />
        {locked && (
          <g fill="#C9CDD2" stroke="#5E5A52" strokeWidth="1.5">
            <circle cx="-30" cy="0" r="3.5" />
            <circle cx="30" cy="0" r="3.5" />
          </g>
        )}
      </g>
      {/* pivot peg */}
      <circle r={locked ? 5 : 7} fill={locked ? "#6E4322" : "#E9C46A"} stroke={INK} strokeWidth="2.5" />
      {!locked && <circle r="2.5" cx="-1.5" cy="-1.5" fill="#fff" opacity="0.7" />}
    </g>
  );
}

/** A glass marble with a coloured swirl. */
export function Marble() {
  return (
    <g>
      <defs>
        <radialGradient id="marble-glass" cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.35" stopColor="#BFE6FF" />
          <stop offset="1" stopColor="#3A8DE6" />
        </radialGradient>
      </defs>
      <circle r={MARBLE_R} fill="url(#marble-glass)" stroke="#1F5A9E" strokeWidth="2" />
      <path d="M-9 4C-4-6 5-6 9 3" fill="none" stroke="#E5483B" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M-6 8C0 2 6 4 8 8" fill="none" stroke="#F8C630" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="-5" cy="-6" r="3.5" fill="#fff" opacity="0.85" />
    </g>
  );
}

/** Funnel at the top that the marble drops from. */
export function Chute() {
  return (
    <g>
      <path d="M-34-30H34L16 6H-16Z" fill="#C98A4A" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M-26-24H26" stroke="#F0C48E" strokeWidth="3" strokeLinecap="round" />
      <rect x="-16" y="4" width="32" height="10" rx="3" fill="#8A5A32" stroke={INK} strokeWidth="3" />
    </g>
  );
}

/** Where a marble rests inside the cup, relative to the cup's origin (just peeking over the rim). */
export const CUP_REST_Y = 2;

/** Back half of the tin cup: shadow and the dark inside. Draw this BEHIND the marble. */
export function CupBack() {
  return (
    <g>
      <ellipse cx="0" cy="44" rx="40" ry="8" fill="#0F0A05" opacity="0.3" />
      <ellipse cx="0" cy="-6" rx="36" ry="9" fill="#5E150F" />
      <path d="M-36-6A36 9 0 0 1 36-6" fill="none" stroke={INK} strokeWidth="3" />
    </g>
  );
}

/** Front half of the tin cup: the wall and front lip. Draw this IN FRONT of the marble. */
export function CupFront() {
  return (
    <g>
      <path d="M-36-6A36 9 0 0 0 36-6L28 42H-28Z" fill="#E5483B" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M-26 6-20 36" stroke="#fff" strokeOpacity="0.35" strokeWidth="5" strokeLinecap="round" />
      <path d="M-36-6A36 9 0 0 0 36-6" fill="none" stroke="#F07A6F" strokeWidth="2" transform="translate(0 2)" />
      <polygon
        points="0,10 4.4,19 14.3,20.4 7.1,27.2 8.8,37 0,32.3 -8.8,37 -7.1,27.2 -14.3,20.4 -4.4,19"
        fill="#F8C630"
        stroke="#A86F0C"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </g>
  );
}

/** The whole cup in one piece (menus and covers). */
export function Cup({ full }) {
  return (
    <g className="marble-cup" data-full={full}>
      <CupBack />
      <CupFront />
    </g>
  );
}

/** Menu preview: a tiny pegboard with two ramps and a cup. */
export function BoardPreview({ ramps }) {
  return (
    <span className="relative block size-[60px] shrink-0 drop-shadow-[0_2px_2px_rgba(40,18,0,0.35)]" aria-hidden>
      <svg viewBox="0 0 300 300" className="h-full w-full">
        <rect width="300" height="300" rx="40" fill="#E2B784" stroke="#9C6A3C" strokeWidth="8" />
        {Array.from({ length: 25 }, (_, i) => (
          <circle key={i} cx={30 + (i % 5) * 60} cy={30 + Math.floor(i / 5) * 60} r="6" fill="#8A5A32" opacity="0.5" />
        ))}
        {ramps.map(([x, y, d, locked], i) => (
          <g key={i} transform={`translate(${x} ${y}) scale(1.1)`}>
            <Ramp dir={d} locked={locked} paint={i} />
          </g>
        ))}
        <g transform="translate(210 240) scale(0.9)">
          <Cup />
        </g>
        <g transform="translate(90 40)">
          <Marble />
        </g>
      </svg>
    </span>
  );
}
