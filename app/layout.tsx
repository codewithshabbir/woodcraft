import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#7a4a2e",
};

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),

  title: {
    default: "Woodcraft",
    template: "%s | Woodcraft",
  },

  description: "Woodcraft management system",

  applicationName: "Woodcraft",

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-background text-foreground">{children}</body>
    </html>
  );
}
