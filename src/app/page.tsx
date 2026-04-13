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
import { FiChevronDown, FiPlay, FiAward, FiExternalLink } from "react-icons/fi";

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
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-40">
        {/* Animated Orbs for depth */}
        <div className="absolute top-[20%] left-[-5%] w-[40%] h-[40%] bg-viola/20 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-[20%] right-[-5%] w-[40%] h-[40%] bg-oro/10 rounded-full blur-[150px] pointer-events-none"></div>

        <motion.div 
          style={{ y: y1 }}
          className="relative z-10 w-full max-w-7xl px-6 flex flex-col items-center text-center space-y-6 md:space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-oro/20 blur-[100px] rounded-full scale-150 opacity-40"></div>
            <Image
              src="/fanta-logo.png"
              alt="FantaPiazza Logo"
              width={500}
              height={180}
              className="w-full max-w-[280px] md:max-w-md lg:max-w-lg mx-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] glow-oro transition-transform duration-700"
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
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-oro text-blunotte text-[9px] font-black px-3 py-0.5 rounded-full uppercase tracking-widest shadow-lg">
                Chiusura Mercato
              </div>
              <CountdownTimer targetDate={deadline} />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-3 pt-4 items-center justify-center w-full"
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
                  className="px-10 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-lg flex items-center gap-3 hover:bg-white/10 transition-all hover:-translate-y-1"
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
                      className="group relative px-10 py-4 rounded-2xl bg-gradient-to-r from-oro to-ocra text-blunotte font-black text-lg shadow-[0_20px_40px_rgba(255,215,0,0.2)] hover:shadow-[0_25px_60px_rgba(255,215,0,0.3)] hover:-translate-y-1 transition-all"
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
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="relative overflow-hidden group rounded-[4rem] border border-white/5 bg-gradient-to-br from-[#00A88E]/10 via-blunotte to-[#F9A01C]/5 transition-all duration-700 hover:border-[#F9A01C]/20"
           >
             {/* Decorative Background Elements */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#00A88E]/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F9A01C]/5 rounded-full blur-[100px] -ml-32 -mb-32"></div>
             
             <div className="relative z-10 p-10 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12">
               <div className="flex-shrink-0 w-full max-w-[280px] md:max-w-sm drop-shadow-[0_0_30px_rgba(0,168,142,0.3)]">
                  <Image 
                    src="/piazzadellarte.webp" 
                    alt="Piazza dell'Arte Logo" 
                    width={500} 
                    height={300} 
                    className="w-full h-auto object-contain transition-transform duration-700"
                  />
               </div>

               <div className="flex-grow space-y-8 text-center lg:text-left">
                 <div className="space-y-4">
                   <span className="text-[#00A88E] font-black uppercase tracking-[0.5em] text-[10px]">Partner Istituzionale</span>
                   <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-tight text-white">
                      Piazza dell&apos;<span className="text-[#F9A01C]">Arte</span>
                   </h2>
                   <p className="text-gray-400 max-w-xl text-lg md:text-xl font-light leading-relaxed italic">
                     &quot;Il cuore pulsante della creatività studentesca.&quot;
                   </p>
                 </div>
                 
                 <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                    <Link 
                      href="https://morganaorum.vercel.app/it/network/piazzadellarte"
                      target="_blank"
                      className="px-10 py-5 bg-[#F9A01C] text-blunotte font-black rounded-2xl hover:bg-[#FFD100] transition-all flex items-center gap-3 hover:-translate-y-1 shadow-[0_10px_30px_rgba(249,160,28,0.3)] uppercase tracking-widest text-xs"
                    >
                      Scopri il Network <FiExternalLink size={18} />
                    </Link>
                    <span className="text-white/20 font-black uppercase tracking-widest text-[9px] hidden sm:block">morgana & o.r.u.m.</span>
                 </div>
               </div>
             </div>
           </motion.div>
        </section>

        {/* Riga decorativa stilizzata */}
        <section className="w-full">
           <div className="flex items-center gap-8 justify-center overflow-hidden">
             <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
             <div className="flex-shrink-0 w-3 h-3 rounded-full border border-oro/40 animate-pulse"></div>
             <div className="h-[1px] w-full bg-gradient-to-l from-transparent via-white/10 to-transparent"></div>
           </div>
        </section>

        <section className="w-full">
           <div className="py-24 bg-white/[0.02] border-y border-white/5 relative overflow-hidden">
             {/* Background glow per gli sponsor */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-full bg-oro/[0.02] blur-[120px] pointer-events-none"></div>
             
             <div className="w-full">
                <div className="text-center mb-20 px-6">
                  <span className="text-oro font-black uppercase tracking-[0.3em] text-[10px] block mb-4">I Nostri Alleati</span>
                  <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight">I Nostri <span className="text-oro">Sponsor</span></h2>
                </div>
                <SponsorMarquee />
             </div>
           </div>
        </section>
      </div>
    </main>
  );
}
