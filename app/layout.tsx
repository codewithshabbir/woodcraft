import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

/* ---------------- FONTS ---------------- */

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/* ---------------- METADATA ---------------- */

export const metadata: Metadata = {
  metadataBase: new URL("https://woodcraft.local"), // change later to real domain

  title: {
    default: "Woodcraft",
    template: "%s | Woodcraft",
  },

  description:
    "Premium handcrafted wood products built with expert craftsmanship, durability, and timeless design.",

  applicationName: "Woodcraft",

  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#7a4a2e" },
    { media: "(prefers-color-scheme: dark)", color: "#cfa46a" },
  ],

  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};

/* ---------------- ROOT LAYOUT ---------------- */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={[
          geistSans.variable,
          geistMono.variable,
          "antialiased",
          "bg-background",
          "text-foreground",
        ].join(" ")}
      >
        {children}
      </body>
    </html>
  );
}
