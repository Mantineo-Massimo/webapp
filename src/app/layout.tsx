import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/components/NextAuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
  description: "Costruisci la tua squadra, scommetti sui tuoi Armoni e conquista la Classifica Generale delle associazioni Morgana e Orum.",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://fantapiazza.it"),
  openGraph: {
    title: "FantaPiazza | Il gioco d'arte delle associazioni Morgana e Orum",
    description: "Crea la tua squadra, scegli i tuoi Armoni e scala la classifica della Piazza!",
    url: "/",
    siteName: "FantaPiazza",
    images: [
      {
        url: "/fanta-logo.png",
        width: 1200,
        height: 630,
        alt: "FantaPiazza Logo",
      },
    ],
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FantaPiazza | Morgana e Orum",
    description: "Il Fantagioco dove l'Arte incontra la Piazza.",
    images: ["/fanta-logo.png"],
  },
  icons: {
    icon: [
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/favicon/apple-touch-icon.png",
    other: [
      { rel: "manifest", url: "/favicon/site.webmanifest" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-white min-h-screen relative overflow-x-hidden`}
      >
        {/* Animated Background Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-40 -left-64 w-[500px] h-[500px] bg-oro opacity-5 rounded-full blur-[100px] mix-blend-screen" />
          <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-viola opacity-[0.03] rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute -bottom-[10%] left-[20%] w-[400px] h-[400px] bg-ocra opacity-[0.04] rounded-full blur-[90px] mix-blend-screen" />
        </div>

        <NextAuthProvider>
          <div className="relative z-10 font-sans flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow">
              {children}
            </div>
            <Footer />
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
