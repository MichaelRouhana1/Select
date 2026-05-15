import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

/** Condensed display sans — closest free match to Skill-Capped / LoL heading tone */
const display = Oswald({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Picker Tier Lists",
    default: "Picker Tier Lists",
  },
  description:
    "LoL tier lists styled like Skill-Capped for study and drafting — snapshot-driven data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full overflow-x-hidden antialiased">
      <body
        className={`${inter.variable} ${display.variable} min-h-full overflow-x-hidden bg-[#0b0e13] font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
