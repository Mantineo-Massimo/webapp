"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUsers, FiStar, FiSettings, FiActivity, FiClock, FiPlus, FiTrash2, FiUpload, FiCheck, FiX } from "react-icons/fi";
import ArmoniIcon from "@/components/ArmoniIcon";

type Artist = {
    id: string;
    name: string;
    cost: number;
    image?: string | null;
    totalScore: number;
};

type Tab = "dashboard" | "artists" | "points" | "history" | "settings";

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [artists, setArtists] = useState<Artist[]>([]);
    const [activeTab, setActiveTab] = useState<Tab>("dashboard");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Artist Management State
    const [newName, setNewName] = useState("");
    const [newCost, setNewCost] = useState<number | "">("");
    const [newImage, setNewImage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [artistLoading, setArtistLoading] = useState(false);

    // Points State
    const [selectedArtistId, setSelectedArtistId] = useState("");
    const [points, setPoints] = useState<number | "">("");
    const [description, setDescription] = useState("");
    const [selectedPredefined, setSelectedPredefined] = useState("");

    // Settings State
    const [deadline, setDeadline] = useState<string>("");
    const [settingsLoading, setSettingsLoading] = useState(false);

    // History State
    const [events, setEvents] = useState<any[]>([]);
    const [eventsLoading, setEventsLoading] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
        } else if (session?.user?.role !== "ADMIN" && status !== "loading") {
            router.push("/");
        }
    }, [status, session, router]);

    const loadArtists = () => {
        fetch("/api/artists")
            .then(res => res.json())
            .then(data => setArtists(data))
            .catch(err => console.error(err));
    };

    const loadSettings = () => {
        fetch("/api/settings")
            .then(res => res.json())
            .then(data => {
                if (data?.draftDeadline) {
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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError("");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData
            });

            if (!res.ok) throw new Error("Errore durante l'upload");
            const data = await res.json();
            setNewImage(data.url);
            setSuccess("Immagine caricata correttamente.");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleAddArtist = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName || newCost === "") {
            setError("Compila nome e costo.");
            return;
        }

        setArtistLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/admin/artists", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName, cost: newCost, image: newImage })
            });

            if (!res.ok) throw new Error("Errore durante l'aggiunta dell'artista");

            setSuccess(`Artista ${newName} aggiunto con successo.`);
            setNewName("");
            setNewCost("");
            setNewImage(null);
            loadArtists();
            setTimeout(() => setSuccess(""), 4000);
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
            setTimeout(() => setSuccess(""), 4000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setArtistLoading(false);
        }
    };

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

    const handlePredefinedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const title = e.target.value;
        setSelectedPredefined(title);
        const rule = predefinedRules.find(r => r.title === title);
        if (rule && title !== predefinedRules[0].title) {
            setPoints(rule.points);
            setDescription(rule.title);
        }
    };

    const handlePointsSubmit = async (e: React.FormEvent) => {
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

            if (!res.ok) throw new Error(await res.text() || "Errore durante l'operazione");

            setSuccess(`Punteggio aggiornato.`);
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
            if (!res.ok) throw new Error("Errore durante l'eliminazione");

            setSuccess("Evento annullato e punteggi ricalcolati.");
            loadArtists();
            loadEvents();
            setTimeout(() => setSuccess(""), 4000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

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
            setSuccess("Impostazioni salvate con successo.");
            setTimeout(() => setSuccess(""), 4000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSettingsLoading(false);
        }
    };

    if (status === "loading" || session?.user?.role !== "ADMIN") {
        return <div className="min-h-screen bg-blunotte flex items-center justify-center text-white">Verifica permessi in corso...</div>;
    }

    const tabs = [
        { id: "dashboard", label: "Dashboard", icon: <FiActivity /> },
        { id: "artists", label: "Artisti", icon: <FiUsers /> },
        { id: "points", label: "Punti", icon: <FiStar /> },
        { id: "history", label: "Storico", icon: <FiClock /> },
        { id: "settings", label: "Impostazioni", icon: <FiSettings /> },
    ];

    return (
        <main className="min-h-screen bg-blunotte text-white pb-32">
            <div className="max-w-6xl mx-auto px-6 pt-40 md:pt-32">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">Pannello <span className="text-red-500">Admin</span></h1>
                        <p className="text-gray-400">Piazza dell&apos;Arte & Associazioni Morgana/Orum</p>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="flex bg-[#131d36] p-1.5 rounded-2xl border border-gray-800 overflow-x-auto no-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as Tab)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap font-bold text-sm ${activeTab === tab.id
                                    ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Notifications */}
                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 p-4 bg-red-900/40 border border-red-500/50 text-red-100 rounded-2xl flex items-center gap-3">
                            <FiX className="text-red-400" size={20} />
                            {error}
                        </motion.div>
                    )}
                    {success && (
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 p-4 bg-green-900/40 border border-green-500/50 text-green-100 rounded-2xl flex items-center gap-3">
                            <FiCheck className="text-green-400" size={20} />
                            {success}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Content Area */}
                <div className="grid grid-cols-1 gap-8">

                    {/* DASHBOARD TAB */}
                    {activeTab === "dashboard" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-[#131d36] p-8 rounded-3xl border border-gray-800 shadow-xl">
                                <h3 className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-4">Totale Artisti</h3>
                                <div className="text-5xl font-black text-oro">{artists.length}</div>
                            </div>
                            <div className="bg-[#131d36] p-8 rounded-3xl border border-gray-800 shadow-xl">
                                <h3 className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-4">Punti Assegnati</h3>
                                <div className="text-5xl font-black text-red-500">{events.length}</div>
                            </div>
                            <div className="bg-[#131d36] p-8 rounded-3xl border border-gray-800 shadow-xl">
                                <h3 className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-4">Scadenza Iscrizioni</h3>
                                <div className="text-xl font-bold text-white">
                                    {deadline ? new Date(deadline).toLocaleString('it-IT') : "Nessuna"}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ARTISTS TAB */}
                    {activeTab === "artists" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                            <div className="bg-[#131d36] p-8 rounded-3xl border border-gray-800 shadow-xl">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                    <FiPlus className="text-oro" /> Aggiungi Nuovo Artista
                                </h2>
                                <form onSubmit={handleAddArtist} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Nome Artista</label>
                                        <input
                                            type="text"
                                            value={newName}
                                            onChange={e => setNewName(e.target.value)}
                                            placeholder="Inserisci nome..."
                                            className="w-full bg-[#0a0f1c] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Costo (Armoni)</label>
                                        <input
                                            type="number"
                                            value={newCost}
                                            onChange={e => setNewCost(e.target.value ? Number(e.target.value) : "")}
                                            placeholder="es. 20"
                                            className="w-full bg-[#0a0f1c] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={artistLoading}
                                        className="py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-red-600/20"
                                    >
                                        {artistLoading ? "Salvataggio..." : "Salva Artista"}
                                    </button>

                                    <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                        <div className="space-y-4">
                                            <label className="text-xs font-bold text-gray-500 uppercase block">Immagine Profilo</label>
                                            <div className="flex items-center gap-6">
                                                <div className="w-24 h-24 rounded-2xl bg-[#0a0f1c] border border-dashed border-gray-700 overflow-hidden flex items-center justify-center relative group">
                                                    {newImage ? (
                                                        <img src={newImage} alt="Preview" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <FiUsers size={32} className="text-gray-800" />
                                                    )}
                                                    {isUploading && (
                                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <label className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl cursor-pointer transition-all border border-gray-600">
                                                        <FiUpload /> {isUploading ? "Caricamento..." : "Scegli File"}
                                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                                                    </label>
                                                    <p className="text-xs text-gray-500 mt-2 italic">Dimensioni consigliate: 400x400px (1:1)</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div className="bg-[#131d36] p-8 rounded-3xl border border-gray-800 shadow-xl overflow-hidden">
                                <h2 className="text-2xl font-bold mb-6">Lista Artisti ({artists.length})</h2>
                                <div className="overflow-x-auto no-scrollbar">
                                    <table className="w-full text-left">
                                        <thead className="text-gray-400 text-xs font-black uppercase tracking-widest border-b border-gray-800">
                                            <tr>
                                                <th className="pb-4 px-4">Info</th>
                                                <th className="pb-4 px-4 text-center">Costo</th>
                                                <th className="pb-4 px-4 text-center">Punteggio</th>
                                                <th className="pb-4 px-4 text-right">Azioni</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-800">
                                            {artists.map(a => (
                                                <tr key={a.id} className="hover:bg-white/5 transition-colors group">
                                                    <td className="py-4 px-4 flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-[#0a0f1c] border border-gray-800 overflow-hidden flex-shrink-0">
                                                            {a.image ? (
                                                                <img src={a.image} alt={a.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-600"><FiUsers /></div>
                                                            )}
                                                        </div>
                                                        <span className="font-bold text-lg">{a.name}</span>
                                                    </td>
                                                    <td className="py-4 px-4 text-center font-mono text-oro font-bold flex items-center justify-center gap-1.5">
                                                        {a.cost} <ArmoniIcon size={16} />
                                                    </td>
                                                    <td className="py-4 px-4 text-center font-mono font-bold">{a.totalScore}</td>
                                                    <td className="py-4 px-4 text-right">
                                                        <button
                                                            onClick={() => handleDeleteArtist(a.id, a.name)}
                                                            className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                                                        >
                                                            <FiTrash2 size={20} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* POINTS TAB */}
                    {activeTab === "points" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="bg-[#131d36] p-8 rounded-3xl border border-gray-800 shadow-xl relative overflow-hidden">
                                <div className="absolute -top-24 -right-24 w-80 h-80 bg-red-600/10 rounded-full blur-[100px]"></div>
                                <h2 className="text-2xl font-bold mb-8">Assegna Bonus o Malus</h2>

                                <form onSubmit={handlePointsSubmit} className="space-y-8 relative z-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Azione dal Regolamento</label>
                                            <select
                                                value={selectedPredefined}
                                                onChange={handlePredefinedChange}
                                                className="w-full bg-[#0a0f1c] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-oro transition-colors appearance-none"
                                            >
                                                {predefinedRules.map((rule, idx) => (
                                                    <option key={idx} value={rule.title}>
                                                        {rule.title} {rule.points !== 0 ? `(${rule.points > 0 ? '+' : ''}${rule.points})` : ''}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Artista coinvolto</label>
                                            <select
                                                value={selectedArtistId}
                                                onChange={e => setSelectedArtistId(e.target.value)}
                                                className="w-full bg-[#0a0f1c] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors appearance-none"
                                            >
                                                <option value="" disabled>-- Scegli un artista --</option>
                                                {artists.map(a => (
                                                    <option key={a.id} value={a.id}>{a.name} (T.Score: {a.totalScore})</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Valore Punti</label>
                                            <input
                                                type="number"
                                                value={points}
                                                onChange={e => setPoints(e.target.value ? Number(e.target.value) : "")}
                                                placeholder="es. 10"
                                                className="w-full bg-[#0a0f1c] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                                            />
                                        </div>
                                        <div className="md:col-span-3 space-y-3">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Motivazione</label>
                                            <input
                                                type="text"
                                                value={description}
                                                onChange={e => setDescription(e.target.value)}
                                                placeholder="es. Performance incredibile..."
                                                className="w-full bg-[#0a0f1c] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 text-white font-black text-xl rounded-2xl bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 transition-all shadow-[0_10px_30px_rgba(220,38,38,0.3)] disabled:opacity-50 uppercase tracking-widest"
                                    >
                                        {loading ? "Esecuzione ricalcolo..." : "Applica Evento"}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    )}

                    {/* HISTORY TAB */}
                    {activeTab === "history" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#131d36] p-8 rounded-3xl border border-gray-800 shadow-xl overflow-hidden">
                            <h2 className="text-2xl font-bold mb-8">Cronologia Punteggi</h2>
                            {eventsLoading ? (
                                <div className="text-center py-20 text-gray-600 animate-pulse">Caricamento storico...</div>
                            ) : (
                                <div className="overflow-x-auto no-scrollbar">
                                    <table className="w-full text-left">
                                        <thead className="text-gray-500 text-xs font-black tracking-widest uppercase border-b border-gray-800">
                                            <tr>
                                                <th className="pb-4 px-4">Data</th>
                                                <th className="pb-4 px-4">Artista</th>
                                                <th className="pb-4 px-4">Valore</th>
                                                <th className="pb-4 px-4">Motivazione</th>
                                                <th className="pb-4 px-4 text-right">Azioni</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-800">
                                            {events.map(event => (
                                                <tr key={event.id} className="hover:bg-white/5 transition-colors group">
                                                    <td className="py-4 px-4 text-gray-400 font-mono text-xs">
                                                        {new Date(event.createdAt).toLocaleDateString('it-IT')}
                                                    </td>
                                                    <td className="py-4 px-4 font-bold">{event.artist.name}</td>
                                                    <td className="py-4 px-4">
                                                        <span className={`font-mono font-black ${event.points >= 0 ? "text-green-400" : "text-red-500"}`}>
                                                            {event.points > 0 ? `+${event.points}` : event.points}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-gray-400 text-sm italic">{event.description}</td>
                                                    <td className="py-4 px-4 text-right">
                                                        <button
                                                            onClick={() => handleDeleteEvent(event.id)}
                                                            className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                                                        >
                                                            <FiTrash2 size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {events.length === 0 && (
                                                <tr><td colSpan={5} className="py-20 text-center text-gray-600 italic">Nessun evento registrato.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* SETTINGS TAB */}
                    {activeTab === "settings" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#131d36] p-8 rounded-3xl border border-gray-800 shadow-xl max-w-2xl mx-auto w-full">
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                <FiSettings className="text-oro" /> Impostazioni di Sistema
                            </h2>
                            <form onSubmit={handleSaveSettings} className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-gray-300 uppercase tracking-widest">Scadenza Draft (Fine Iscrizioni)</label>
                                    <input
                                        type="datetime-local"
                                        value={deadline}
                                        onChange={e => setDeadline(e.target.value)}
                                        className="w-full bg-[#0a0f1c] border border-gray-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-red-500 transition-colors"
                                    />
                                    <p className="text-sm text-gray-500 italic">Oltre questa data, gli utenti non potranno più creare o modificare squadre.</p>
                                </div>
                                <button
                                    type="submit"
                                    disabled={settingsLoading}
                                    className="w-full py-4 text-blunotte font-black text-lg bg-oro hover:bg-oro/90 rounded-2xl transition-all disabled:opacity-50 uppercase shadow-lg shadow-oro/10"
                                >
                                    {settingsLoading ? "Salvataggio..." : "Salva Configurazione"}
                                </button>
                            </form>
                        </motion.div>
                    )}

                </div>
            </div>
        </main>
    );
}
