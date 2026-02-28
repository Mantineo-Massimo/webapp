"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { FiRefreshCw, FiHome, FiSettings } from "react-icons/fi";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <main className="min-h-screen bg-[#0a0f1c] text-white flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 blur-[150px] rounded-full pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10"
            >
                <div className="relative mb-10">
                    <div className="w-24 h-24 bg-red-500/10 border-2 border-red-500/30 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        >
                            <FiRefreshCw size={40} className="text-red-500" />
                        </motion.div>
                    </div>
                    {/* Pulsing ring */}
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 border-2 border-red-500/20 rounded-[2.5rem] -m-2"
                    />
                </div>

                <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-white drop-shadow-md">
                    C'è stato un corto circuito!
                </h1>
                <p className="text-gray-400 max-w-md mx-auto mb-12 text-lg leading-relaxed font-medium">
                    Un errore tecnico ha interrotto lo spettacolo della Piazza. Forse un ampli è esploso? Stiamo sistemando i cavi!
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={() => reset()}
                        className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-3 group uppercase tracking-widest text-xs"
                    >
                        <FiRefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                        Ricarica Palco
                    </button>
                    <Link
                        href="/"
                        className="w-full sm:w-auto px-10 py-5 bg-gradient-to-br from-oro to-ocra text-blunotte font-black rounded-2xl transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(255,215,0,0.2)] hover:scale-105 uppercase tracking-widest text-sm"
                    >
                        <FiHome size={18} />
                        Torna alla Home
                    </Link>
                </div>

                <div className="mt-16 pt-8 border-t border-white/5">
                    <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.4em]">Codice Errore: {error.digest || 'FP-CRITICAL'}</p>
                </div>
            </motion.div>
        </main>
    );
}
