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

/** Short band-passed noise burst: paper, rustles, swishes. */
function noise(dur, { start = 0, vol = 0.2, freq = 2000, q = 1.2 } = {}) {
  if (muted) return;
  const ac = getCtx();
  if (!ac) return;
  const t = ac.currentTime + start;
  const len = Math.max(1, Math.floor(ac.sampleRate * dur));
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = buf;
  const filter = ac.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = freq;
  filter.Q.value = q;
  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(vol, t + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(filter).connect(gain).connect(ac.destination);
  src.start(t);
  src.stop(t + dur + 0.02);
}

export const sound = {
  /** Marble clacking onto a wooden ramp. */
  clack() {
    tone(1100, { dur: 0.05, type: "triangle", vol: 0.12, slideTo: 700 });
    noise(0.03, { freq: 2400, vol: 0.12, q: 1.5 });
  },
  /** Marble rattling into a tin cup. */
  plink() {
    [1760, 2093, 1568].forEach((f, i) => tone(f, { start: i * 0.07, dur: 0.18, type: "sine", vol: 0.1 }));
  },
  /** Steam-train "choo-choo" whistle. */
  whistle() {
    tone(740, { dur: 0.32, type: "triangle", vol: 0.14 });
    tone(880, { dur: 0.32, type: "triangle", vol: 0.1 });
    tone(740, { start: 0.38, dur: 0.5, type: "triangle", vol: 0.14 });
    tone(880, { start: 0.38, dur: 0.5, type: "triangle", vol: 0.1 });
  },
  /** One puff of the engine. */
  chug() {
    noise(0.09, { freq: 600, vol: 0.12, q: 0.6 });
  },
  /** Laying one piece of track. */
  click() {
    tone(1200, { dur: 0.04, type: "square", vol: 0.04 });
    tone(300, { dur: 0.05, type: "sine", vol: 0.1 });
  },
  /** A bell "ding" (passenger boarding). */
  ding() {
    tone(1568, { dur: 0.5, type: "sine", vol: 0.12 });
    tone(2093, { start: 0.02, dur: 0.4, type: "sine", vol: 0.05 });
  },
  /** A balloon bursting. */
  balloonPop() {
    noise(0.07, { freq: 3800, vol: 0.32, q: 0.6 });
    tone(160, { dur: 0.08, type: "sine", vol: 0.22, slideTo: 70 });
  },
  /** Wooden piece dropping into its hole. */
  clunk() {
    tone(170, { dur: 0.12, type: "sine", vol: 0.32, slideTo: 90 });
    noise(0.05, { freq: 900, vol: 0.18, q: 0.8 });
    tone(520, { start: 0.08, dur: 0.12, type: "triangle", vol: 0.08 });
  },
  /** Springy bounce for a piece that doesn't fit. */
  boing() {
    tone(220, { dur: 0.28, type: "sine", vol: 0.16, slideTo: 520 });
  },
  /** Paper being scrunched into a ball. */
  crumple() {
    noise(0.06, { freq: 2600, vol: 0.22 });
    noise(0.05, { start: 0.05, freq: 1700, vol: 0.18 });
    noise(0.07, { start: 0.1, freq: 3200, vol: 0.16 });
  },
  /** Paper opening back out. */
  unfold() {
    noise(0.12, { freq: 1400, vol: 0.12, q: 0.7 });
  },
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
  /** Soft "plop" for a new item landing on the table. */
  pop() {
    tone(380, { dur: 0.1, type: "sine", vol: 0.14, slideTo: 620 });
  },
  /** Wet "sploosh" for something dropping into paint. */
  splash() {
    tone(900, { dur: 0.18, type: "sine", vol: 0.12, slideTo: 220 });
    tone(1400, { start: 0.05, dur: 0.12, type: "triangle", vol: 0.06, slideTo: 500 });
  },
  /** Speak a short word for pre-readers (e.g. a colour name). Silent when muted or unsupported. */
  say(text) {
    if (muted || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.9;
      u.pitch = 1.25;
      window.speechSynthesis.speak(u);
    } catch {}
  },
};

/** React hook: [muted, toggle]. Server render always reports sound on. */
export function useMuted() {
  const value = useSyncExternalStore(sound.subscribe, sound.isMuted, () => false);
  return [value, () => sound.setMuted(!sound.isMuted())];
}
