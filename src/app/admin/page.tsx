"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiUsers, FiBookOpen,
    FiShield,
    FiClock,
    FiSettings,
    FiActivity,
    FiEdit2,
    FiTrash2,
    FiStar,
    FiUpload,
    FiList,
    FiPlus,
    FiCheck,
    FiX
} from "react-icons/fi";

type Artist = {
    id: string;
    name: string;
    cost: number;
    image?: string | null;
    totalScore: number;
};

type Tab = "dashboard" | "artists" | "points" | "history" | "settings" | "regole" | "participants";

type RuleDefinition = {
    id: string;
    category: string;
    title: string;
    description: string;
    points: number;
};

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

    // Rules Management State
    const [rules, setRules] = useState<RuleDefinition[]>([]);
    const [ruleCategory, setRuleCategory] = useState("");
    const [ruleTitle, setRuleTitle] = useState("");
    const [ruleDescription, setRuleDescription] = useState("");
    const [rulePoints, setRulePoints] = useState<number | "">("");
    const [rulesLoading, setRulesLoading] = useState(false);
    const [editingRuleId, setEditingRuleId] = useState<string | null>(null);

    // User and Team Management State
    const [users, setUsers] = useState<any[]>([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [teams, setTeams] = useState<any[]>([]);
    const [teamsLoading, setTeamsLoading] = useState(false);

    // User Edit State
    const [editingUser, setEditingUser] = useState<any>(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);

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
            .then(async res => {
                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`API Error ${res.status}: ${errorText}`);
                }
                return res.json();
            })
            .then(data => setEvents(data))
            .catch(err => {
                console.error("LOAD_EVENTS_ERROR", err);
                setError("Impossibile caricare lo storico: " + err.message);
            })
            .finally(() => setEventsLoading(false));
    };

    const loadRules = () => {
        setRulesLoading(true);
        fetch("/api/admin/rules")
            .then(res => res.json())
            .then(data => setRules(data))
            .catch(err => console.error(err))
            .finally(() => setRulesLoading(false));
    };

    const loadTeams = () => {
        setTeamsLoading(true);
        fetch("/api/admin/teams")
            .then(res => res.json())
            .then(data => setTeams(data))
            .catch(err => console.error(err))
            .finally(() => setTeamsLoading(false));
    };

    const loadUsers = () => {
        setUsersLoading(true);
        fetch("/api/admin/users")
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(err => console.error(err))
            .finally(() => setUsersLoading(false));
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/admin/users", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: editingUser.id,
                    name: editingUser.name,
                    role: editingUser.role
                })
            });

            if (res.ok) {
                setIsUserModalOpen(false);
                setEditingUser(null);
                loadUsers();
            } else {
                alert("Errore durante l'aggiornamento");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteUser = async (id: string, name: string) => {
        if (!confirm(`Sei sicuro di voler eliminare l'utente ${name}? Questa azione è irreversibile.`)) return;

        try {
            const res = await fetch(`/api/admin/users?id=${id}`, {
                method: "DELETE"
            });

            if (res.ok) {
                loadUsers();
            } else {
                alert(await res.text() || "Errore durante l'eliminazione");
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (session?.user?.role === "ADMIN") {
            loadArtists();
            loadSettings();
            // Initial load for active tab if it's not dashboard
            if (activeTab === "history") loadEvents();
            if (activeTab === "regole") loadRules();
            if (activeTab === "participants") loadUsers();
        }
    }, [session]);

    useEffect(() => {
        if (activeTab === "history") loadEvents();
        if (activeTab === "regole") loadRules();
        if (activeTab === "participants") loadUsers();
    }, [activeTab]);

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

    const handlePredefinedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const title = e.target.value;
        setSelectedPredefined(title);
        const rule = rules.find(r => r.title === title);
        if (rule) {
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
                    description: description.trim(),
                    ruleId: rules.find(r => r.title === selectedPredefined)?.id || null
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

    const handleRuleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ruleCategory || !ruleTitle || !ruleDescription || rulePoints === "") {
            setError("Compila tutti i campi della regola.");
            return;
        }

        setRulesLoading(true);
        setError("");
        setSuccess("");

        try {
            const method = editingRuleId ? "PUT" : "POST";
            const res = await fetch("/api/admin/rules", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: editingRuleId,
                    category: ruleCategory,
                    title: ruleTitle,
                    description: ruleDescription,
                    points: Number(rulePoints)
                })
            });

            if (!res.ok) throw new Error("Errore durante il salvataggio della regola");

            setSuccess(editingRuleId ? "Regola aggiornata." : "Regola aggiunta.");
            setRuleCategory("");
            setRuleTitle("");
            setRuleDescription("");
            setRulePoints("");
            setEditingRuleId(null);
            loadRules();
            setTimeout(() => setSuccess(""), 4000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setRulesLoading(false);
        }
    };

    const handleDeleteRule = async (id: string, title: string) => {
        if (!confirm(`Vuoi davvero eliminare la regola "${title}"?`)) return;

        setRulesLoading(true);
        try {
            const res = await fetch(`/api/admin/rules?id=${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Errore durante l'eliminazione.");
            setSuccess("Regola eliminata.");
            loadRules();
            setTimeout(() => setSuccess(""), 4000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setRulesLoading(false);
        }
    };

    const startEditingRule = (rule: RuleDefinition) => {
        setEditingRuleId(rule.id);
        setRuleCategory(rule.category);
        setRuleTitle(rule.title);
        setRuleDescription(rule.description);
        setRulePoints(rule.points);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (status === "loading" || session?.user?.role !== "ADMIN") {
        return <div className="min-h-screen bg-blunotte flex items-center justify-center text-white">Verifica permessi in corso...</div>;
    }

    const tabs = [
        { id: "dashboard", label: "Dashboard", icon: <FiActivity /> },
        { id: "artists", label: "Artisti", icon: <FiUsers /> },
        { id: "regole", label: "Regolamento", icon: <FiBookOpen /> },
        { id: "participants", label: "Partecipanti", icon: <FiUsers /> },
        { id: "points", label: "Punti", icon: <FiStar /> },
        { id: "history", label: "Storico", icon: <FiClock /> },
        { id: "settings", label: "Impostazioni", icon: <FiSettings /> },
    ];

    return (
        <main className="min-h-screen text-white pb-32">
            <div className="max-w-6xl mx-auto px-6 pt-56 md:pt-44">

                {/* Header Section */}
                <div className="space-y-8 mb-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
                                Pannello <span className="text-oro drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]">Admin</span>
                            </h1>
                            <p className="text-gray-400 text-lg flex items-center gap-2">
                                <span className="w-8 h-[1px] bg-oro/30"></span>
                                Piazza dell&apos;Arte & Associazioni Morgana/Orum
                            </p>
                        </div>
                    </div>

                    {/* Navigation Tabs - Dedicated Row */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-oro/10 via-transparent to-oro/10 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative bg-[#131d36]/80 backdrop-blur-xl p-1.5 rounded-2xl border border-gray-800/50 shadow-2xl overflow-hidden">
                            <div className="flex w-full">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as Tab)}
                                        className={`flex-1 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-1 md:px-3 py-2.5 rounded-xl transition-all duration-300 whitespace-nowrap font-black text-[9px] md:text-[10px] uppercase tracking-wider ${activeTab === tab.id
                                            ? "bg-gradient-to-r from-oro to-ocra text-blunotte shadow-[0_0_15px_rgba(255,215,0,0.3)] scale-[1.02] z-10"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                            }`}
                                    >
                                        <span className={`text-base md:text-sm ${activeTab === tab.id ? "text-blunotte" : "text-oro/70"}`}>
                                            {tab.icon}
                                        </span>
                                        <span className="hidden sm:inline-block md:inline-block">
                                            {tab.label}
                                        </span>
                                        {/* Short label for extra small mobile if needed, but let's try fitting full text first */}
                                        <span className="sm:hidden text-[8px]">
                                            {tab.label === "Regolamento" ? "Regole" :
                                                tab.label === "Partecipanti" ? "Utenti" :
                                                    tab.label === "Impostazioni" ? "Setup" : tab.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
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
                                                    <td className="py-4 px-4 text-center font-mono text-oro font-bold">{a.cost}</td>
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
                                                <option value="">-- Scegli dal regolamento --</option>
                                                {rules.map((rule, idx) => (
                                                    <option key={rule.id} value={rule.title}>
                                                        {rule.title} ({rule.points > 0 ? '+' : ''}{rule.points})
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

                    {/* RULES TAB */}
                    {activeTab === "regole" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                            <div className="bg-[#131d36] p-8 rounded-3xl border border-gray-800 shadow-xl">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                    {editingRuleId ? <FiEdit2 className="text-oro" /> : <FiPlus className="text-oro" />}
                                    {editingRuleId ? "Modifica Regola" : "Aggiungi Nuova Regola"}
                                </h2>
                                <form onSubmit={handleRuleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Categoria</label>
                                            <input
                                                type="text"
                                                value={ruleCategory}
                                                onChange={e => setRuleCategory(e.target.value)}
                                                placeholder="Canto, Danza, Malus..."
                                                className="w-full bg-[#0a0f1c] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                                            />
                                        </div>
                                        <div className="md:col-span-1 space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Titolo</label>
                                            <input
                                                type="text"
                                                value={ruleTitle}
                                                onChange={e => setRuleTitle(e.target.value)}
                                                placeholder="Nome della regola..."
                                                className="w-full bg-[#0a0f1c] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Punti</label>
                                            <input
                                                type="number"
                                                value={rulePoints}
                                                onChange={e => setRulePoints(e.target.value ? Number(e.target.value) : "")}
                                                placeholder="es. 15 o -10"
                                                className="w-full bg-[#0a0f1c] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Descrizione</label>
                                        <textarea
                                            value={ruleDescription}
                                            onChange={e => setRuleDescription(e.target.value)}
                                            placeholder="Spiegazione della regola..."
                                            rows={2}
                                            className="w-full bg-[#0a0f1c] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors resize-none"
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            type="submit"
                                            disabled={rulesLoading}
                                            className="flex-1 py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-red-600/20"
                                        >
                                            {rulesLoading ? "Salvataggio..." : editingRuleId ? "Aggiorna Regola" : "Salva Regola"}
                                        </button>
                                        {editingRuleId && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingRuleId(null);
                                                    setRuleCategory("");
                                                    setRuleTitle("");
                                                    setRuleDescription("");
                                                    setRulePoints("");
                                                }}
                                                className="px-6 py-3.5 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition-all"
                                            >
                                                Annulla
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>

                            <div className="bg-[#131d36] p-8 rounded-3xl border border-gray-800 shadow-xl overflow-hidden">
                                <h2 className="text-2xl font-bold mb-6">Regolamento Attuale ({rules.length})</h2>
                                <div className="overflow-x-auto no-scrollbar">
                                    <table className="w-full text-left">
                                        <thead className="text-gray-400 text-xs font-black uppercase tracking-widest border-b border-gray-800">
                                            <tr>
                                                <th className="pb-4 px-4">Titolo</th>
                                                <th className="pb-4 px-4">Categoria</th>
                                                <th className="pb-4 px-4 text-center">Punti</th>
                                                <th className="pb-4 px-4 text-right">Azioni</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-800">
                                            {rules.map(r => (
                                                <tr key={r.id} className="hover:bg-white/5 transition-colors group">
                                                    <td className="py-4 px-4">
                                                        <div className="font-bold">{r.title}</div>
                                                        <div className="text-xs text-gray-500 line-clamp-1">{r.description}</div>
                                                    </td>
                                                    <td className="py-4 px-4 text-sm text-gray-400 uppercase tracking-wider">{r.category}</td>
                                                    <td className="py-4 px-4 text-center font-mono font-bold">
                                                        <span className={r.points >= 0 ? "text-green-400" : "text-red-500"}>
                                                            {r.points > 0 ? `+${r.points}` : r.points}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => startEditingRule(r)}
                                                                className="p-2 text-gray-600 hover:text-oro transition-colors"
                                                            >
                                                                <FiEdit2 size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteRule(r.id, r.title)}
                                                                className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                                                            >
                                                                <FiTrash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {rules.length === 0 && (
                                                <tr><td colSpan={4} className="py-20 text-center text-gray-600 italic">Nessuna regola definita.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* HISTORY TAB */}
                    {activeTab === "history" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#131d36] p-8 rounded-3xl border border-gray-800 shadow-xl overflow-hidden">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold flex items-center gap-3">
                                    <FiClock className="text-oro" /> Cronologia Operazioni
                                </h2>
                                <button
                                    onClick={loadEvents}
                                    disabled={eventsLoading}
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-gray-800 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                                >
                                    <FiActivity className={eventsLoading ? "animate-spin" : ""} />
                                    Ricarica
                                </button>
                            </div>
                            {eventsLoading ? (
                                <div className="text-center py-20 text-gray-600 animate-pulse">Caricamento storico...</div>
                            ) : (
                                <div className="overflow-x-auto no-scrollbar">
                                    <table className="w-full text-left">
                                        <thead className="text-gray-500 text-xs font-black tracking-widest uppercase border-b border-gray-800">
                                            <tr>
                                                <th className="pb-4 px-4">Account</th>
                                                <th className="pb-4 px-4">Artista</th>
                                                <th className="pb-4 px-4">Punti</th>
                                                <th className="pb-4 px-4">Motivazione</th>
                                                <th className="pb-4 px-4">Data e Ora</th>
                                                <th className="pb-4 px-4 text-right">Azioni</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-800">
                                            {events.map(event => (
                                                <tr key={event.id} className="hover:bg-white/5 transition-colors group">
                                                    <td className="py-4 px-4">
                                                        <div className="text-xs font-bold text-gray-300">
                                                            {event.createdBy?.name || event.createdBy?.email?.split('@')[0] || "Sistema"}
                                                        </div>
                                                        <div className="text-[10px] text-gray-600 font-mono">#{event.id.slice(0, 6)}</div>
                                                    </td>
                                                    <td className="py-4 px-4 font-bold">{event.artist?.name || "Eliminato"}</td>
                                                    <td className="py-4 px-4">
                                                        <span className={`font-mono font-black ${event.points >= 0 ? "text-green-400" : "text-red-500"}`}>
                                                            {event.points > 0 ? `+${event.points}` : event.points}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-gray-300 text-sm">{event.description}</td>
                                                    <td className="py-4 px-4 text-gray-400 font-medium text-xs">
                                                        {new Date(event.createdAt).toLocaleString('it-IT', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </td>
                                                    <td className="py-4 px-4 text-right">
                                                        <button
                                                            onClick={() => handleDeleteEvent(event.id)}
                                                            className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                                                            title="Annulla operazione"
                                                        >
                                                            <FiTrash2 size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {events.length === 0 && (
                                                <tr><td colSpan={6} className="py-20 text-center text-gray-600 italic">Nessun evento registrato nello storico.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* PARTICIPANTS TAB (Unified Users & Teams) */}
                    {activeTab === "participants" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#131d36] p-8 rounded-3xl border border-gray-800 shadow-xl overflow-hidden">
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                <FiUsers className="text-oro" /> Gestione Partecipanti
                            </h2>
                            {usersLoading ? (
                                <div className="text-center py-20 text-gray-600 animate-pulse">Caricamento partecipanti...</div>
                            ) : (
                                <div className="overflow-x-auto no-scrollbar">
                                    <table className="w-full text-left">
                                        <thead className="text-gray-500 text-xs font-black tracking-widest uppercase border-b border-gray-800">
                                            <tr>
                                                <th className="pb-4 px-4">Utente</th>
                                                <th className="pb-4 px-4">Squadra</th>
                                                <th className="pb-4 px-4 text-center">Punti</th>
                                                <th className="pb-4 px-4">Artisti</th>
                                                <th className="pb-4 px-4 text-right">Azioni</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-800">
                                            {users.map(u => (
                                                <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                                                    <td className="py-4 px-4">
                                                        <div className="font-bold text-gray-200">{u.name || "N/A"}</div>
                                                        <div className="text-xs text-gray-500">{u.email}</div>
                                                        <div className="mt-1">
                                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${u.role === 'ADMIN' ? 'bg-oro/20 text-oro border border-oro/30' : 'bg-gray-800 text-gray-500'}`}>
                                                                {u.role}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        {u.team ? (
                                                            <div>
                                                                <div className="text-sm font-bold text-oro uppercase tracking-tight">{u.team.name}</div>
                                                                <div className="text-[10px] text-gray-500">Creato il {new Date(u.team.createdAt).toLocaleDateString('it-IT')}</div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-600 italic text-sm">Nessuna squadra</span>
                                                        )}
                                                    </td>
                                                    <td className="py-4 px-4 text-center">
                                                        {u.team ? (
                                                            <div className="text-xl font-black text-white">{u.team.leagues?.[0]?.score || 0}</div>
                                                        ) : "-"}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                            {u.team?.artists?.map((a: any) => (
                                                                <span key={a.id} className="text-[9px] bg-white/5 border border-gray-800 px-1.5 py-0.5 rounded text-gray-400 capitalize" title={a.name}>
                                                                    {a.name.split(' ')[0]}
                                                                </span>
                                                            ))}
                                                            {u.team && (!u.team.artists || u.team.artists.length === 0) && (
                                                                <span className="text-[10px] text-gray-600 italic">Incompleta</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingUser({
                                                                        ...u,
                                                                        teamName: u.team?.name || ""
                                                                    });
                                                                    setIsUserModalOpen(true);
                                                                }}
                                                                className="p-2 text-gray-600 hover:text-oro transition-colors"
                                                            >
                                                                <FiEdit2 size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteUser(u.id, u.name || u.email)}
                                                                className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                                                            >
                                                                <FiTrash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {users.length === 0 && (
                                                <tr><td colSpan={5} className="py-20 text-center text-gray-600 italic">Nessun partecipante registrato.</td></tr>
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
                {/* User Edit Modal */}
                {isUserModalOpen && editingUser && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-[#131d36] border border-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl"
                        >
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <FiEdit2 className="text-oro" /> Modifica Utente
                            </h2>
                            <form onSubmit={handleUpdateUser} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Nome</label>
                                    <input
                                        type="text"
                                        value={editingUser.name || ""}
                                        onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
                                        className="w-full bg-[#0a0f1c] border border-gray-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-oro"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Email</label>
                                    <input
                                        type="email"
                                        value={editingUser.email}
                                        disabled
                                        className="w-full bg-[#0a0f1c] border border-gray-800 rounded-xl px-4 py-2 text-gray-500 cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Ruolo</label>
                                    <select
                                        value={editingUser.role}
                                        onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}
                                        className="w-full bg-[#0a0f1c] border border-gray-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-oro"
                                    >
                                        <option value="USER">USER</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </select>
                                </div>
                                {editingUser.team && (
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">Nome Squadra</label>
                                        <input
                                            type="text"
                                            value={editingUser.teamName || ""}
                                            onChange={e => setEditingUser({ ...editingUser, teamName: e.target.value })}
                                            className="w-full bg-[#0a0f1c] border border-gray-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-oro"
                                        />
                                    </div>
                                )}

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsUserModalOpen(false);
                                            setEditingUser(null);
                                        }}
                                        className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition-colors"
                                    >
                                        Annulla
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 bg-gradient-to-r from-oro to-ocra text-blunotte font-bold rounded-xl shadow-lg shadow-oro/10"
                                    >
                                        Salva
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </div>
        </main>
    );
}
