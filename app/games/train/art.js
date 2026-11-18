// Original illustrations for Train Track. Everything is drawn in "cell units":
// each grid square is 100 × 100, centred at (0, 0) unless noted.

const INK = "#3D2A1E";

export function Tree() {
  return (
    <g>
      <ellipse cx="4" cy="10" rx="34" ry="30" fill="#0F3A22" opacity="0.35" />
      <circle cx="-12" cy="4" r="22" fill="#2F8F4E" stroke="#1D5E38" strokeWidth="3" />
      <circle cx="12" cy="-2" r="24" fill="#3FA65E" stroke="#1D5E38" strokeWidth="3" />
      <circle cx="0" cy="-14" r="20" fill="#4CB860" stroke="#1D5E38" strokeWidth="3" />
      <circle cx="-6" cy="-20" r="6" fill="#fff" opacity="0.25" />
      <circle cx="16" cy="6" r="3.5" fill="#E5483B" />
      <circle cx="-14" cy="10" r="3.5" fill="#E5483B" />
    </g>
  );
}

export function Rock() {
  return (
    <g>
      <ellipse cx="3" cy="12" rx="32" ry="16" fill="#0F3A22" opacity="0.35" />
      <path d="M-30 12-22-14-4-24 18-18 30 0 24 18-8 22Z" fill="#A9A49B" stroke="#5E5A52" strokeWidth="3" strokeLinejoin="round" />
      <path d="M-22-14-4-24 18-18 6-6-14-4Z" fill="#C9C4BA" />
      <path d="M-14 4 2 8" stroke="#5E5A52" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </g>
  );
}

export function Pond() {
  return (
    <g>
      <path d="M-38 2C-38-20-14-34 8-30 30-26 40-10 36 8 32 28 6 36-14 32-32 28-38 18-38 2Z" fill="#3A8DE6" stroke="#2261A8" strokeWidth="3" />
      <path d="M-22-6q8-6 16 0M2 10q8-6 16 0" fill="none" stroke="#BFE6FF" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="18" cy="-14" rx="9" ry="6" fill="#4CB860" stroke="#23803F" strokeWidth="2" />
    </g>
  );
}

/** Station building seen from above, with a platform. `flag` marks the destination. */
export function Station({ flag }) {
  return (
    <g>
      <rect x="-42" y="-42" width="84" height="84" rx="10" fill="#E6D5B5" stroke="#A88C5A" strokeWidth="3" />
      <rect x="-42" y="-42" width="84" height="26" rx="8" fill={flag ? "#E5483B" : "#3A8DE6"} stroke={INK} strokeWidth="3" />
      <path d="M-42-29h84" stroke="#fff" strokeOpacity="0.4" strokeWidth="3" />
      {flag && (
        <g>
          <path d="M30-42v-26" stroke={INK} strokeWidth="3" strokeLinecap="round" />
          <path d="M30-68h20l-6 6 6 6H30Z" fill="#F8C630" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        </g>
      )}
    </g>
  );
}

/** A small kid figure, standing, centred on (0,0). Used on the map and in the checklist. */
export function Kid({ waving = false }) {
  return (
    <g>
      {/* legs */}
      <path d="M-7 26v14M7 26v14" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      {/* still arm */}
      <path d="M-13 2-20 18" stroke="#F4C98B" strokeWidth="7" strokeLinecap="round" />
      {/* body */}
      <path d="M-15 0Q-15-10 0-10Q15-10 15 0V24Q15 30 8 30H-8Q-15 30-15 24Z" fill="#9B6BE0" stroke={INK} strokeWidth="3" />
      {/* waving arm */}
      <g className={waving ? "kid-wave" : undefined}>
        <path d="M13 0 26-16" stroke="#F4C98B" strokeWidth="7" strokeLinecap="round" />
        <circle cx="27" cy="-18" r="5.5" fill="#F4C98B" stroke={INK} strokeWidth="2.5" />
      </g>
      {/* head */}
      <circle cx="0" cy="-24" r="14" fill="#F4C98B" stroke={INK} strokeWidth="3" />
      <path d="M-14-26Q-12-40 0-39Q13-39 14-27Q6-33-14-26Z" fill="#6B3E1E" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <circle cx="-5" cy="-23" r="2" fill={INK} />
      <circle cx="5" cy="-23" r="2" fill={INK} />
      <path d="M-5-17q5 4 10 0" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
    </g>
  );
}

/**
 * A passenger stop: a waving kid next to a little train sign, with a
 * "!" bubble asking to be picked up. Shows a green tick once they've boarded.
 */
export function Stop({ boarded }) {
  return (
    <g className="train-stop" data-boarded={boarded}>
      {/* stop sign with a tiny train */}
      <path d="M-30 38V-6" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <rect x="-42" y="-30" width="24" height="24" rx="5" fill="#3A8DE6" stroke={INK} strokeWidth="2.5" />
      <rect x="-37" y="-23" width="10" height="9" rx="2" fill="#fff" />
      <rect x="-27" y="-20" width="5" height="6" rx="1" fill="#fff" />
      <g className="train-stop-person">
        <g transform="translate(10 4) scale(0.95)">
          <Kid waving />
        </g>
        {/* "pick me up!" bubble */}
        <g className="stop-bubble">
          <path d="M20-44h22a8 8 0 0 1 8 8v8a8 8 0 0 1-8 8h-8l-6 7v-7h-8a8 8 0 0 1-8-8v-8a8 8 0 0 1 8-8Z" fill="#fff" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M31-39v9" stroke="#E5483B" strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="31" cy="-24.5" r="2.6" fill="#E5483B" />
        </g>
      </g>
      {/* picked up */}
      <g className="train-stop-tick">
        <circle cx="12" cy="0" r="20" fill="#3FB35F" stroke="#fff" strokeWidth="4" />
        <path d="M3 0l6 6 12-12" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  );
}

/** The paved platform under a stop (drawn below the track). */
export function StopPlatform() {
  return (
    <g>
      <rect x="-44" y="-44" width="88" height="88" rx="14" fill="#F6E7C6" stroke="#B9935A" strokeWidth="3" />
      <path d="M-40 34h80" stroke="#E5C88C" strokeWidth="6" strokeLinecap="round" />
    </g>
  );
}

/** Checklist icons. */
export function KidIcon({ on }) {
  return (
    <svg viewBox="-30 -42 60 84" className="h-full w-full" aria-hidden style={on ? undefined : { filter: "grayscale(1)", opacity: 0.45 }}>
      <Kid />
    </svg>
  );
}

export function StarPickup() {
  return (
    <g className="train-star">
      <polygon
        points="0,-26 7.6,-9.4 25.7,-7.4 12.2,4.9 15.9,22.7 0,13.6 -15.9,22.7 -12.2,4.9 -25.7,-7.4 -7.6,-9.4"
        fill="#F7C948"
        stroke="#A86F0C"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M-3-16-6-9" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
    </g>
  );
}

/** Toy steam engine from above, pointing right (+x). */
export function Engine() {
  return (
    <g>
      <rect x="-34" y="-22" width="70" height="44" rx="12" fill="#0F3A22" opacity="0.3" transform="translate(3 4)" />
      <rect x="-34" y="-20" width="24" height="40" rx="5" fill="#A42C22" stroke={INK} strokeWidth="3" />
      <rect x="-30" y="-12" width="14" height="24" rx="3" fill="#BFE6FF" stroke={INK} strokeWidth="2" />
      <rect x="-12" y="-17" width="44" height="34" rx="14" fill="#E5483B" stroke={INK} strokeWidth="3" />
      <path d="M-6-9h30" stroke="#fff" strokeOpacity="0.45" strokeWidth="4" strokeLinecap="round" />
      <circle cx="16" cy="0" r="7.5" fill={INK} />
      <circle cx="16" cy="0" r="3.5" fill="#6B5A48" />
      <path d="M32-14l8 14-8 14" fill="#F8C630" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    </g>
  );
}

/** Carriage from above; shows heads at the windows once passengers board. */
export function Carriage({ riders = 0 }) {
  return (
    <g>
      <rect x="-30" y="-19" width="60" height="38" rx="9" fill="#0F3A22" opacity="0.3" transform="translate(3 4)" />
      <rect x="-30" y="-18" width="60" height="36" rx="9" fill="#3A8DE6" stroke={INK} strokeWidth="3" />
      <rect x="-22" y="-10" width="44" height="20" rx="5" fill="#2261A8" />
      {Array.from({ length: Math.min(riders, 2) }, (_, i) => (
        <g key={i}>
          <circle cx={-10 + i * 20} cy="0" r="8" fill="#F4C98B" stroke={INK} strokeWidth="2.5" />
          <path d={`M${-17 + i * 20} -2Q${-16 + i * 20} -9 ${-10 + i * 20} -9Q${-4 + i * 20} -9 ${-3 + i * 20} -3`} fill="#6B3E1E" />
        </g>
      ))}
      <path d="M-34 0h-6" stroke={INK} strokeWidth="4" strokeLinecap="round" />
    </g>
  );
}

/** Menu preview: a tiny map with a track bending from one station to another. */
export function MapPreview({ variant }) {
  return (
    <span className="relative block size-[60px] shrink-0 drop-shadow-[0_2px_2px_rgba(40,18,0,0.35)]" aria-hidden>
      <svg viewBox="0 0 300 300" className="h-full w-full">
        <defs>
          <radialGradient id="mp-felt" cx="50%" cy="35%" r="75%">
            <stop offset="0" stopColor="#35915A" />
            <stop offset="1" stopColor="#1D5E38" />
          </radialGradient>
        </defs>
        <rect width="300" height="300" rx="40" fill="url(#mp-felt)" />
        <path d="M60 60H150Q240 60 240 150V240" fill="none" stroke="#7A4A22" strokeWidth="44" strokeDasharray="10 16" />
        <path d="M60 60H150Q240 60 240 150V240" fill="none" stroke="#C9CDD2" strokeWidth="30" />
        <path d="M60 60H150Q240 60 240 150V240" fill="none" stroke="#35915A" strokeWidth="20" />
        <g transform="translate(60 60) scale(0.9)">
          <Station />
        </g>
        <g transform="translate(240 240) scale(0.9)">
          <Station flag />
        </g>
        {variant !== "easy" && (
          <g transform="translate(240 120) scale(0.8)">
            <circle r="30" fill="#9B6BE0" stroke={INK} strokeWidth="6" />
          </g>
        )}
        <g transform="translate(60 230) scale(1.2)">
          <Tree />
        </g>
      </svg>
    </span>
  );
}
