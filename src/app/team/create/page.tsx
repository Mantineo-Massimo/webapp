"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import SocialShare from "@/components/SocialShare";
import CountdownTimer from "@/components/CountdownTimer";
import Image from "next/image";
import { FiCamera, FiCheck, FiInfo, FiLayers, FiDollarSign, FiZap, FiEdit3 } from "react-icons/fi";

type Artist = {
    id: string;
    name: string;
    cost: number;
    image?: string | null;
    totalScore: number;
};

export default function CreateTeamPage() {
    const router = useRouter();
    const { status } = useSession();

    const [artists, setArtists] = useState<Artist[]>([]);
    const [selectedArtists, setSelectedArtists] = useState<Artist[]>([]);
    const [teamName, setTeamName] = useState("");
    const [teamImage, setTeamImage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [teamId, setTeamId] = useState<string | null>(null);
    const [captainId, setCaptainId] = useState<string | null>(null);
    const [initialFetchDone, setInitialFetchDone] = useState(false);

    const [deadline, setDeadline] = useState<string | null>(null);
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
        }
    }, [status, router]);

    useEffect(() => {
        // Fetch Artists
        fetch("/api/artists")
            .then(res => res.json())
            .then(data => setArtists(data))
            .catch(err => console.error("Failed to load artists", err));

        // Fetch User's Team
        fetch("/api/team")
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data && data.id) {
                    setIsEditing(true);
                    setTeamId(data.id);
                    setCaptainId(data.captainId || null);
                    setTeamName(data.name);
                    setTeamImage(data.image || null);
                    setSelectedArtists(data.artists || []);
                }
                setInitialFetchDone(true);
            })
            .catch(err => {
                console.error("Failed to load team", err);
                setInitialFetchDone(true);
            });

        // Fetch Settings
        fetch("/api/settings")
            .then(res => res.json())
            .then(data => {
                if (data?.draftDeadline) {
                    setDeadline(data.draftDeadline);
                    if (new Date() > new Date(data.draftDeadline)) {
                        setIsExpired(true);
                    }
                }
            })
            .catch(err => console.error("Failed to load settings", err));
    }, []);

    useEffect(() => {
        if (!deadline) return;
        const interval = setInterval(() => {
            if (new Date() > new Date(deadline)) {
                setIsExpired(true);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [deadline]);

    const spentBudget = selectedArtists.reduce((acc, curr) => acc + curr.cost, 0);
    const remainingBudget = 100 - spentBudget;

    const toggleArtist = (artist: Artist) => {
        if (isExpired) return;

        if (selectedArtists.some(a => a.id === artist.id)) {
            setSelectedArtists(selectedArtists.filter(a => a.id !== artist.id));
            if (captainId === artist.id) setCaptainId(null);
        } else {
            if (selectedArtists.length >= 5) {
                setError("Massimo 5 artisti consentiti.");
                return;
            }
            if (remainingBudget - artist.cost < 0) {
                setError("Budget insufficiente.");
                return;
            }
            setError("");
            setSelectedArtists([...selectedArtists, artist]);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError("");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || "Upload fallito");
            }
            const data = await res.json();
            setTeamImage(data.url);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const saveTeam = async () => {
        if (isExpired) return;
        if (selectedArtists.length !== 5) {
            setError("Seleziona esattamente 5 artisti.");
            return;
        }
        if (!teamName.trim()) {
            setError("Il nome della squadra è richiesto.");
            return;
        }
        if (!captainId) {
            setError("Devi scegliere un Capitano.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const method = isEditing ? "PUT" : "POST";
            const res = await fetch("/api/team", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    teamName: teamName,
                    image: teamImage,
                    artistIds: selectedArtists.map(a => a.id),
                    captainId: captainId
                })
            });

            if (!res.ok) {
                const msg = await res.text();
                setError(msg || "Errore di salvataggio.");
            } else {
                router.push("/leaderboards");
            }
        } catch {
            setError("Errore di connessione.");
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading" || !initialFetchDone) return (
        <div className="min-h-screen bg-blunotte flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-oro/20 border-t-oro rounded-full animate-spin"></div>
        </div>
    );

    return (
        <main className="min-h-screen pt-44 pb-32 selection:bg-oro/30">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                
                {/* --- SEZIONE SINISTRA: PICKER --- */}
                <div className="lg:col-span-8 space-y-12">
                    <header className="space-y-4">
                        <span className="text-oro font-black uppercase tracking-[0.4em] text-[10px]">Team Management</span>
                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
                            {isEditing ? "Gestione" : "Arena"} <span className="text-gradient-oro">Draft</span>
                        </h1>
                        <p className="text-gray-400 max-w-2xl font-light">
                            {isEditing 
                                ? "Ottimizza il tuo roster d'elite prima della scadenza. Ricorda: l'Arte non ammette errori."
                                : "Seleziona i tuoi 5 campioni. Hai 100 Armoni per costruire l'eredità della tua associazione."}
                        </p>
                    </header>

                    {deadline && (
                        <div className="glass p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden group hover:border-oro/20 transition-all">
                             <div className="absolute top-0 right-10 text-white/[0.03] font-black text-8xl pointer-events-none group-hover:text-oro/5 transition-colors">TIME</div>
                             <div className="relative z-10">
                                <span className="text-[10px] font-black uppercase tracking-widest text-oro animate-pulse block mb-4">Deadline Iscrizioni</span>
                                <CountdownTimer targetDate={deadline} />
                             </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {artists.map((artist, idx) => {
                                const isSelected = selectedArtists.some(a => a.id === artist.id);
                                const isCap = captainId === artist.id;
                                const canAfford = remainingBudget >= artist.cost || isSelected;
                                const isDisabled = isExpired || (!canAfford && !isSelected);

                                return (
                                    <motion.div
                                        key={artist.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        layout
                                        onClick={() => !isDisabled && toggleArtist(artist)}
                                        className={`glass group relative rounded-[2rem] border-2 p-4 transition-all duration-500 overflow-hidden ${
                                            isSelected 
                                            ? "border-oro/40 bg-oro/[0.05] shadow-[0_20px_40px_rgba(255,215,0,0.1)] active:scale-95" 
                                            : isDisabled 
                                                ? "opacity-30 border-white/5 cursor-not-allowed grayscale" 
                                                : "border-white/5 hover:border-white/20 cursor-pointer hover:-translate-y-1 active:scale-95"
                                        }`}
                                    >
                                        <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-4 bg-blunotte">
                                            <Image 
                                                src={artist.image || "/fanta-logo.png"} 
                                                alt={artist.name} 
                                                fill 
                                                className={`object-cover transition-all duration-700 ${isSelected ? 'scale-110 opacity-100' : 'opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110'}`} 
                                            />
                                            <div className="absolute top-3 right-3 flex flex-col gap-2">
                                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border ${isSelected ? 'bg-oro text-blunotte border-oro' : 'bg-blunotte/80 text-white/60 border-white/10'}`}>
                                                    {artist.cost} AR
                                                </div>
                                            </div>
                                            {isSelected && (
                                                <div className="absolute inset-0 border-4 border-oro/40 rounded-2xl pointer-events-none"></div>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-start">
                                                <h3 className={`text-xl font-black ${isSelected ? 'text-oro' : 'text-white'}`}>{artist.name}</h3>
                                                {isSelected && (
                                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-oro">
                                                        <FiCheck size={20} strokeWidth={4} />
                                                    </motion.div>
                                                )}
                                            </div>

                                            {isSelected && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setCaptainId(artist.id);
                                                    }}
                                                    className={`w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all gap-2 flex items-center justify-center ${
                                                        isCap 
                                                        ? "bg-oro text-blunotte shadow-[0_0_15px_rgba(255,215,0,0.4)]" 
                                                        : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
                                                    }`}
                                                >
                                                    <FiZap size={14} className={isCap ? "fill-blunotte" : ""} />
                                                    {isCap ? "Capitano d'Elite" : "Rendi Capitano"}
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>

                {/* --- SEZIONE DESTRA: RIEPILOGO STICKY --- */}
                <aside className="lg:col-span-4 lg:sticky lg:top-32 space-y-6">
                    <div className="glass p-8 rounded-[3rem] border-white/10 shadow-3xl space-y-8">
                        <header className="pb-6 border-b border-white/5 flex items-center justify-between">
                            <h2 className="text-2xl font-black uppercase tracking-tighter">Draft Live</h2>
                            <FiEdit3 className="text-oro" />
                        </header>

                        {/* Team Image & Name */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-6">
                                <div className="relative w-24 h-24 rounded-[1.5rem] overflow-hidden bg-white/5 border border-white/10 shadow-inner group">
                                    <Image src={teamImage || "/fanta-logo.png"} alt="Squadra" fill className="object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                    {isUploading && (
                                        <div className="absolute inset-0 bg-blunotte/60 flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-oro/30 border-t-oro rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                    <label className="absolute inset-0 flex items-center justify-center bg-blunotte/0 hover:bg-blunotte/40 transition-all cursor-pointer group-hover:opacity-100">
                                        <FiCamera className="text-white opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all" size={24} />
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading || isExpired} />
                                    </label>
                                </div>
                                <div className="flex-grow space-y-2">
                                    <label className="text-[10px] font-black uppercase text-white/40 tracking-widest">Identità Squadra</label>
                                    <input 
                                        type="text" 
                                        value={teamName}
                                        onChange={(e) => setTeamName(e.target.value)}
                                        disabled={isExpired}
                                        placeholder="Nome Squadra..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-oro transition-all font-bold placeholder:text-white/10"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Budget & Slots */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black uppercase text-white/40 tracking-widest flex items-center gap-2"><FiDollarSign /> Budget Armoni</span>
                                    <span className={`text-2xl font-black ${remainingBudget < 0 ? 'text-red-500' : 'text-oro'}`}>{remainingBudget}<span className="text-xs text-white/20 ml-1">/100</span></span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div 
                                        className={`h-full bg-gradient-to-r from-oro to-ocra shadow-[0_0_10px_rgba(255,215,0,0.3)]`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(spentBudget / 100) * 100}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black uppercase text-white/40 tracking-widest flex items-center gap-2"><FiLayers /> Slot Artisti</span>
                                    <span className={`text-2xl font-black ${selectedArtists.length === 5 ? 'text-oro' : 'text-white'}`}>{selectedArtists.length}<span className="text-xs text-white/20 ml-1">/5</span></span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                     <motion.div 
                                        className={`h-full bg-gradient-to-r from-viola to-purple-600 shadow-[0_0_10px_rgba(139,92,246,0.3)]`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(selectedArtists.length / 5) * 100}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Mini-list Selected */}
                        <div className="space-y-3 pt-6 border-t border-white/5 min-h-[220px]">
                            {selectedArtists.length === 0 ? (
                                <div className="h-40 flex flex-col items-center justify-center text-white/10 italic text-sm text-center">
                                    <FiUsers size={32} className="mb-2" />
                                    <span>Nessun artista selezionato.<br/>Fai le tue scelte.</span>
                                </div>
                            ) : (
                                selectedArtists.map(a => (
                                    <motion.div key={a.id} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg overflow-hidden relative border border-white/10">
                                                <Image src={a.image || "/fanta-logo.png"} alt={a.name} fill className="object-cover" />
                                            </div>
                                            <span className="text-sm font-bold tracking-tight">{a.name}</span>
                                            {captainId === a.id && <FiZap className="text-oro" size={12} />}
                                        </div>
                                        <span className="text-xs font-black text-oro">{a.cost} AR</span>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {error && (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-xs font-bold text-center flex items-center justify-center gap-2">
                                <FiInfo /> {error}
                            </motion.div>
                        )}

                        {!captainId && selectedArtists.length === 5 && (
                            <div className="text-center text-oro text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                                ★ Seleziona un Capitano per salvare
                            </div>
                        )}

                        <button
                            onClick={saveTeam}
                            disabled={selectedArtists.length !== 5 || !teamName.trim() || !captainId || loading || remainingBudget < 0 || isExpired}
                            className={`w-full py-5 rounded-2xl font-black text-xl uppercase tracking-widest shadow-2xl transition-all relative overflow-hidden group ${
                                isExpired 
                                ? "bg-white/5 text-white/20 cursor-not-allowed" 
                                : "bg-gradient-to-r from-oro to-ocra text-blunotte hover:shadow-[0_20px_40px_rgba(255,215,0,0.3)] hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            }`}
                        >
                            <span className="relative z-10">
                                {loading ? "Salvataggio..." : isExpired ? "Mercato Chiuso" : (isEditing ? "Aggiorna Team" : "Fonda Squadra")}
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                        </button>

                        {isEditing && teamId && (
                            <div className="pt-6 border-t border-white/5 space-y-4 text-center">
                                <span className="text-[10px] uppercase font-black tracking-widest text-white/20 block">Sfida i tuoi amici</span>
                                <div className="flex justify-center">
                                    <SocialShare
                                        url={`${typeof window !== 'undefined' ? window.location.origin : ''}/team/${teamId}`}
                                        title={`Ecco la mia squadra ${teamName} su FantaPiazza! Vieni a sfidarmi! 🚀`}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </main>
    );
}
