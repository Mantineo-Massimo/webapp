"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SocialShare from "@/components/SocialShare";
import LeaderboardSkeleton from "./Skeleton";

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
        name: string;
        image?: string | null;
        artists: Artist[];
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

    if (loading) return (
        <main className="min-h-screen text-white p-6 md:p-12 pt-56 md:pt-44 pb-32">
            <LeaderboardSkeleton />
        </main>
    );

    if (!leagues.length && !artistsRanking.length) return <div className="min-h-screen bg-blunotte flex items-center justify-center text-white">Nessun dato disponibile al momento.</div>;

    const currentLeague = leagues.find(l => l.name === activeTab);

    return (
        <main className="min-h-screen text-white p-6 md:p-12 pt-56 md:pt-44 pb-32">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Classifiche della <span className="text-oro">Piazza</span></h1>
                    <p className="text-gray-400">Tieni d'occhio i punteggi di squadre e artisti in tempo reale.</p>
                </div>

                {/* Tab Switcher (Teams vs Artists) */}
                <div className="flex justify-center mb-10">
                    <div className="bg-[#131d36] p-1.5 rounded-2xl border border-gray-800 flex gap-1">
                        <button
                            onClick={() => setViewMode("teams")}
                            className={`px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${viewMode === "teams" ? "bg-oro text-blunotte shadow-lg shadow-oro/20" : "text-gray-500 hover:text-white"}`}
                        >
                            Podio Squadre
                        </button>
                        <button
                            onClick={() => setViewMode("artists")}
                            className={`px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${viewMode === "artists" ? "bg-oro text-blunotte shadow-lg shadow-oro/20" : "text-gray-500 hover:text-white"}`}
                        >
                            Top Armoni
                        </button>
                    </div>
                </div>

                {/* League Tabs (Only for Teams) */}
                {viewMode === "teams" && leagues.length > 1 && (
                    <div className="flex flex-wrap justify-center gap-4 mb-10">
                        {leagues.map(l => (
                            <button
                                key={l.id}
                                onClick={() => setActiveTab(l.name)}
                                className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${activeTab === l.name ? "bg-white/10 border-oro text-oro" : "border-gray-800 text-gray-500 hover:border-gray-600"}`}
                            >
                                {l.name}
                            </button>
                        ))}
                    </div>
                )}

                <p className="text-oro/60 text-xs text-center mb-6 animate-pulse font-bold uppercase tracking-tighter">
                    {viewMode === "teams" ? "💡 Clicca su una squadra per vedere i suoi Armoni" : "💡 Clicca su un artista per vedere i suoi Bonus/Malus"}
                </p>

                {/* Tabella Classifica */}
                <div className="bg-[#131d36] rounded-3xl border border-gray-800 shadow-2xl overflow-hidden relative">
                    <table className="w-full text-left">
                        <thead className="bg-[#0a0f1c] text-gray-400 border-b border-gray-800">
                            <tr>
                                <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest">Rank</th>
                                <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest">{viewMode === "teams" ? "Squadra" : "Artista"}</th>
                                <th className="px-6 py-4 font-bold text-xs uppercase tracking-widest text-right">Punti</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence mode="wait">
                                {viewMode === "teams" ? (
                                    currentLeague?.teams.map((t, index) => (
                                        <motion.tr
                                            key={`${currentLeague.id}-${t.team.name}`}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            onClick={() => setSelectedTeam(t)}
                                            className="border-b border-gray-800/50 hover:bg-[#1f2937] transition-colors cursor-pointer group"
                                        >
                                            <td className="px-6 py-4">
                                                {index === 0 ? <span className="text-2xl">🥇</span> :
                                                    index === 1 ? <span className="text-2xl">🥈</span> :
                                                        index === 2 ? <span className="text-2xl">🥉</span> :
                                                            <span className="font-mono text-gray-400 ml-2">{index + 1}</span>}
                                            </td>
                                            <td className="px-6 py-4 flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-[#0a0f1c] border border-gray-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                                    {t.team.image ? (
                                                        <img src={t.team.image} alt={t.team.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <img src="/fanta-logo.png" alt="Default" className="w-full h-full object-contain p-1.5 opacity-40 shrink-0" />
                                                    )}
                                                </div>
                                                <span className="font-bold text-lg">{t.team.name}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono text-xl font-bold text-oro">{t.score} pt</td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    artistsRanking.map((artist, index) => (
                                        <motion.tr
                                            key={artist.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            onClick={() => setSelectedArtist(artist)}
                                            className="border-b border-gray-800/50 hover:bg-[#1f2937] transition-colors cursor-pointer group"
                                        >
                                            <td className="px-6 py-4">
                                                {index === 0 ? <span className="text-2xl">🥇</span> :
                                                    index === 1 ? <span className="text-2xl">🥈</span> :
                                                        index === 2 ? <span className="text-2xl">🥉</span> :
                                                            <span className="font-mono text-gray-400 ml-2">{index + 1}</span>}
                                            </td>
                                            <td className="px-6 py-4 flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-[#0a0f1c] border border-gray-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                                    {artist.image ? (
                                                        <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-oro font-black">{artist.name.charAt(0)}</span>
                                                    )}
                                                </div>
                                                <span className="font-bold text-lg">{artist.name}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono text-xl font-bold text-oro">{artist.totalScore} pt</td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>

                            {viewMode === "teams" && (!currentLeague?.teams || currentLeague.teams.length === 0) && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500 italic">
                                        Nessuna squadra ancora iscritta in questa lega.
                                    </td>
                                </tr>
                            )}
                            {viewMode === "artists" && artistsRanking.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500 italic">
                                        Nessun artista trovato.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Modal Dettaglio Squadra */}
                <AnimatePresence>
                    {selectedTeam && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedTeam(null)}
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="relative bg-[#131d36] w-full max-w-lg rounded-3xl border border-gray-700 shadow-2xl overflow-hidden p-8 z-10"
                            >
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="w-24 h-24 rounded-3xl bg-[#0a0f1c] border-2 border-oro/30 overflow-hidden flex items-center justify-center shrink-0">
                                        {selectedTeam.team.image ? (
                                            <img src={selectedTeam.team.image} alt={selectedTeam.team.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <img src="/fanta-logo.png" alt="Default" className="w-full h-full object-contain p-3 opacity-40" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-3xl font-black text-oro">{selectedTeam.team.name}</h2>
                                        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">Squadra FantaPiazza</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedTeam(null)}
                                        className="text-gray-400 hover:text-white transition-colors p-2 bg-white/5 rounded-full self-start"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest">Gli Armoni della squadra</h3>
                                    <div className="divide-y divide-gray-800/50">
                                        {selectedTeam.team.artists.map((artist) => (
                                            <div
                                                key={artist.id}
                                                onClick={() => setSelectedArtist(artist)}
                                                className="flex justify-between items-center py-4 cursor-pointer hover:bg-white/5 px-2 -mx-2 rounded-xl transition-colors group/artist"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-xl bg-[#1e293b] border border-gray-700 overflow-hidden flex-shrink-0 flex items-center justify-center text-oro font-bold text-sm group-hover/artist:border-oro transition-colors">
                                                        {artist.image ? (
                                                            <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            artist.name.charAt(0)
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-lg">{artist.name}</span>
                                                            {(selectedTeam.team as any).captainId === artist.id && (
                                                                <span className="bg-oro text-blunotte text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-tighter">Capitano</span>
                                                            )}
                                                        </div>
                                                        <span className="text-[10px] text-oro/60 uppercase font-black">Clicca per dettagli</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="block font-mono text-xl font-bold text-oro">{artist.totalScore}</span>
                                                    <span className="text-[10px] text-gray-500 uppercase font-black">Punti</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-800 flex justify-between items-center">
                                    <span className="text-gray-400 font-bold">Punteggio Totale</span>
                                    <span className="text-3xl font-black text-oro">{selectedTeam.score} pt</span>
                                </div>

                                {/* Social Share */}
                                <div className="mt-6">
                                    <SocialShare
                                        url={`${window.location.origin}/team/${(selectedTeam.team as any).id || ""}`}
                                        title={`Guarda la squadra ${selectedTeam.team.name} su FantaPiazza! 🏆`}
                                    />
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Modal Dettaglio Artista (Eventi) */}
                <AnimatePresence>
                    {selectedArtist && (
                        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedArtist(null)}
                                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                                className="relative bg-[#0f172a] w-full max-w-md rounded-3xl border border-oro/30 shadow-[0_0_40px_rgba(255,215,0,0.15)] overflow-hidden p-8 z-10"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-[#1e293b] border border-oro/30 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                            {selectedArtist.image ? (
                                                <img src={selectedArtist.image} alt={selectedArtist.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-2xl font-black text-oro">{selectedArtist.name.charAt(0)}</span>
                                            )}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-oro">{selectedArtist.name}</h2>
                                            <p className="text-gray-400 text-xs uppercase font-bold tracking-widest mt-1">Cronologia Bonus & Malus</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedArtist(null)}
                                        className="text-gray-400 hover:text-white transition-colors p-2 bg-white/5 rounded-full"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {selectedArtist.events && selectedArtist.events.length > 0 ? (
                                        selectedArtist.events.map((event) => (
                                            <div key={event.id} className="bg-[#1e293b]/50 border border-gray-800 p-4 rounded-2xl flex justify-between items-center gap-4">
                                                <div className="flex-1">
                                                    <p className="text-white text-sm leading-relaxed">{event.description}</p>
                                                    <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold">{new Date(event.createdAt).toLocaleDateString('it-IT')}</p>
                                                </div>
                                                <div className={`text-right font-mono font-black text-xl px-3 py-1 rounded-lg ${event.points >= 0 ? "text-green-500 bg-green-500/10" : "text-red-500 bg-red-500/10"}`}>
                                                    {event.points > 0 ? `+${event.points}` : event.points}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 text-gray-500 italic">
                                            Nessun bonus o malus ancora assegnato a questo artista.
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-800/50 flex justify-between items-center">
                                    <span className="text-gray-400 font-bold uppercase text-xs tracking-wider">Bilancio Finale</span>
                                    <span className="text-2xl font-black text-oro">{selectedArtist.totalScore} pt</span>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
