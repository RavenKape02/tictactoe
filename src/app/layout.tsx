import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tic-Tac-Toe · Raven Caduyac",
  description: "Two-player Tic-Tac-Toe on a wooden 3D board, built with Next.js, React 19 and React Three Fiber.",
};

export const viewport: Viewport = {
  themeColor: "#4a2c1a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${bricolage.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
