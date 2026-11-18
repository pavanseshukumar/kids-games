// Tiny Web Audio synth: no audio files to load, works offline.
// Mute preference is shared by every game and remembered in this browser.
import { useSyncExternalStore } from "react";

const MUTE_KEY = "sound-muted";
let ctx = null;
let muted = readMuted();
const listeners = new Set();

function readMuted() {
  try {
    return typeof window !== "undefined" && localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

function getCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function tone(freq, { start = 0, dur = 0.15, type = "sine", vol = 0.18, slideTo } = {}) {
  if (muted) return;
  const ac = getCtx();
  if (!ac) return;
  const t = ac.currentTime + start;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(vol, t + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(ac.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

export const sound = {
  isMuted: () => muted,
  setMuted(v) {
    muted = v;
    try {
      localStorage.setItem(MUTE_KEY, v ? "1" : "0");
    } catch {}
    listeners.forEach((fn) => fn());
  },
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  flip() {
    tone(520, { dur: 0.09, type: "triangle", vol: 0.12, slideTo: 760 });
  },
  match() {
    tone(660, { dur: 0.12, type: "triangle" });
    tone(880, { start: 0.09, dur: 0.12, type: "triangle" });
    tone(1320, { start: 0.18, dur: 0.2, type: "sine", vol: 0.12 });
  },
  miss() {
    tone(330, { dur: 0.18, type: "sine", vol: 0.12, slideTo: 240 });
  },
  win() {
    [523, 659, 784, 1047, 784, 1047].forEach((f, i) =>
      tone(f, { start: i * 0.12, dur: 0.22, type: "triangle", vol: 0.16 })
    );
  },
  tap() {
    tone(700, { dur: 0.06, type: "sine", vol: 0.1 });
  },
};

/** React hook: [muted, toggle]. Server render always reports sound on. */
export function useMuted() {
  const value = useSyncExternalStore(sound.subscribe, sound.isMuted, () => false);
  return [value, () => sound.setMuted(!sound.isMuted())];
}
