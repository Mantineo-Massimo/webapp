"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SocialShare from "@/components/SocialShare";
import LeaderboardSkeleton from "./Skeleton";
import Image from "next/image";
import { FiUsers, FiStar, FiAward, FiX, FiShare2, FiZap } from "react-icons/fi";

type ArtistEvent = {
    id: string;
    points: number;
    description: string;
    createdAt: string;
};

type Artist = {
    id: string;
    name: string;
    totalScore: number;
    image?: string;
    events?: ArtistEvent[];
};

type TeamResult = {
    score: number;
    team: {
        id: string;
        name: string;
        image?: string | null;
        artists: Artist[];
        captainId?: string | null;
    };
};

type League = {
    id: string;
    name: string;
    teams: TeamResult[];
};

export default function LeaderboardsPage() {
    const [leagues, setLeagues] = useState<League[]>([]);
    const [artistsRanking, setArtistsRanking] = useState<Artist[]>([]);
    const [activeTab, setActiveTab] = useState<string>("");
    const [viewMode, setViewMode] = useState<"teams" | "artists">("teams");
    const [loading, setLoading] = useState(true);
    const [selectedTeam, setSelectedTeam] = useState<TeamResult | null>(null);
    const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);

    useEffect(() => {
        Promise.all([
            fetch("/api/leaderboards").then(res => res.json()),
            fetch("/api/artists/leaderboard").then(res => res.json())
        ])
            .then(([leaguesData, artistsData]) => {
                setLeagues(leaguesData);
                setArtistsRanking(artistsData);
                if (leaguesData.length > 0) {
                    const defaultTab = leaguesData.find((l: any) => l.name === "Generale")?.name || leaguesData[0].name;
                    setActiveTab(defaultTab);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleArtistClick = async (artist: Artist) => {
        setDetailLoading(true);
        setSelectedArtist(artist);
        try {
            const res = await fetch(`/api/artists/${artist.id}`);
            if (res.ok) {
                const data = await res.json();
                setSelectedArtist(data);
            }
        } catch (err) {
            console.error("Error fetching artist details:", err);
        } finally {
            setDetailLoading(false);
        }
    };

    if (loading) return (
        <main className="min-h-screen text-white pt-44 pb-32 flex flex-col items-center">
            <LeaderboardSkeleton />
        </main>
    );

    const currentLeague = leagues.find(l => l.name === activeTab);

    return (
        <main className="min-h-screen text-white pt-44 pb-32 selection:bg-oro/30">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header Header */}
                <header className="text-center mb-16 space-y-4">
                    <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-oro font-black uppercase tracking-[0.4em] text-[10px]"
                    >
                        Arena Competitiva
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black uppercase tracking-tighter"
                    >
                        Hall of <span className="text-gradient-oro">Fame</span>
                    </motion.h1>
                    <p className="text-gray-400 max-w-xl mx-auto font-light">
                        Monitora in tempo reale le performance dei tuoi Armoni e la scalata delle squadre verso il podio della Piazza.
                    </p>
                </header>

                {/* View Switcher */}
                <div className="flex justify-center mb-16">
                    <div className="glass p-1.5 rounded-[2rem] border-white/5 flex items-center gap-1">
                        <button
                            onClick={() => setViewMode("teams")}
                            className={`flex items-center gap-2 px-8 py-4 rounded-[1.8rem] text-xs font-black uppercase tracking-widest transition-all ${
                                viewMode === "teams" 
                                ? "bg-oro text-blunotte shadow-[0_10px_20px_rgba(255,215,0,0.2)]" 
                                : "text-gray-400 hover:text-white"
                            }`}
                        >
                            <FiUsers size={16} />
                            Classifica Squadre
                        </button>
                        <button
                            onClick={() => setViewMode("artists")}
                            className={`flex items-center gap-2 px-8 py-4 rounded-[1.8rem] text-xs font-black uppercase tracking-widest transition-all ${
                                viewMode === "artists" 
                                ? "bg-oro text-blunotte shadow-[0_10px_20px_rgba(255,215,0,0.2)]" 
                                : "text-gray-400 hover:text-white"
                            }`}
                        >
                            <FiStar size={16} />
                            Top Armoni
                        </button>
                    </div>
                </div>

                <div className="glass rounded-[3.5rem] border-white/5 overflow-hidden shadow-2xl relative">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/[0.03] text-gray-400">
                                    <th className="px-10 py-8 font-black text-[10px] uppercase tracking-[0.2em]">Posizione</th>
                                    <th className="px-10 py-8 font-black text-[10px] uppercase tracking-[0.2em]">{viewMode === "teams" ? "Squadra" : "Armone"}</th>
                                    <th className="px-10 py-8 font-black text-[10px] uppercase tracking-[0.2em] text-right">Performance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <AnimatePresence mode="wait">
                                    {viewMode === "teams" ? (
                                        currentLeague?.teams.map((t, index) => (
                                            <motion.tr
                                                key={`team-${t.team.id}-${index}`}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                onClick={() => setSelectedTeam(t)}
                                                className="hover:bg-white/[0.03] transition-all cursor-pointer group"
                                            >
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-4">
                                                        {index < 3 ? (
                                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg ${
                                                                index === 0 ? "bg-gradient-to-br from-yellow-300 to-oro text-blunotte" :
                                                                index === 1 ? "bg-gradient-to-br from-gray-200 to-gray-400 text-blunotte" :
                                                                "bg-gradient-to-br from-amber-600 to-ocra text-white"
                                                            }`}>
                                                                {index + 1}
                                                            </div>
                                                        ) : (
                                                            <span className="font-black text-2xl text-white/5 ml-4 group-hover:text-white/20 transition-colors">#{index + 1}</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-6">
                                                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-white/5 border border-white/10 group-hover:border-oro/30 transition-all">
                                                            <Image
                                                                src={t.team.image || "/fanta-logo.png"}
                                                                alt={t.team.name}
                                                                fill
                                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                            />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-black group-hover:text-oro transition-colors">{t.team.name}</h3>
                                                            <span className="text-[10px] uppercase font-black tracking-widest text-white/20">Team Manager</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8 text-right">
                                                    <span className="text-3xl font-black text-gradient-oro">{t.score} <span className="text-sm font-light text-white/40">pt</span></span>
                                                </td>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        artistsRanking.map((artist, index) => (
                                            <motion.tr
                                                key={`artist-${artist.id}-${index}`}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                onClick={() => handleArtistClick(artist)}
                                                className="hover:bg-white/[0.05] transition-all cursor-pointer group"
                                            >
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-4">
                                                        {index < 3 ? (
                                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg ${
                                                                index === 0 ? "bg-gradient-to-br from-yellow-300 to-oro text-blunotte" :
                                                                index === 1 ? "bg-gradient-to-br from-gray-200 to-gray-400 text-blunotte" :
                                                                "bg-gradient-to-br from-amber-600 to-ocra text-white"
                                                            }`}>
                                                                {index + 1}
                                                            </div>
                                                        ) : (
                                                            <span className="font-black text-2xl text-white/5 ml-4 group-hover:text-white/20 transition-colors">#{index + 1}</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-6">
                                                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-white/5 border border-white/10 group-hover:border-oro/30 transition-all">
                                                            <Image
                                                                src={artist.image || "/fanta-logo.png"}
                                                                alt={artist.name}
                                                                fill
                                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                            />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-black group-hover:text-oro transition-colors">{artist.name}</h3>
                                                            <span className="text-[10px] uppercase font-black tracking-widest text-white/20">Armone d&apos;Elite</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8 text-right">
                                                    <span className="text-3xl font-black text-gradient-oro">{artist.totalScore} <span className="text-sm font-light text-white/40">pt</span></span>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-12 text-center">
                   <p className="text-gray-500 text-xs font-black uppercase tracking-[0.2em] animate-pulse">
                     💡 Clicca su una riga per esplorare i dettagli
                   </p>
                </div>
            </div>

            {/* MODALS REDESIGN */}
            {/* Team Details Modal */}
            <AnimatePresence>
                {selectedTeam && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedTeam(null)}
                            className="absolute inset-0 bg-blunotte/80 backdrop-blur-2xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl glass rounded-[3rem] border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-10 border-b border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="relative w-20 h-20 rounded-[1.5rem] overflow-hidden border-2 border-oro/30 shadow-2xl">
                                        <Image src={selectedTeam.team.image || "/fanta-logo.png"} alt={selectedTeam.team.name} fill className="object-cover" />
                                    </div>
                                    <div>
                                        <h2 className="text-4xl font-black">{selectedTeam.team.name}</h2>
                                        <span className="text-oro font-black uppercase tracking-widest text-[10px]">Profilo Squadra</span>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedTeam(null)} className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-all text-gray-400 hover:text-white">
                                    <FiX size={24} />
                                </button>
                            </div>

                            <div className="p-10 overflow-y-auto custom-scrollbar space-y-8">
                                <section>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-6 flex items-center gap-2">
                                        <FiUsers /> Roster Attivo
                                    </h4>
                                    <div className="grid grid-cols-1 gap-4">
                                        {selectedTeam.team.artists.map((artist) => (
                                            <div 
                                                key={artist.id} 
                                                onClick={() => handleArtistClick(artist)}
                                                className="glass group/item px-6 py-4 rounded-2xl flex items-center justify-between border-white/5 hover:border-oro/20 transition-all cursor-pointer"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white/5 border border-white/5">
                                                        <Image src={artist.image || "/fanta-logo.png"} alt={artist.name} fill className="object-cover" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-lg group-hover/item:text-oro transition-colors">{artist.name}</p>
                                                        {selectedTeam.team.captainId === artist.id && (
                                                            <span className="flex items-center gap-1 text-[8px] text-oro font-black uppercase tracking-tighter">
                                                                <FiZap /> Capitano
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="text-xl font-black text-white/40">{artist.totalScore} <span className="text-[10px]">pt</span></span>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <div className="flex items-center justify-between p-8 bg-oro/5 border border-oro/10 rounded-2xl">
                                    <span className="text-sm font-black uppercase tracking-widest text-white/60">Punteggio Complessivo</span>
                                    <span className="text-4xl font-black text-oro">{selectedTeam.score} <span className="text-sm">pt</span></span>
                                </div>
                            </div>

                            <div className="p-10 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                                <span className="text-xs text-gray-500 font-medium">Condividi la gloria</span>
                                <SocialShare 
                                    url={`${typeof window !== 'undefined' ? window.location.origin : ''}/team/${selectedTeam.team.id}`} 
                                    title={`Ecco la mia squadra d'elite ${selectedTeam.team.name} su FantaPiazza! 🏆`} 
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Artist Details Modal */}
            <AnimatePresence>
                {selectedArtist && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedArtist(null)}
                            className="absolute inset-0 bg-blunotte/60 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, x: 40 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95, x: 40 }}
                            className="relative w-full max-w-md glass rounded-[3rem] border-oro/20 shadow-[0_30px_80px_rgba(255,215,0,0.15)] overflow-hidden flex flex-col"
                        >
                            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-oro/20">
                                        <Image src={selectedArtist.image || "/fanta-logo.png"} alt={selectedArtist.name} fill className="object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-oro">{selectedArtist.name}</h3>
                                        <span className="text-[10px] uppercase font-black tracking-widest text-white/40">Log Eventi</span>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedArtist(null)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-all text-gray-400">
                                    <FiX size={20} />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto max-h-[50vh] custom-scrollbar space-y-4">
                                {detailLoading ? (
                                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                        <div className="w-8 h-8 border-t-2 border-oro rounded-full animate-spin"></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Accesso Archivio...</span>
                                    </div>
                                ) : selectedArtist.events && selectedArtist.events.length > 0 ? (
                                    selectedArtist.events.map((event) => (
                                        <div key={event.id} className="bg-white/5 p-5 rounded-2xl border border-white/5 flex items-center gap-4 group hover:border-white/10 transition-all">
                                            <div className="flex-grow">
                                                <p className="text-sm font-medium leading-relaxed">{event.description}</p>
                                                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{new Date(event.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className={`text-xl font-black px-4 py-2 rounded-xl ${event.points >= 0 ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                                                {event.points > 0 ? `+${event.points}` : event.points}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 opacity-30 italic font-light">Nessun evento registrato in questa sessione.</div>
                                )}
                            </div>

                            <div className="p-8 bg-oro/5 flex items-center justify-between border-t border-white/5">
                                <span className="font-black text-xs uppercase tracking-widest text-white/40">Punteggio Totale</span>
                                <span className="text-3xl font-black text-oro">{selectedArtist.totalScore}</span>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
}
