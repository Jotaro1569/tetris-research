import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/react';
// import { motion } from 'framer-motion'; // Removed framer-motion import
import AnimatedClientWrapper from '../components/AnimatedClientWrapper'; // Added import for the new client component
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: "Tetris Cognitive Study",
  description: "Challenge your focus with a gamified cognitive study based on Tetris",
  keywords: ["Tetris", "Cognitive Study", "Research", "Focus", "Game"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
      >
        <AnimatedClientWrapper> {/* Used the new client wrapper */}
          {children}
        </AnimatedClientWrapper>
        <Analytics />
      </body>
    </html>
  );
}
