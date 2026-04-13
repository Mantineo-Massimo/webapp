"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import CountdownTimer from "@/components/CountdownTimer";
import { useSession } from "next-auth/react";
import SponsorMarquee from "@/components/SponsorMarquee";
import NewsSection from "@/components/NewsSection";
import HowToPlay from "@/components/HowToPlay";
import { motion, useScroll, useTransform } from "framer-motion";
import { FiChevronDown, FiPlay, FiAward } from "react-icons/fi";

export default function Home() {
  const { data: session } = useSession();
  const [deadline, setDeadline] = useState<string | null>(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data?.draftDeadline) setDeadline(new Date(data.draftDeadline).toISOString());
      })
      .catch(err => console.error(err));
  }, []);

  const isDeadlinePassed = deadline && new Date() > new Date(deadline);

  return (
    <main className="min-h-screen bg-blunotte selection:bg-oro/30 selection:text-white">
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
        {/* Animated Orbs for depth */}
        <div className="absolute top-[20%] left-[-5%] w-[40%] h-[40%] bg-viola/20 rounded-full blur-[150px] animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-[20%] right-[-5%] w-[40%] h-[40%] bg-oro/10 rounded-full blur-[150px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>

        <motion.div 
          style={{ y: y1 }}
          className="relative z-10 w-full max-w-7xl px-6 flex flex-col items-center text-center space-y-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-oro/20 blur-[100px] rounded-full scale-150 opacity-40 animate-pulse"></div>
            <Image
              src="/fanta-logo.png"
              alt="FantaPiazza Logo"
              width={800}
              height={300}
              className="w-full max-w-3xl mx-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] glow-oro group-hover:scale-105 transition-transform duration-700"
              priority
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="text-xl md:text-3xl font-light tracking-[0.2em] text-white/60 uppercase">
              La Piazza dell&apos;Arte ti aspetta
            </h1>
            <p className="text-lg md:text-2xl text-gray-400 max-w-3xl leading-relaxed italic mx-auto font-light">
              &quot;Dove l&apos;Arte incontra il gioco. Costruisci il tuo team vincente e domina le leghe di Morgana e Orum.&quot;
            </p>
          </motion.div>

          {deadline && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="glass px-10 py-8 rounded-[3rem] border-white/5 shadow-2xl relative"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-oro text-blunotte text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">
                Chiusura Mercato
              </div>
              <CountdownTimer targetDate={deadline} />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 pt-10 items-center justify-center w-full"
          >
            {session ? (
              <>
                <Link
                  href="/team/create"
                  className={`group relative overflow-hidden px-12 py-5 rounded-2xl font-black text-xl flex items-center gap-3 transition-all ${
                    isDeadlinePassed
                      ? "bg-white/5 text-white/40 border border-white/10 cursor-not-allowed"
                      : "bg-gradient-to-r from-oro to-ocra text-blunotte shadow-[0_20px_40px_rgba(255,215,0,0.2)] hover:shadow-[0_25px_60px_rgba(255,215,0,0.3)] hover:-translate-y-1"
                  }`}
                >
                  <FiPlay className="group-hover:translate-x-1 transition-transform" />
                  La Mia Squadra
                </Link>
                <Link
                  href="/leaderboards"
                  className="px-12 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xl flex items-center gap-3 hover:bg-white/10 transition-all hover:-translate-y-1"
                >
                  <FiAward className="text-oro" />
                  Ranking
                </Link>
              </>
            ) : (
              <>
                {!isDeadlinePassed ? (
                  <>
                    <Link
                      href="/auth/register"
                      className="group relative overflow-hidden px-12 py-5 rounded-2xl bg-gradient-to-r from-oro to-ocra text-blunotte font-black text-xl shadow-[0_20px_40px_rgba(255,215,0,0.2)] hover:shadow-[0_25px_60px_rgba(255,215,0,0.3)] hover:-translate-y-1 transition-all"
                    >
                      Partecipa Ora
                    </Link>
                    <Link
                      href="/auth/login"
                      className="px-12 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xl hover:bg-white/10 transition-all hover:-translate-y-1"
                    >
                      Accedi
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/leaderboards"
                    className="px-12 py-5 rounded-2xl bg-gradient-to-r from-oro to-ocra text-blunotte font-black text-xl shadow-[0_20px_40px_rgba(255,215,0,0.2)] hover:shadow-[0_25px_60px_rgba(255,215,0,0.3)] hover:-translate-y-1"
                  >
                    Vedi Risultati
                  </Link>
                )}
              </>
            )}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
           animate={{ y: [0, 15, 0] }}
           transition={{ repeat: Infinity, duration: 2.5 }}
           className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-500 flex flex-col items-center gap-2 cursor-pointer"
           onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span className="text-[10px] font-black uppercase tracking-[0.3em] ml-1">Esplora</span>
          <FiChevronDown size={24} />
        </motion.div>
      </section>

      {/* --- CONTENT SECTIONS --- */}
      <div className="relative z-10 space-y-32 pb-32">
        <section className="w-full">
           <HowToPlay />
        </section>

        <section className="w-full max-w-7xl mx-auto px-6">
           <div className="glass p-12 rounded-[3.5rem] border-white/5 overflow-hidden">
             <NewsSection />
           </div>
        </section>

        <section className="w-full">
           <div className="py-20 bg-white/[0.02] border-y border-white/5">
             <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-black uppercase tracking-tight">I Nostri <span className="text-oro">Sponsor</span></h2>
                </div>
                <SponsorMarquee />
             </div>
           </div>
        </section>
      </div>
    </main>
  );
}
