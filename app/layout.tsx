import type { Metadata } from "next";
import { Pacifico, Inter } from "next/font/google";
import "./globals.css";

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pacifico",
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
      <body className={`${pacifico.variable} ${inter.variable} font-inter bg-sand-50`}>
        {children}
      </body>
    </html>
  );
}
