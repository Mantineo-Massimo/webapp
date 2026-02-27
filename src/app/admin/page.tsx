"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

type Artist = {
    id: string;
    name: string;
    totalScore: number;
};



export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [artists, setArtists] = useState<Artist[]>([]);
    const [selectedArtistId, setSelectedArtistId] = useState("");
    const [points, setPoints] = useState<number | "">("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
        } else if (session?.user?.role !== "ADMIN" && status !== "loading") {
            router.push("/"); // Accesso negato
        }
    }, [status, session, router]);

    const loadArtists = () => {
        fetch("/api/artists")
            .then(res => res.json())
            .then(data => setArtists(data))
            .catch(err => console.error(err));
    };

    const [deadline, setDeadline] = useState<string>("");
    const [settingsLoading, setSettingsLoading] = useState(false);

    const loadSettings = () => {
        fetch("/api/settings")
            .then(res => res.json())
            .then(data => {
                if (data?.draftDeadline) {
                    // Convert ISO to datetime-local format: YYYY-MM-DDThh:mm
                    const date = new Date(data.draftDeadline);
                    const offset = date.getTimezoneOffset() * 60000;
                    const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0, 16);
                    setDeadline(localISOTime);
                }
            })
            .catch(err => console.error(err));
    };

    useEffect(() => {
        if (session?.user?.role === "ADMIN") {
            loadArtists();
            loadSettings();
        }
    }, [session]);

    const handleSaveSettings = async (e: React.FormEvent) => {
        e.preventDefault();
        setSettingsLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    draftDeadline: deadline ? new Date(deadline).toISOString() : null
                })
            });

            if (!res.ok) throw new Error("Errore salvataggio impostazioni");
            setSuccess("Impostazioni di sistema salvate con successo.");
            setTimeout(() => setSuccess(""), 4000);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Errore di rete.");
        } finally {
            setSettingsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedArtistId || points === "" || !description.trim()) {
            setError("Compila tutti i campi.");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/admin/bonus-malus", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    artistId: selectedArtistId,
                    points: Number(points),
                    description: description.trim()
                })
            });

            if (!res.ok) {
                throw new Error(await res.text() || "Errore durante l'operazione");
            }

            setSuccess(`Dati aggiornati con successo per ${Number(points)} punti.`);
            setPoints("");
            setDescription("");
            setSelectedArtistId("");
            loadArtists(); // Refresh the list to see new scores

            setTimeout(() => setSuccess(""), 4000);

        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Errore di rete.");
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading" || session?.user?.role !== "ADMIN") {
        return <div className="min-h-screen bg-blunotte flex items-center justify-center text-white">Verifica permessi in corso...</div>;
    }

    return (
        <main className="min-h-screen bg-blunotte text-white p-6 md:p-12 pt-48 md:pt-32 pb-32">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-red-500">Pannello <span className="text-white">Admin</span></h1>
                    <p className="text-gray-400">Gestisci il sistema, le scadenze e assegna Bonus/Malus.</p>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 bg-red-900/50 border border-red-500 text-red-200 rounded-xl">
                            {error}
                        </motion.div>
                    )}
                    {success && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 bg-green-900/50 border border-green-500 text-green-200 rounded-xl">
                            {success}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Impostazioni di Sistema */}
                <div className="bg-[#131d36] rounded-3xl p-8 border border-gray-800 shadow-2xl relative overflow-hidden">
                    <h2 className="text-2xl font-bold mb-6 border-b border-gray-800 pb-4">Impostazioni di Sistema</h2>
                    <form onSubmit={handleSaveSettings} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Scadenza Iscrizioni (Draft Deadline)</label>
                            <input
                                type="datetime-local"
                                value={deadline}
                                onChange={e => setDeadline(e.target.value)}
                                className="w-full bg-[#0a0f1c] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                            />
                            <p className="text-xs text-gray-500 mt-2">Lascia vuoto per non avere scadenze. Oltre questa data, la creazione di nuove squadre sarà bloccata.</p>
                        </div>
                        <button
                            type="submit"
                            disabled={settingsLoading}
                            className="px-6 py-3 text-white font-bold rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors border border-gray-600 disabled:opacity-50"
                        >
                            {settingsLoading ? "Salvataggio..." : "Salva Impostazioni"}
                        </button>
                    </form>
                </div>

                {/* Eventi Bonus/Malus */}
                <div className="bg-[#131d36] rounded-3xl p-8 border border-gray-800 shadow-2xl relative overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-900 opacity-20 rounded-full blur-3xl"></div>
                    <h2 className="text-2xl font-bold mb-6 border-b border-gray-800 pb-4 relative z-10">Assegna Bonus o Malus</h2>

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        {/* Selezione Artista */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Seleziona Artista</label>
                            <select
                                value={selectedArtistId}
                                onChange={e => setSelectedArtistId(e.target.value)}
                                className="w-full bg-[#0a0f1c] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors appearance-none"
                            >
                                <option value="" disabled>-- Scegli un artista --</option>
                                {artists.map(a => (
                                    <option key={a.id} value={a.id}>{a.name} (T.Score: {a.totalScore})</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Punti (Bonus/Malus) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Punteggio (+ o -)</label>
                                <input
                                    type="number"
                                    value={points}
                                    onChange={e => setPoints(e.target.value ? Number(e.target.value) : "")}
                                    placeholder="es. 10 oppure -5"
                                    className="w-full bg-[#0a0f1c] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                                />
                            </div>

                            {/* Descrizione (Motivazione) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Motivazione</label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    placeholder="es. Bacio su labbra (Bonus) / Caduta (Malus)"
                                    className="w-full bg-[#0a0f1c] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                                    maxLength={100}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 text-white font-bold text-lg rounded-xl bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)] disabled:opacity-50"
                        >
                            {loading ? "Applicazione in corso..." : "Esegui Evento"}
                        </button>
                    </form>

                </div>
            </div>
        </main>
    );
}
