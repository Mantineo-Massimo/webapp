"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { FiMail, FiLock, FiLogIn, FiArrowLeft } from "react-icons/fi";

export default function LoginPage() {
    const router = useRouter();
    const [data, setData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const { searchParams } = new URL(typeof window !== "undefined" ? window.location.href : "http://localhost");
    const isVerified = searchParams.get("verified") === "true";

    const loginUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const response = await signIn("credentials", {
            ...data,
            redirect: false,
        });

        if (response?.error) {
            setError(response.error === "Email non verificata. Controlla la tua casella di posta." 
                ? response.error 
                : "Credenziali non valide.");
        } else {
            router.push("/");
        }
    };

    return (
        <main className="min-h-screen bg-blunotte text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Aesthetic */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-viola/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-oro/5 rounded-full blur-[120px] pointer-events-none"></div>

            <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-white/40 hover:text-oro transition-colors group z-20">
                <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Torna alla Piazza</span>
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-md glass rounded-[3rem] p-10 border-white/5 shadow-3xl relative z-10"
            >
                <div className="flex flex-col items-center text-center space-y-6 mb-12">
                    <motion.div 
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="relative"
                    >
                        <Image
                            src="/fanta-logo.png"
                            alt="FantaPiazza Logo"
                            width={180}
                            height={60}
                            className="h-12 w-auto object-contain glow-oro"
                        />
                    </motion.div>
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter">Bentornato</h1>
                        <p className="text-gray-500 font-light text-sm">Accedi per gestire il tuo roster d&apos;elite.</p>
                    </div>
                </div>

                {isVerified && !error && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-8 p-4 bg-oro/10 border border-oro/20 text-oro rounded-2xl text-center text-xs font-black uppercase tracking-widest"
                    >
                        ✨ Email verificata! Puoi accedere.
                    </motion.div>
                )}

                <form onSubmit={loginUser} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-4 flex items-center gap-2">
                            <FiMail /> Mail d&apos;Artista
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-oro transition-all placeholder:text-white/10 font-medium"
                            placeholder="mario@rossi.it"
                            required
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-4 mr-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                                <FiLock /> Chiave d&apos;Accesso
                            </label>
                            <Link href="/auth/forgot-password" className="text-[10px] text-gray-600 hover:text-oro transition-colors font-black uppercase tracking-widest">
                                Dimenticata?
                            </Link>
                        </div>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-oro transition-all placeholder:text-white/10 font-medium"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-400 text-xs text-center font-black uppercase tracking-widest bg-red-400/10 py-3 rounded-2xl border border-red-400/20"
                        >
                            {error}
                        </motion.p>
                    )}

                    <button
                        type="submit"
                        className="w-full py-5 rounded-[2rem] bg-gradient-to-r from-oro to-ocra text-blunotte font-black text-xl uppercase tracking-widest shadow-2xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                        <FiLogIn /> Entra in Piazza
                    </button>
                </form>

                <div className="mt-12 pt-8 border-t border-white/5 text-center space-y-4">
                    <p className="text-gray-500 font-light text-sm">
                        Ancora nessun team? <br />
                        <Link href="/auth/register" className="text-oro font-black uppercase tracking-widest text-xs hover:underline mt-2 inline-block">
                            Crea il tuo profilo ora
                        </Link>
                    </p>
                </div>
            </motion.div>
        </main>
    );
}
