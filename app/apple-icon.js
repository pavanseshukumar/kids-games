import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Home-screen icon: a face-down card and a heart card on green felt.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 50% 35%, #2f8452, #1d5e38)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 34,
            top: 44,
            width: 66,
            height: 88,
            borderRadius: 10,
            border: "6px solid #fffaf0",
            background: "linear-gradient(135deg, #ea5f53, #b42e27)",
            transform: "rotate(-12deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 40,
            width: 66,
            height: 88,
            borderRadius: 10,
            background: "#fffaf0",
            transform: "rotate(10deg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="44" height="40" viewBox="0 0 64 58">
            <path
              d="M32 54C14 42 4 32 4 20 4 11 11 4 19 4c6 0 10 3 13 8 3-5 7-8 13-8 8 0 15 7 15 16 0 12-10 22-28 34Z"
              fill="#f2709c"
              stroke="#3d2a1e"
              strokeWidth="5"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    ),
    size
  );
}
