export default function manifest() {
  return {
    name: "Play Time",
    short_name: "Play Time",
    description: "Simple, happy games for little ones.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#a96f3d",
    theme_color: "#a96f3d",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
