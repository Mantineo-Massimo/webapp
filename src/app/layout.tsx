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
  title: {
    default: "FantaPiazza | Il Fantagioco delle Associazioni Morgana e Orum",
    template: "%s | FantaPiazza"
  },
  description: "Crea la tua squadra, scegli i tuoi Armoni e scala la classifica della Piazza! Il primo Fantagioco d'arte promosso dalle associazioni Morgana e Orum.",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://fantapiazza.it"),
  openGraph: {
    title: "FantaPiazza | Morgana e Orum",
    description: "La competizione artistica più attesa di Messina. Costruisci il tuo team vincente!",
    url: "https://fantapiazza.it",
    siteName: "FantaPiazza",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FantaPiazza - Arte e Passione",
      },
    ],
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FantaPiazza | Il Gioco della Piazza",
    description: "Sostieni i tuoi artisti preferiti e vinci premi culturali.",
    images: ["/og-image.png"],
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
    <html lang="it" className="dark scroll-smooth">
      <body className="antialiased selection:bg-oro/30 selection:text-white">
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
