"use client";

import Link from "next/link";
import { useMuted } from "@/lib/sound";
import { CheckIcon, HomeIcon, SoundOffIcon, SoundOnIcon, StarIcon } from "./icons";

/** Three-slot top bar shared by every screen. */
export function AppBar({ left, center, right }) {
  return (
    <header className="app-bar">
      <div className="flex justify-start">{left}</div>
      <div className="flex min-w-0 justify-center">{center}</div>
      <div className="flex justify-end">{right}</div>
    </header>
  );
}

export function HomeButton() {
  return (
    <Link href="/" className="knob" aria-label="Home">
      <HomeIcon />
    </Link>
  );
}

export function SoundButton() {
  const [muted, toggle] = useMuted();
  return (
    <button onClick={toggle} className="knob" aria-label={muted ? "Turn sound on" : "Turn sound off"}>
      {muted ? <SoundOffIcon /> : <SoundOnIcon />}
    </button>
  );
}

/** Three gold stars. `surface` = what they sit on, for the empty-slot look. */
export function Stars({ count, size = 40, animate = false, surface = "paper" }) {
  return (
    <span className="flex items-center gap-0.5" role="img" aria-label={`${count} of 3 stars`}>
      {[0, 1, 2].map((i) => (
        <span key={i} className={animate && i < count ? "star-in" : undefined} style={{ "--i": i }}>
          <StarIcon size={size} on={i < count} surface={surface} />
        </span>
      ))}
    </span>
  );
}

export function CheckSticker() {
  return (
    <span className="check-sticker" aria-hidden>
      <CheckIcon width={18} height={18} />
    </span>
  );
}
