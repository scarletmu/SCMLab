import type { Metadata } from "next";
import { DotGothic16, Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";

const dot = DotGothic16({
  variable: "--font-jp",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const press = Press_Start_2P({
  variable: "--font-en",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const vt = VT323({
  variable: "--font-mono",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ScarletMu · 8-bit Home",
  description: "Full-Stack Wanderer · vibe-coding · photography · itasha",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="zh-CN"
      className={`${dot.variable} ${press.variable} ${vt.variable}`}
    >
      <body className="pixel paper-bg">{children}</body>
    </html>
  );
}
