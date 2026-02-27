"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

import Image from "next/image";

export default function RegisterPage() {
    const router = useRouter();
    const [data, setData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const registerUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            router.push("/auth/login");
        } else {
            const msg = await response.text();
            setError(msg || "Errore durante la registrazione.");
        }
    };

    return (
        <main className="min-h-screen bg-blunotte text-white flex flex-col items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-[#131d36] rounded-3xl p-8 border border-gray-800 shadow-2xl relative overflow-hidden"
            >
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-viola opacity-20 rounded-full blur-3xl"></div>

                <div className="flex justify-center mb-6">
                    <Image
                        src="/fanta-logo.png"
                        alt="FantaPiazza Logo"
                        width={200}
                        height={80}
                        className="h-16 w-auto object-contain drop-shadow-[0_0_10px_rgba(139,92,246,0.2)]"
                    />
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black tracking-tight mb-2">Registrati</h1>
                    <p className="text-gray-400">Unisciti alle leghe di Morgana e Orum.</p>
                </div>

                <form onSubmit={registerUser} className="space-y-6 relative z-10">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                            className="w-full bg-[#0a0f1c] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-viola focus:ring-1 focus:ring-viola transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                            className="w-full bg-[#0a0f1c] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-viola focus:ring-1 focus:ring-viola transition-all"
                            required
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <button
                        type="submit"
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-viola to-purple-500 text-white font-bold text-lg hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(88,28,135,0.4)] mt-4"
                    >
                        Crea Account
                    </button>
                </form>

                <p className="text-center text-gray-400 mt-8 text-sm">
                    Hai già un account?{" "}
                    <Link href="/auth/login" className="text-viola font-semibold hover:text-purple-400 hover:underline transition-colors">
                        Accedi
                    </Link>
                </p>
            </motion.div>
        </main>
    );
}
