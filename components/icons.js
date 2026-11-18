// Small UI icons, drawn with currentColor so they inherit text colour.
const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
};

export function HomeIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10v9.5h13V10" />
      <path d="M10 19.5V14h4v5.5" />
    </svg>
  );
}

export function BackIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M15 5 8 12l7 7" />
    </svg>
  );
}

export function SoundOnIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" />
      <path d="M15.5 9a4 4 0 0 1 0 6" />
      <path d="M18 6.5a7.5 7.5 0 0 1 0 11" />
    </svg>
  );
}

export function SoundOffIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" />
      <path d="m16 9.5 5 5M21 9.5l-5 5" />
    </svg>
  );
}

export function ReplayIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12a8 8 0 1 0 2.4-5.7" />
      <path d="M4 4v4.5h4.5" />
    </svg>
  );
}

export function ArrowIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function PlayIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
    </svg>
  );
}

export function CheckIcon(props) {
  return (
    <svg {...base} strokeWidth={3} {...props}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

export function LockIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="currentColor" stroke="none" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </svg>
  );
}

const STAR = "32,5 40.2,22.7 59.6,24.9 45.2,38.1 49.1,57.2 32,47.5 14.9,57.2 18.8,38.1 4.4,24.9 23.8,22.7";

/** Polished gold star, or an empty pressed-in slot when `on` is false. */
export function StarIcon({ on = true, size = 40, surface = "paper", ...props }) {
  if (!on) {
    const dark = surface === "wood";
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden focusable={false} {...props}>
        <polygon points={STAR} fill={dark ? "rgba(40,18,0,0.35)" : "rgba(120,80,40,0.14)"} stroke={dark ? "rgba(255,230,190,0.25)" : "rgba(255,255,255,0.9)"} strokeWidth="2" strokeLinejoin="round" transform="translate(0 1)" />
        <polygon points={STAR} fill="none" stroke={dark ? "rgba(30,12,0,0.45)" : "rgba(120,80,40,0.28)"} strokeWidth="2" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden focusable={false} overflow="visible" {...props}>
      <defs>
        <linearGradient id="gold-face" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF3B0" />
          <stop offset="0.45" stopColor="#F7C948" />
          <stop offset="1" stopColor="#D89A1C" />
        </linearGradient>
      </defs>
      <polygon points={STAR} fill="#A86F0C" strokeLinejoin="round" stroke="#A86F0C" strokeWidth="4" transform="translate(0 3)" />
      <polygon points={STAR} fill="url(#gold-face)" stroke="#B9800F" strokeWidth="3" strokeLinejoin="round" />
      <path d="M32 12 37 23.5 49.5 25" fill="none" stroke="#fff" strokeOpacity="0.75" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
