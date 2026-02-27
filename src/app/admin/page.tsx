"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

type Artist = {
    id: string;
    name: string;
    cost: number;
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

    // Artist Management State
    const [newName, setNewName] = useState("");
    const [newCost, setNewCost] = useState<number | "">("");
    const [artistLoading, setArtistLoading] = useState(false);

    // Events Management State
    const [events, setEvents] = useState<any[]>([]);
    const [eventsLoading, setEventsLoading] = useState(false);

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

    const loadEvents = () => {
        setEventsLoading(true);
        fetch("/api/admin/bonus-malus")
            .then(res => res.json())
            .then(data => setEvents(data))
            .catch(err => console.error(err))
            .finally(() => setEventsLoading(false));
    };

    useEffect(() => {
        if (session?.user?.role === "ADMIN") {
            loadArtists();
            loadSettings();
            loadEvents();
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

    const handleAddArtist = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName || newCost === "") return;

        setArtistLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/admin/artists", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName, cost: newCost })
            });

            if (!res.ok) throw new Error("Errore durante l'aggiunta dell'artista");

            setSuccess(`Artista ${newName} aggiunto con successo.`);
            setNewName("");
            setNewCost("");
            loadArtists();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setArtistLoading(false);
        }
    };

    const handleDeleteArtist = async (id: string, name: string) => {
        if (!confirm(`Sei sicuro di voler eliminare l'artista "${name}"? Questa azione è irreversibile.`)) return;

        setArtistLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch(`/api/admin/artists?id=${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Errore durante l'eliminazione");

            setSuccess(`Artista "${name}" eliminato.`);
            loadArtists();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setArtistLoading(false);
        }
    };

    // Bonus/Malus Predefiniti dal Regolamento
    const predefinedRules = [
        { title: "-- Scegli un bonus/malus dal regolamento --", points: 0 },
        { title: "A cappella", points: 15 },
        { title: "L'Acuto Spezza-Cristalli", points: 10 },
        { title: "Standing Ovation", points: 20 },
        { title: "Pelle d'Oca", points: 10 },
        { title: "Dedicato a te", points: 5 },
        { title: "Microfono a giraffa", points: 5 },
        { title: "Il Batti le mani", points: 5 },
        { title: "Vocalizzo selvaggio", points: 10 },
        { title: "Spaccata Improvvisa", points: 15 },
        { title: "Presa Acrobatica", points: 15 },
        { title: "Sincro Perfetto", points: 10 },
        { title: "Polvere di Fata", points: 10 },
        { title: "Oggetto di Scena", points: 10 },
        { title: "Coreografia in Platea", points: 15 },
        { title: "Assolo Infuocato", points: 10 },
        { title: "Mantello del Mistero", points: 10 },
        { title: "Trasformismo", points: 20 },
        { title: "Patto con l'Admin", points: 10 },
        { title: "Dab con Parisi", points: 5 },
        { title: "Il Simbolo Segreto", points: 15 },
        { title: "Pioggia d'Applausi", points: 30 },
        { title: "Incursione Animale", points: 50 },
        { title: "Parenti Serpenti", points: 15 },
        { title: "Il Bis", points: 10 },
        { title: "Regalo dal Pubblico", points: 10 },
        { title: "Nudo ma non Crudo", points: -20 },
        { title: "Caduta del Microfono", points: -10 },
        { title: "Audio Fantasma", points: -15 },
        { title: "Gelo in Piazza", points: -10 },
        { title: "Autogol", points: -10 },
        { title: "L'Orologio", points: -10 },
        { title: "Polemica in Diretta", points: -20 },
        { title: "Il Fuori Tempo", points: -5 },
        { title: "Vittoria Assoluta", points: 50 },
        { title: "Ultimo Posto", points: 10 },
    ];

    const [selectedPredefined, setSelectedPredefined] = useState("");

    const handlePredefinedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const title = e.target.value;
        setSelectedPredefined(title);
        const rule = predefinedRules.find(r => r.title === title);
        if (rule && title !== predefinedRules[0].title) {
            setPoints(rule.points);
            setDescription(rule.title);
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

            setSuccess(`Punteggio aggiornato per l'artista.`);
            setPoints("");
            setDescription("");
            setSelectedArtistId("");
            setSelectedPredefined("");
            loadArtists();
            loadEvents();

            setTimeout(() => setSuccess(""), 4000);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEvent = async (id: string) => {
        if (!confirm("Sei sicuro di voler annullare questo bonus/malus? I punteggi verranno ricalcolati automaticamente.")) return;

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch(`/api/admin/bonus-malus?id=${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Errore durante l'eliminazione dell'evento");

            setSuccess("Evento annullato e punteggi ricalcolati.");
            loadArtists();
            loadEvents();
        } catch (err: any) {
            setError(err.message);
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

                <div className="bg-[#131d36] rounded-3xl p-8 border border-gray-800 shadow-2xl relative overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-oro opacity-10 rounded-full blur-3xl"></div>
                    <h2 className="text-2xl font-bold mb-6 border-b border-gray-800 pb-4 relative z-10">Gestione Artisti</h2>

                    {/* Form Add Artist */}
                    <form onSubmit={handleAddArtist} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 relative z-10">
                        <input
                            type="text"
                            placeholder="Nome Artista"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            className="bg-[#0a0f1c] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-oro transition-colors"
                        />
                        <input
                            type="number"
                            placeholder="Costo (Armoni)"
                            value={newCost}
                            onChange={e => setNewCost(e.target.value ? Number(e.target.value) : "")}
                            className="bg-[#0a0f1c] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-oro transition-colors"
                        />
                        <button
                            type="submit"
                            disabled={artistLoading}
                            className="py-3 text-blunotte font-bold rounded-xl bg-oro hover:opacity-90 transition-all disabled:opacity-50"
                        >
                            {artistLoading ? "Aggiunta..." : "Aggiungi Artista"}
                        </button>
                    </form>

                    {/* Artists List */}
                    <div className="relative z-10 overflow-x-auto max-h-96 custom-scrollbar">
                        <table className="w-full text-left">
                            <thead className="text-gray-400 border-b border-gray-800">
                                <tr>
                                    <th className="py-3 px-4">Nome</th>
                                    <th className="py-3 px-4">Costo</th>
                                    <th className="py-3 px-4">Score</th>
                                    <th className="py-3 px-4 text-right">Azioni</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {artists.map(a => (
                                    <tr key={a.id} className="hover:bg-white/5 transition-colors">
                                        <td className="py-3 px-4 font-bold">{a.name}</td>
                                        <td className="py-3 px-4 text-oro font-mono">{a.cost}</td>
                                        <td className="py-3 px-4 font-mono">{a.totalScore}</td>
                                        <td className="py-3 px-4 text-right">
                                            <button
                                                onClick={() => handleDeleteArtist(a.id, a.name)}
                                                className="text-red-500 hover:text-red-400 p-2 transition-colors"
                                                title="Elimina Artista"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Eventi Bonus/Malus */}
                <div className="bg-[#131d36] rounded-3xl p-8 border border-gray-800 shadow-2xl relative overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-900 opacity-20 rounded-full blur-3xl"></div>
                    <h2 className="text-2xl font-bold mb-6 border-b border-gray-800 pb-4 relative z-10">Assegna Bonus o Malus</h2>

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        {/* Selezione Rapida dal Regolamento */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Selezione rapida da Regolamento</label>
                            <select
                                value={selectedPredefined}
                                onChange={handlePredefinedChange}
                                className="w-full bg-[#0a0f1c] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-oro transition-colors appearance-none"
                            >
                                {predefinedRules.map((rule, idx) => (
                                    <option key={idx} value={rule.title}>{rule.title} {rule.points !== 0 ? `(${rule.points > 0 ? '+' : ''}${rule.points})` : ''}</option>
                                ))}
                            </select>
                        </div>

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

                {/* Storico Bonus/Malus */}
                <div className="bg-[#131d36] rounded-3xl p-8 border border-gray-800 shadow-2xl relative overflow-hidden">
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-viola opacity-10 rounded-full blur-3xl"></div>
                    <h2 className="text-2xl font-bold mb-6 border-b border-gray-800 pb-4 relative z-10">Storico Bonus & Malus</h2>

                    {eventsLoading ? (
                        <div className="text-center py-12 text-gray-500 italic">Caricamento storico...</div>
                    ) : (
                        <div className="relative z-10 overflow-x-auto max-h-96 custom-scrollbar">
                            <table className="w-full text-left font-sans">
                                <thead className="text-gray-400 border-b border-gray-800">
                                    <tr>
                                        <th className="py-3 px-4">Data</th>
                                        <th className="py-3 px-4">Artista</th>
                                        <th className="py-3 px-4">Valore</th>
                                        <th className="py-3 px-4">Descrizione</th>
                                        <th className="py-3 px-4 text-right">Azioni</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {events.map(event => (
                                        <tr key={event.id} className="hover:bg-white/5 transition-colors">
                                            <td className="py-3 px-4 text-xs text-gray-400 tabular-nums">
                                                {new Date(event.createdAt).toLocaleDateString('it-IT')}
                                            </td>
                                            <td className="py-3 px-4 font-bold">{event.artist.name}</td>
                                            <td className="py-3 px-4">
                                                <span className={`font-mono font-bold ${event.points >= 0 ? 'text-green-400' : 'text-red-500'}`}>
                                                    {event.points > 0 ? `+${event.points}` : event.points}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-300 italic">{event.description}</td>
                                            <td className="py-3 px-4 text-right">
                                                <button
                                                    onClick={() => handleDeleteEvent(event.id)}
                                                    className="text-red-500/60 hover:text-red-500 p-2 transition-colors"
                                                    title="Annulla Bonus/Malus"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {events.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-12 text-center text-gray-500 italic">Nessun evento registrato.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
