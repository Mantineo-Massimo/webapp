"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiCheck, FiX, FiActivity } from "react-icons/fi";

export default function AccountPage() {
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [profile, setProfile] = useState({
        name: "",
        email: ""
    });

    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    useEffect(() => {
        fetch("/api/user/profile")
            .then(res => res.json())
            .then(data => {
                setProfile({
                    name: data.name || "",
                    email: data.email
                });
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: profile.name,
                    email: profile.email
                })
            });

            if (!res.ok) {
                throw new Error(await res.text() || "Errore durante l'aggiornamento");
            }

            // Update session
            await update({ name: profile.name });

            setSuccess("Profilo aggiornato con successo!");
            setTimeout(() => setSuccess(""), 4000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            setError("Le password non coincidono");
            return;
        }

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: passwords.currentPassword,
                    newPassword: passwords.newPassword
                })
            });

            if (!res.ok) {
                throw new Error(await res.text() || "Errore durante il cambio password");
            }

            setSuccess("Password cambiata con successo!");
            setPasswords({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
            setTimeout(() => setSuccess(""), 4000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-oro/20 border-t-oro rounded-full animate-spin"></div>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Caricamento Account...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen text-white p-6 md:p-12 pt-56 md:pt-44 pb-32">
            <div className="max-w-4xl mx-auto">

                <header className="mb-12 text-center md:text-left">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
                        Il tuo <span className="text-oro drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]">Account</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl">
                        Gestisci le tue informazioni personali e le credenziali di accesso.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Profile Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#131d36]/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-800 shadow-2xl space-y-8"
                    >
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <FiUser className="text-oro" /> Informazioni Personali
                        </h2>

                        <form onSubmit={handleProfileUpdate} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nome Completo</label>
                                <div className="relative">
                                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={e => setProfile({ ...profile, name: e.target.value })}
                                        placeholder="Il tuo nome..."
                                        className="w-full bg-[#0a0f1c] border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-oro transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email</label>
                                <div className="relative">
                                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={e => setProfile({ ...profile, email: e.target.value })}
                                        className="w-full bg-[#0a0f1c] border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-oro transition-colors"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full py-4 bg-gradient-to-r from-oro to-ocra text-blunotte font-black rounded-2xl transform active:scale-95 transition-all shadow-lg hover:shadow-oro/20 disabled:opacity-50 uppercase tracking-widest"
                            >
                                {saving ? "Salvataggio..." : "Aggiorna Profilo"}
                            </button>
                        </form>
                    </motion.section>

                    {/* Password Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-[#131d36]/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-800 shadow-2xl space-y-8"
                    >
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <FiLock className="text-oro" /> Sicurezza & Password
                        </h2>

                        <form onSubmit={handlePasswordUpdate} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Password Corrente</label>
                                <div className="relative">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                    <input
                                        type="password"
                                        value={passwords.currentPassword}
                                        onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                        placeholder="••••••••"
                                        className="w-full bg-[#0a0f1c] border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-oro transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 pt-4">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nuova Password</label>
                                <div className="relative">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                    <input
                                        type="password"
                                        value={passwords.newPassword}
                                        onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                                        placeholder="Nuova password..."
                                        className="w-full bg-[#0a0f1c] border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-oro transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <input
                                    type="password"
                                    value={passwords.confirmPassword}
                                    onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                    placeholder="Conferma nuova password..."
                                    className="w-full bg-[#0a0f1c] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-oro transition-colors"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full py-4 bg-gray-800 hover:bg-gray-700 text-white font-black rounded-2xl transform active:scale-95 transition-all border border-gray-600 disabled:opacity-50 uppercase tracking-widest"
                            >
                                {saving ? "Modifica..." : "Cambia Password"}
                            </button>
                        </form>
                    </motion.section>
                </div>

                {/* Status Messages */}
                <div className="mt-8">
                    {error && (
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-4 bg-red-900/40 border border-red-500 text-red-200 rounded-2xl flex items-center gap-3">
                            <FiX size={20} className="shrink-0" />
                            {error}
                        </motion.div>
                    )}
                    {success && (
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-4 bg-green-900/40 border border-green-500 text-green-200 rounded-2xl flex items-center gap-3">
                            <FiCheck size={20} className="shrink-0" />
                            {success}
                        </motion.div>
                    )}
                </div>

            </div>
        </main>
    );
}
