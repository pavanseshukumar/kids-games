import { Fredoka } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: {
    default: "Play Time",
    template: "%s · Play Time",
  },
  description: "Simple, happy games for little ones.",
  applicationName: "Play Time",
  appleWebApp: {
    capable: true,
    title: "Play Time",
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#a96f3d",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fredoka.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
