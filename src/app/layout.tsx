import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/components/NextAuthProvider";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FantaPiazza | Morgana e Orum",
  description: "Costruisci la tua squadra, scommetti sui tuoi Armoni e conquista le leghe delle associazioni Morgana e Orum.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0f1c] text-white min-h-screen relative overflow-x-hidden`}
      >
        {/* Animated Background Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-40 -left-64 w-[500px] h-[500px] bg-oro opacity-5 rounded-full blur-[100px] mix-blend-screen" />
          <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-viola opacity-[0.03] rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute -bottom-[10%] left-[20%] w-[400px] h-[400px] bg-ocra opacity-[0.04] rounded-full blur-[90px] mix-blend-screen" />
        </div>

        <NextAuthProvider>
          <div className="relative z-10 font-sans">
            <Navbar />
            {children}
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
