"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiHome, FiAlertCircle } from "react-icons/fi";

export default function NotFound() {
    return (
        <main className="min-h-screen bg-[#0a0f1c] text-white flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-oro/5 blur-[120px] rounded-full pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10"
            >
                <div className="mb-10 text-oro drop-shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                    <motion.div
                        animate={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="inline-block"
                    >
                        <FiAlertCircle size={100} strokeWidth={1.5} />
                    </motion.div>
                </div>

                <h1 className="text-8xl md:text-[12rem] font-black text-white/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none tracking-tighter">
                    404
                </h1>

                <div className="relative">
                    <h2 className="text-3xl md:text-5xl font-black text-oro mb-6 tracking-tight drop-shadow-lg">
                        Pagina Svanita!
                    </h2>
                    <p className="text-gray-400 max-w-md mx-auto mb-12 text-lg leading-relaxed font-medium">
                        Sembra che l'artista che cercavi non sia sul palco. Forse ha preso un malus ed è stato squalificato dalla Piazza?
                    </p>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-br from-oro to-ocra text-blunotte font-black rounded-[2rem] hover:scale-105 transition-all shadow-[0_15px_40px_rgba(255,215,0,0.25)] group uppercase tracking-widest text-sm"
                    >
                        <FiHome size={20} className="group-hover:-translate-y-0.5 transition-transform" />
                        Torna in Piazza
                    </Link>
                </div>
            </motion.div>

            {/* Particle deco */}
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-oro rounded-full"
                    initial={{ opacity: 0, x: Math.random() * 1000 - 500, y: Math.random() * 1000 - 500 }}
                    animate={{ opacity: [0, 0.5, 0], y: "-=100" }}
                    transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: i * 0.5 }}
                />
            ))}
        </main>
    );
}
