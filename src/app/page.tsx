"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import CountdownTimer from "@/components/CountdownTimer";
import { useSession } from "next-auth/react";
import SponsorMarquee from "@/components/SponsorMarquee";
import NewsSection from "@/components/NewsSection";
import HowToPlay from "@/components/HowToPlay";
import { motion } from "framer-motion";

export default function Home() {
  const { data: session } = useSession();
  const [deadline, setDeadline] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data?.draftDeadline) setDeadline(new Date(data.draftDeadline).toISOString());
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <main className="min-h-screen text-white flex flex-col pt-56 md:pt-44 items-center">

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full px-6 flex flex-col items-center justify-center text-center max-w-5xl space-y-8"
      >
        <div className="relative inline-block mt-8 mb-4">
          <Image
            src="/fanta-logo.png"
            alt="FantaPiazza Logo"
            width={800}
            height={300}
            className="w-full max-w-4xl mx-auto drop-shadow-[0_0_30px_rgba(255,215,0,0.4)]"
            priority
          />
        </div>

        <p className="text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed italic mt-6">
          &quot;Dove l&apos;Arte incontra il gioco. Due associazioni, un&apos;unica grande piazza.
          Costruisci la tua squadra dei sogni, scommetti sui tuoi Armoni, e conquista le leghe
          di Morgana e Orum.&quot;
        </p>

        {deadline && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-8 mb-4 w-full flex justify-center"
          >
            <CountdownTimer targetDate={deadline} />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 pt-6"
        >
          {session ? (
            <>
              <Link
                href="/team/create"
                className="px-8 py-3 rounded-full bg-oro text-blunotte font-bold text-lg hover:bg-yellow-300 transition-all shadow-[0_0_15px_rgba(255,215,0,0.5)] transform hover:scale-105"
              >
                La mia Squadra
              </Link>
              <Link
                href="/leaderboards"
                className="px-8 py-3 rounded-full bg-viola text-white font-bold text-lg hover:bg-purple-800 transition-all border border-purple-500 shadow-[0_0_15px_rgba(88,28,135,0.4)] transform hover:scale-105"
              >
                Classifica
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth/register"
                className="px-8 py-3 rounded-full bg-oro text-blunotte font-bold text-lg hover:bg-yellow-300 transition-all shadow-[0_0_15px_rgba(255,215,0,0.5)] transform hover:scale-105"
              >
                Inizia l&apos;Avventura
              </Link>
              <Link
                href="/auth/login"
                className="px-8 py-3 rounded-full bg-viola text-white font-bold text-lg hover:bg-purple-800 transition-all border border-purple-500 shadow-[0_0_15px_rgba(88,28,135,0.4)] transform hover:scale-105"
              >
                Accedi
              </Link>
            </>
          )}
        </motion.div>
      </motion.section>

      {/* How To Play Section */}
      <div className="w-full mt-32">
        <HowToPlay />
      </div>

      {/* News Section */}
      <div className="w-full">
        <NewsSection />
      </div>

      {/* Sponsor Marquee */}
      <div className="w-full mt-12 mb-24">
        <SponsorMarquee />
      </div>

    </main>
  );
}
