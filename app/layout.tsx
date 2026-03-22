import type { Metadata } from "next";
import { Righteous, Inter } from "next/font/google";
import "./globals.css";

const righteous = Righteous({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-righteous",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Where to Eat in OB 🌊",
  description: "Happy hours, daily deals, and good vibes in Ocean Beach, San Diego.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${righteous.variable} ${inter.variable}`}>
        {children}
      </body>
    </html>
  );
}
