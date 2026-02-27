"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type League = {
    id: string;
    name: string;
    teams: {
        score: number;
        team: {
            name: string;
        };
    }[];
};

export default function LeaderboardsPage() {
    const [leagues, setLeagues] = useState<League[]>([]);
    const [activeTab, setActiveTab] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/leaderboards")
            .then(res => res.json())
            .then((data: League[]) => {
                setLeagues(data);
                if (data.length > 0) {
                    // Default to Generale or first available
                    const defaultTab = data.find(l => l.name === "Generale")?.name || data[0].name;
                    setActiveTab(defaultTab);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="min-h-screen bg-blunotte flex items-center justify-center text-white">Caricamento delle classifiche...</div>;
    if (!leagues.length) return <div className="min-h-screen bg-blunotte flex items-center justify-center text-white">Nessuna lega disponibile al momento.</div>;

    const currentLeague = leagues.find(l => l.name === activeTab);

    return (
        <main className="min-h-screen bg-blunotte text-white p-6 md:p-12 pt-48 md:pt-32 pb-32">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Classifiche della <span className="text-oro">Piazza</span></h1>
                    <p className="text-gray-400">Scopri chi domina nelle varie leghe di FantaPiazza.</p>
                </div>


                {/* Tabella Classifica */}
                <div className="bg-[#131d36] rounded-3xl border border-gray-800 shadow-2xl overflow-hidden relative">

                    <table className="w-full text-left">
                        <thead className="bg-[#0a0f1c] text-gray-400 border-b border-gray-800">
                            <tr>
                                <th className="px-6 py-4 font-bold">Posizione</th>
                                <th className="px-6 py-4 font-bold">Squadra</th>
                                <th className="px-6 py-4 font-bold text-right">Punteggio</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence mode="wait">
                                {currentLeague?.teams.map((t, index) => (
                                    <motion.tr
                                        key={`${currentLeague.id}-${t.team.name}`}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-gray-800/50 hover:bg-[#1f2937] transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            {index === 0 ? <span className="text-2xl">🥇</span> :
                                                index === 1 ? <span className="text-2xl">🥈</span> :
                                                    index === 2 ? <span className="text-2xl">🥉</span> :
                                                        <span className="font-mono text-gray-400 ml-2">{index + 1}</span>}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-lg">{t.team.name}</td>
                                        <td className="px-6 py-4 text-right font-mono text-xl font-bold text-oro">{t.score} pt</td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>

                            {(!currentLeague?.teams || currentLeague.teams.length === 0) && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500 italic">
                                        Nessuna squadra ancora iscritta in questa lega.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                </div>

            </div>
        </main>
    );
}
