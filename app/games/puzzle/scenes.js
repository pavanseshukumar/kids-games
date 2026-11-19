// Puzzle pictures: one big, bold subject per picture, like a real wooden kids' puzzle.
// Each is 300 × 300 with thick outlines, flat bright paint and a different
// background band per row, so every tile shows a part you can recognise.
export const SIZE = 300;

const INK = "#3D2A1E";
const line = { stroke: INK, strokeWidth: 5, strokeLinejoin: "round", strokeLinecap: "round" };
const thin = { stroke: INK, strokeWidth: 3.5, strokeLinejoin: "round", strokeLinecap: "round" };

function Sky({ id, top = "#7CC8F8", bottom = "#D6F0FF" }) {
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={bottom} />
        </linearGradient>
      </defs>
      <rect width={SIZE} height={SIZE} fill={`url(#${id})`} />
    </>
  );
}

function Cloud({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-30 12a14 14 0 0 1 4-26 20 20 0 0 1 36-6 16 16 0 0 1 22 18 12 12 0 0 1-2 14Z" fill="#fff" {...thin} />
    </g>
  );
}

function Sun({ x, y, r = 26 }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={`M0 ${-r - 7}v-10`} stroke="#F59A2E" strokeWidth="5" strokeLinecap="round" transform={`rotate(${i * 45})`} />
      ))}
      <circle r={r} fill="#FFD23F" {...thin} />
      <circle cx={-r * 0.35} cy={-r * 0.35} r={r * 0.25} fill="#fff" opacity="0.5" />
    </g>
  );
}

function Flower({ x, y, petal, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0v18" stroke="#23803F" strokeWidth="4" strokeLinecap="round" />
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="0" cy="-8" rx="6" ry="8" fill={petal} stroke={INK} strokeWidth="2.5" transform={`rotate(${a})`} />
      ))}
      <circle r="5" fill="#FFD23F" stroke={INK} strokeWidth="2.5" />
    </g>
  );
}

function Grass({ y = 236, fill = "#4CB860" }) {
  return <path d={`M-10 ${y}Q75 ${y - 12} 150 ${y}T310 ${y}V310H-10Z`} fill={fill} {...line} />;
}

/* ---------------- 1. Steam train ---------------- */
function TrainScene() {
  const wheel = (cx, cy, r) => (
    <g key={cx}>
      <circle cx={cx} cy={cy} r={r} fill="#3D2A1E" />
      <circle cx={cx} cy={cy} r={r - 6} fill="#6B5A48" stroke={INK} strokeWidth="2" />
      <circle cx={cx} cy={cy} r={r * 0.32} fill="#F8C630" stroke={INK} strokeWidth="2.5" />
    </g>
  );
  return (
    <g>
      <Sky id="pz-train-sky" />
      <Sun x={258} y={46} />
      <Cloud x={50} y={52} s={1.1} />
      {/* smoke */}
      <circle cx="232" cy="74" r="13" fill="#F4F4F4" {...thin} />
      <circle cx="206" cy="50" r="17" fill="#F4F4F4" {...thin} />
      <circle cx="168" cy="30" r="21" fill="#F4F4F4" {...thin} />
      {/* far hills */}
      <path d="M-10 200Q60 140 130 190T300 170V240H-10Z" fill="#8FD49A" stroke="#4E9E5E" strokeWidth="4" />
      <Grass y={238} />
      {/* track */}
      {Array.from({ length: 11 }, (_, i) => (
        <rect key={i} x={i * 30 - 4} y="240" width="18" height="12" rx="3" fill="#8A5A32" />
      ))}
      <rect x="-5" y="236" width="310" height="7" fill="#9AA0A8" stroke={INK} strokeWidth="2.5" />
      {/* carriage */}
      <rect x="6" y="122" width="124" height="16" rx="6" fill="#2261A8" {...line} />
      <rect x="14" y="136" width="108" height="78" rx="10" fill="#3A8DE6" {...line} />
      {[24, 72].map((x, i) => (
        <g key={x}>
          <rect x={x} y="150" width="38" height="34" rx="6" fill="#BFE6FF" {...thin} />
          <circle cx={x + 19} cy="172" r="10" fill="#F4C98B" stroke={INK} strokeWidth="2.5" />
          <path d={`M${x + 9} 170q1-11 10-11t10 11q-6-5-20 0Z`} fill={i ? "#F8C630" : "#6B3E1E"} stroke={INK} strokeWidth="2" />
          <circle cx={x + 15} cy="173" r="1.6" fill={INK} />
          <circle cx={x + 23} cy="173" r="1.6" fill={INK} />
        </g>
      ))}
      <path d="M30 198h76" stroke="#fff" strokeOpacity="0.45" strokeWidth="5" strokeLinecap="round" />
      <path d="M122 200h20" {...line} />
      {/* engine */}
      <rect x="236" y="96" width="24" height="54" rx="3" fill="#3D2A1E" />
      <rect x="229" y="88" width="38" height="14" rx="4" fill="#3D2A1E" />
      <rect x="194" y="140" width="88" height="70" rx="14" fill="#E5483B" {...line} />
      <path d="M204 154h66" stroke="#fff" strokeOpacity="0.45" strokeWidth="6" strokeLinecap="round" />
      <circle cx="282" cy="175" r="10" fill="#FFD23F" {...thin} />
      <rect x="132" y="96" width="78" height="18" rx="6" fill="#A42C22" {...line} />
      <rect x="140" y="112" width="62" height="102" rx="8" fill="#E5483B" {...line} />
      <rect x="152" y="124" width="38" height="34" rx="6" fill="#BFE6FF" {...thin} />
      <path d="M278 210l18 26h-32Z" fill="#F8C630" {...thin} />
      {wheel(42, 220, 17)}
      {wheel(104, 220, 17)}
      {wheel(170, 214, 24)}
      {wheel(228, 220, 18)}
      {wheel(264, 220, 18)}
      <path d="M170 214H264" stroke="#C9CDD2" strokeWidth="5" strokeLinecap="round" />
      <Flower x={30} y={268} petal="#F2709C" />
      <Flower x={128} y={276} petal="#9B6BE0" />
      <Flower x={206} y={270} petal="#F8C630" />
      <Flower x={280} y={278} petal="#F2709C" />
    </g>
  );
}

/* ---------------- 2. Bunch of balloons ---------------- */
const BALLOON = "M32 4C50 4 60 19 60 36 60 55 45 70 32 70 19 70 4 55 4 36 4 19 14 4 32 4Z";

function BigBalloon({ x, y, s, face, edge }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M27 76h10l-5-8Z" fill={face} stroke={edge} strokeWidth={4 / s} strokeLinejoin="round" />
      <path d={BALLOON} fill={face} stroke={INK} strokeWidth={5 / s} />
      <path d="M32 4C50 4 60 19 60 36 60 55 45 70 32 70" fill="none" stroke="#000" strokeOpacity="0.12" strokeWidth={10 / s} />
      <ellipse cx="20" cy="22" rx="5.5" ry="11" transform="rotate(-28 20 22)" fill="#fff" opacity="0.55" />
      <circle cx="27" cy="10" r="2.4" fill="#fff" opacity="0.6" />
    </g>
  );
}

function BalloonScene() {
  const hand = [168, 214];
  const balloons = [
    [8, 58, 1.55, "#F8C630", "#A87A08"],
    [190, 50, 1.55, "#3A8DE6", "#1F5A9E"],
    [88, 14, 1.9, "#E5483B", "#9E2A20"],
  ];
  return (
    <g>
      <Sky id="pz-bal-sky" top="#8FD3FF" bottom="#E3F5FF" />
      <Cloud x={262} y={24} s={0.9} />
      <Cloud x={40} y={22} s={0.8} />
      <path d="M244 196q8-9 16 0q8-9 16 0M30 214q6-7 12 0q6-7 12 0" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      <Grass y={250} />
      <Flower x={24} y={272} petal="#9B6BE0" />
      <Flower x={92} y={280} petal="#F2709C" />
      <Flower x={232} y={276} petal="#F8C630" />
      <Flower x={282} y={262} petal="#F2709C" s={0.8} />
      {balloons.map(([x, y, s]) => (
        <path
          key={x}
          d={`M${x + 32 * s} ${y + 76 * s}Q${(x + 32 * s + hand[0]) / 2 + 6} ${hand[1] - 22} ${hand[0]} ${hand[1]}`}
          fill="none"
          stroke="#7A6650"
          strokeWidth="3"
        />
      ))}
      {balloons.map(([x, y, s, f, e]) => (
        <BigBalloon key={x} x={x} y={y} s={s} face={f} edge={e} />
      ))}
      {/* kid holding the strings */}
      <g transform="translate(142 244) scale(1.2)">
        <path d="M-7 26v14M7 26v14" stroke={INK} strokeWidth="6" strokeLinecap="round" />
        <path d="M-13 2-20 18" stroke="#F4C98B" strokeWidth="7" strokeLinecap="round" />
        <path d="M-15 0Q-15-10 0-10Q15-10 15 0V24Q15 30 8 30H-8Q-15 30-15 24Z" fill="#3FB35F" stroke={INK} strokeWidth="3" />
        <path d="M13 0 21-20" stroke="#F4C98B" strokeWidth="7" strokeLinecap="round" />
        <circle cx="22" cy="-24" r="5.5" fill="#F4C98B" stroke={INK} strokeWidth="2.5" />
        <circle cx="0" cy="-24" r="14" fill="#F4C98B" stroke={INK} strokeWidth="3" />
        <path d="M-14-26Q-12-40 0-39Q13-39 14-27Q6-33-14-26Z" fill="#6B3E1E" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        <circle cx="-5" cy="-23" r="2" fill={INK} />
        <circle cx="5" cy="-23" r="2" fill={INK} />
        <path d="M-6-17q6 5 12 0" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
      </g>
    </g>
  );
}

/* ---------------- 3. Big fish ---------------- */
function SmallFish({ x, y, s, fill }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M14 0 30-12V12Z" fill={fill} {...thin} />
      <ellipse cx="0" cy="0" rx="18" ry="12" fill={fill} {...thin} />
      <circle cx="-8" cy="-2" r="2.5" fill={INK} />
    </g>
  );
}

function FishScene() {
  return (
    <g>
      <Sky id="pz-sea" top="#5CCBF5" bottom="#1F7FC0" />
      {/* light from the surface */}
      <path d="M40 0 10 300M120 0 100 300M210 0 230 300" stroke="#fff" strokeOpacity="0.1" strokeWidth="26" />
      {/* bubbles */}
      {[[40, 102, 9], [26, 70, 7], [44, 40, 11], [24, 14, 6]].map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill="#BFE6FF" fillOpacity="0.5" stroke="#fff" strokeWidth="2.5" />
          <circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.25} fill="#fff" />
        </g>
      ))}
      <SmallFish x={112} y={34} s={1} fill="#9B6BE0" />
      {/* jellyfish */}
      <g transform="translate(196 38)">
        <path d="M-12 8q-4 12 2 22M0 8q3 12-2 24M12 8q4 12-2 22" fill="none" stroke="#F2709C" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M-20 10a20 20 0 0 1 40 0Z" fill="#F7A8C4" {...thin} />
      </g>
      <SmallFish x={262} y={52} s={0.9} fill="#3FB35F" />
      {/* sand */}
      <path d="M-10 254Q80 240 160 254T310 248V310H-10Z" fill="#F4D49B" {...line} />
      {/* seaweed */}
      <path d="M24 300q-14-24 0-46t0-46" fill="none" stroke="#2F8F4E" strokeWidth="9" strokeLinecap="round" />
      <path d="M276 300q14-24 0-46t0-44q-12-20 2-40" fill="none" stroke="#3FA65E" strokeWidth="9" strokeLinecap="round" />
      {/* starfish + shell */}
      <polygon
        points="200,250 206,263 220,264 209,273 213,287 200,279 187,287 191,273 180,264 194,263"
        fill="#E5483B"
        {...thin}
      />
      <path d="M86 284a16 16 0 0 1 32 0Z" fill="#F7A8C4" {...thin} />
      <path d="M102 284v-14M94 284l4-12M110 284l-4-12" stroke={INK} strokeWidth="2" />
      {/* the big fish */}
      <path d="M226 142 290 92V196Z" fill="#F59A2E" {...line} />
      <path d="M120 88Q150 52 196 88Z" fill="#F59A2E" {...line} />
      <path d="M140 196Q160 226 186 196Z" fill="#F59A2E" {...line} />
      <defs>
        <clipPath id="pz-fish-body">
          <ellipse cx="146" cy="142" rx="96" ry="62" />
        </clipPath>
      </defs>
      <ellipse cx="146" cy="142" rx="96" ry="62" fill="#F8B04A" />
      <g clipPath="url(#pz-fish-body)">
        <path d="M118 70q-22 72 0 144M170 70q-22 72 0 144" fill="none" stroke={INK} strokeWidth="18" />
        <path d="M118 70q-22 72 0 144M170 70q-22 72 0 144" fill="none" stroke="#fff" strokeWidth="12" />
      </g>
      <ellipse cx="146" cy="142" rx="96" ry="62" fill="none" {...line} />
      <circle cx="88" cy="126" r="18" fill="#fff" {...thin} />
      <circle cx="84" cy="126" r="9" fill={INK} />
      <circle cx="81" cy="122" r="3" fill="#fff" />
      <path d="M58 156q12 10 26 2" fill="none" {...thin} />
      <path d="M150 142q18 10 30-4" fill="#F59A2E" {...thin} />
    </g>
  );
}

/* ---------------- 4. House ---------------- */
function HouseScene() {
  return (
    <g>
      <Sky id="pz-house-sky" />
      <Sun x={46} y={46} />
      <Cloud x={248} y={44} s={1} />
      <path d="M112 34q6-7 12 0q6-7 12 0" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      <Grass y={240} />
      {/* path to the door */}
      <path d="M140 248h32l26 60H114Z" fill="#E6C690" {...thin} />
      {/* tree */}
      <rect x="258" y="170" width="18" height="80" rx="4" fill="#8A5A32" {...thin} />
      <circle cx="252" cy="152" r="28" fill="#3FA65E" {...thin} />
      <circle cx="282" cy="140" r="26" fill="#4CB860" {...thin} />
      <circle cx="266" cy="118" r="24" fill="#5BC46E" {...thin} />
      <circle cx="258" cy="150" r="5" fill="#E5483B" />
      <circle cx="285" cy="132" r="5" fill="#E5483B" />
      {/* fence */}
      {[6, 28, 50].map((x) => (
        <path key={x} d={`M${x} 250V214l8-10 8 10V250Z`} fill="#fff" {...thin} />
      ))}
      <path d="M0 226h76M0 242h76" stroke={INK} strokeWidth="3.5" />
      <path d="M0 226h76M0 242h76" stroke="#fff" strokeWidth="1.5" />
      {/* house */}
      <rect x="192" y="68" width="22" height="50" fill="#A9583A" {...line} />
      <rect x="80" y="138" width="150" height="112" fill="#FFE7B3" {...line} />
      <path d="M62 144 155 62 248 144Z" fill="#E5483B" {...line} />
      <path d="M86 132 155 72 224 132" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="5" strokeLinecap="round" />
      <circle cx="155" cy="112" r="15" fill="#BFE6FF" {...thin} />
      <path d="M155 97v30M140 112h30" stroke={INK} strokeWidth="3" />
      <rect x="135" y="184" width="40" height="66" rx="18" fill="#3A8DE6" {...line} />
      <circle cx="166" cy="220" r="3.5" fill="#F8C630" stroke={INK} strokeWidth="2" />
      {[94, 186].map((x) => (
        <g key={x}>
          <rect x={x} y="160" width="32" height="32" rx="4" fill="#BFE6FF" {...thin} />
          <path d={`M${x + 16} 160v32M${x} 176h32`} stroke={INK} strokeWidth="3" />
          <rect x={x - 4} y="192" width="40" height="8" rx="3" fill="#3FB35F" {...thin} />
        </g>
      ))}
      <Flower x={100} y={266} petal="#F2709C" />
      <Flower x={214} y={270} petal="#9B6BE0" />
      <Flower x={30} y={276} petal="#F8C630" />
    </g>
  );
}

/* ---------------- 5. Rocket ---------------- */
function Twinkle({ x, y, s = 1, fill = "#FFE066" }) {
  return <path d="M0-10q2 8 10 10-8 2-10 10-2-8-10-10 8-2 10-10Z" fill={fill} transform={`translate(${x} ${y}) scale(${s})`} />;
}

function RocketScene() {
  return (
    <g>
      <Sky id="pz-space" top="#1B2452" bottom="#4A3F9A" />
      {[[100, 28, 0.9], [210, 18, 0.8], [268, 120, 1], [96, 250, 0.7], [210, 262, 0.9], [26, 40, 0.8], [246, 230, 0.6]].map(([x, y, s], i) => (
        <Twinkle key={i} x={x} y={y} s={s} fill={i % 3 === 0 ? "#fff" : "#FFE066"} />
      ))}
      {/* comet */}
      <g transform="translate(40 110)">
        <path d="M-8 6-34 32M-2 10-24 40M-12-2-40 18" stroke="#F2709C" strokeWidth="5" strokeLinecap="round" />
        <circle r="12" fill="#FFE066" {...thin} />
      </g>
      {/* flying saucer */}
      <g transform="translate(40 190)">
        <path d="M-14-2a14 14 0 0 1 28 0Z" fill="#BFE6FF" {...thin} />
        <ellipse cx="0" cy="2" rx="30" ry="10" fill="#3FB35F" {...thin} />
        {[-16, 0, 16].map((x) => (
          <circle key={x} cx={x} cy="3" r="3" fill="#FFE066" />
        ))}
      </g>
      {/* satellite */}
      <g transform="translate(266 190) rotate(-20)">
        <rect x="-26" y="-7" width="16" height="14" fill="#3A8DE6" {...thin} />
        <rect x="10" y="-7" width="16" height="14" fill="#3A8DE6" {...thin} />
        <rect x="-10" y="-10" width="20" height="20" rx="4" fill="#C9CDD2" {...thin} />
        <path d="M0-10v-10" stroke={INK} strokeWidth="3" />
        <circle cx="0" cy="-22" r="3.5" fill="#E5483B" />
      </g>
      {/* moon */}
      <path d="M254 34a30 30 0 1 0 26 46 24 24 0 0 1-26-46Z" fill="#FFE7A0" {...thin} />
      {/* ringed planet */}
      <g transform="translate(48 254)">
        <circle r="24" fill="#9B6BE0" {...thin} />
        <ellipse rx="40" ry="10" fill="none" stroke="#F8C630" strokeWidth="6" transform="rotate(-16)" />
        <path d="M-24 2a24 24 0 0 0 48 0" fill="#9B6BE0" transform="rotate(-16)" />
        <path d="M-24 2a24 24 0 0 0 48 0" fill="none" stroke={INK} strokeWidth="3.5" transform="rotate(-16)" />
      </g>
      {/* little earth */}
      <g transform="translate(262 262)">
        <circle r="22" fill="#3A8DE6" {...thin} />
        <path d="M-12-12q10 2 8 10t8 10M8-16q6 6 2 12" fill="none" stroke="#3FB35F" strokeWidth="7" strokeLinecap="round" />
      </g>
      {/* flame */}
      <path d="M128 222Q150 320 172 222Z" fill="#F59A2E" {...line} />
      <path d="M138 222Q150 282 162 222Z" fill="#FFD23F" />
      {/* fins */}
      <path d="M118 160 74 232 120 216Z" fill="#E5483B" {...line} />
      <path d="M182 160 226 232 180 216Z" fill="#E5483B" {...line} />
      {/* body */}
      <path d="M150 24C196 64 202 150 186 222H114C98 150 104 64 150 24Z" fill="#F5F0E6" {...line} />
      <path d="M150 24C170 40 182 58 188 82H112C118 58 130 40 150 24Z" fill="#E5483B" {...line} />
      <path d="M126 100q-6 50 2 104" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
      <circle cx="150" cy="128" r="25" fill="#F8C630" {...line} />
      <circle cx="150" cy="128" r="15" fill="#5CCBF5" {...thin} />
      <circle cx="145" cy="123" r="4" fill="#fff" />
      <rect x="112" y="200" width="76" height="22" rx="6" fill="#3A8DE6" {...line} />
      <path d="M150 160v40" stroke={INK} strokeWidth="3.5" />
    </g>
  );
}

export const PICTURES = [
  { id: "train", name: "the train", Scene: TrainScene },
  { id: "balloons", name: "the balloons", Scene: BalloonScene },
  { id: "fish", name: "the fish", Scene: FishScene },
  { id: "house", name: "the house", Scene: HouseScene },
  { id: "rocket", name: "the rocket", Scene: RocketScene },
];
