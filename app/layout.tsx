import type { Metadata } from "next";
import { VT323, Press_Start_2P } from "next/font/google";
import "./globals.css";

const vt323 = VT323({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-vt323",
});

const pressStart = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-press-start",
});

export const metadata: Metadata = {
  // Replace with your real deployed URL once Vercel assigns it.
  metadataBase: new URL("https://pixelemoji-delta.vercel.app/"),
  title: "PixelEmoji",
  description: "Turn any emoji into pixel art",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "PixelEmoji",
    description: "Turn any emoji into pixel art",
    url: "/",
    siteName: "PixelEmoji",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "PixelEmoji" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PixelEmoji",
    description: "Turn any emoji into pixel art",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${vt323.variable} ${pressStart.variable}`}>
        {children}
      </body>
    </html>
  );
}
