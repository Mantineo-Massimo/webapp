"use client";

import { useState } from "react";
import { FiInfo, FiCheckCircle, FiAlertTriangle, FiFilter } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

type RuleCategory = "Tutte" | "Canto" | "Danza" | "Tematici" | "Piazza" | "Malus" | "Finale";

type Rule = {
    id: string;
    category: RuleCategory;
    title: string;
    description: string;
    points: number;
};

const rulesData: Rule[] = [
    // 🎤 Canto
    { id: "c1", category: "Canto", title: "A cappella", description: "L'artista canta almeno 15 secondi senza base musicale", points: 15 },
    { id: "c2", category: "Canto", title: "L'Acuto Spezza-Cristalli", description: "L'artista tiene una nota alta per più di 5 secondi", points: 10 },
    { id: "c3", category: "Canto", title: "Standing Ovation", description: "Tutto il pubblico si alza in piedi alla fine", points: 20 },
    { id: "c4", category: "Canto", title: "Pelle d'Oca", description: "Almeno un giurato viene inquadrato mentre si tocca il braccio per l'emozione", points: 10 },
    { id: "c5", category: "Canto", title: "Dedicato a te", description: "L'artista dedica la canzone a qualcuno presente in piazza", points: 5 },
    { id: "c6", category: "Canto", title: "Microfono a giraffa", description: "L'artista stacca il microfono dall'asta", points: 5 },
    { id: "c7", category: "Canto", title: "Il \"Batti le mani\"", description: "L'artista incita la piazza a battere le mani a tempo", points: 5 },
    { id: "c8", category: "Canto", title: "Vocalizzo selvaggio", description: "L'artista imita il verso di un animale o un suono non umano durante il brano", points: 10 },

    // 💃 Danza
    { id: "d1", category: "Danza", title: "Spaccata Improvvisa", description: "L'artista esegue una spaccata (anche se non prevista)", points: 15 },
    { id: "d2", category: "Danza", title: "Presa Acrobatica", description: "Sollevamento o acrobazia che sfida la gravità", points: 15 },
    { id: "d3", category: "Danza", title: "Sincro Perfetto", description: "Se in gruppo, i ballerini si muovono come un unico organismo per tutto il tempo", points: 10 },
    { id: "d4", category: "Danza", title: "Polvere di Fata", description: "L'artista usa borotalco o glitter che volano via durante un movimento", points: 10 },
    { id: "d5", category: "Danza", title: "Oggetto di Scena", description: "Uso creativo di un oggetto non convenzionale (una sedia, un ombrello, una maschera)", points: 10 },
    { id: "d6", category: "Danza", title: "Coreografia in Platea", description: "Il ballerino danza tra le sedie degli spettatori", points: 15 },
    { id: "d7", category: "Danza", title: "Assolo Infuocato", description: "Almeno 20 secondi di danza solista senza altri artisti sul palco", points: 10 },

    // 🔮 Tematici "Morgana & Orum"
    { id: "t1", category: "Tematici", title: "Mantello del Mistero", description: "L'artista indossa un mantello", points: 10 },
    { id: "t2", category: "Tematici", title: "Trasformismo", description: "Cambio d'abito rapido (on-stage)", points: 20 },
    { id: "t3", category: "Tematici", title: "Patto con l'Admin", description: "L'artista saluta l'Admin", points: 10 },
    { id: "t4", category: "Tematici", title: "Dab con Parisi", description: "L'artista fa la dab con il presentatore", points: 5 },
    { id: "t5", category: "Tematici", title: "Il Simbolo Segreto", description: "L'artista fa il ringraziamento per le associazioni Morgana o Orum", points: 15 },

    // 🎭 Piazza
    { id: "p1", category: "Piazza", title: "Pioggia d'Applausi", description: "Inizia a piovere ma l'artista continua l'esibizione", points: 30 },
    { id: "p2", category: "Piazza", title: "Incursione Animale", description: "Un cane, un gatto o un uccello entra nell'area della performance (Bonus Leggendario)", points: 50 },
    { id: "p3", category: "Piazza", title: "Parenti Serpenti", description: "Una nonna o un genitore dell'artista piange in prima fila", points: 15 },
    { id: "p4", category: "Piazza", title: "Il Bis", description: "Il pubblico urla \"Bis!\" a gran voce", points: 10 },
    { id: "p5", category: "Piazza", title: "Regalo dal Pubblico", description: "Qualcuno lancia un fiore o un peluche sul palco", points: 10 },

    // 💀 Malus
    { id: "m1", category: "Malus", title: "Nudo ma non Crudo", description: "Perdita accidentale di una spallina o pezzo di costume che rivela troppo", points: -20 },
    { id: "m2", category: "Malus", title: "Caduta del Microfono", description: "Il microfono scivola di mano", points: -10 },
    { id: "m3", category: "Malus", title: "Audio Fantasma", description: "Parte la base sbagliata o la base si ferma a metà", points: -15 },
    { id: "m4", category: "Malus", title: "Gelo in Piazza", description: "L'artista fa una battuta che non fa ridere nessuno", points: -10 },
    { id: "m5", category: "Malus", title: "Autogol", description: "L'artista inciampa sui cavi del service", points: -10 },
    { id: "m6", category: "Malus", title: "L'Orologio", description: "L'esibizione dura più di 2 minuti oltre il tempo massimo", points: -10 },
    { id: "m7", category: "Malus", title: "Polemica in Diretta", description: "L'artista contesta il voto della giuria appena lo riceve", points: -20 },
    { id: "m8", category: "Malus", title: "Il \"Fuori Tempo\"", description: "Il ballerino finisce la coreografia dopo che la musica è già spenta", points: -5 },

    // 🏆 Finale
    { id: "f1", category: "Finale", title: "Vittoria Assoluta", description: "L'artista vince il premio della serata", points: 50 },
    { id: "f2", category: "Finale", title: "Ultimo Posto", description: "L'artista arriva ultimo nella classifica ufficiale (Bonus Consolazione)", points: 10 },
];

const categories: RuleCategory[] = ["Tutte", "Canto", "Danza", "Tematici", "Piazza", "Malus", "Finale"];

export default function RegolamentoPage() {
    const [activeFilter, setActiveFilter] = useState<RuleCategory>("Tutte");

    const filteredRules = rulesData.filter(rule =>
        activeFilter === "Tutte" ? true : rule.category === activeFilter
    );

    const getRuleColor = (points: number) => {
        if (points >= 50) return "text-oro bg-oro/20 border-oro/50";
        if (points > 0) return "text-green-400 bg-green-900/40 border-green-500/50";
        return "text-red-500 bg-red-900/40 border-red-500/50";
    };

    const getIconForCategory = (category: string) => {
        if (category === "Malus") return <FiAlertTriangle className="text-red-500 mt-1" size={20} />;
        return <FiCheckCircle className="text-green-500 mt-1" size={20} />;
    };

    return (
        <main className="min-h-screen bg-blunotte text-white p-6 md:p-12 pt-40 md:pt-32 pb-32 relative overflow-hidden">
            {/* Sfondo animato (Orbs) */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-oro opacity-5 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-viola opacity-5 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
                        Il <span className="text-oro drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]">Regolamento</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Tutto quello che c&apos;è da sapere per giocare e vincere nella Piazza dell&apos;Arte.
                    </p>
                </div>

                {/* Sezione Regole Generali */}
                <div className="mb-16">
                    <section className="bg-[#131d36]/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-800 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-oro to-ocra"></div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-oro/20 rounded-xl text-oro">
                                <FiInfo size={28} />
                            </div>
                            <h2 className="text-3xl font-bold">Come funziona</h2>
                        </div>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300 leading-relaxed text-lg">
                            <li className="flex gap-3 bg-[#0a0f1c]/50 p-4 rounded-xl border border-gray-800/80">
                                <span className="text-oro mt-1">✦</span>
                                <span>Ogni giocatore ha a disposizione <strong>100 Armoni</strong> per creare la propria squadra scegliendo 5 artisti.</span>
                            </li>
                            <li className="flex gap-3 bg-[#0a0f1c]/50 p-4 rounded-xl border border-gray-800/80">
                                <span className="text-oro mt-1">✦</span>
                                <span>Il punteggio della tua squadra è la somma dei punti accumulati dagli artisti durante l&apos;evento.</span>
                            </li>
                            <li className="flex gap-3 bg-[#0a0f1c]/50 p-4 rounded-xl border border-gray-800/80">
                                <span className="text-oro mt-1">✦</span>
                                <span>La squadra può essere modificata liberamente fino alla chiusura delle iscrizioni.</span>
                            </li>
                            <li className="flex gap-3 bg-[#0a0f1c]/50 p-4 rounded-xl border border-gray-800/80">
                                <span className="text-oro mt-1">✦</span>
                                <span>L&apos;attribuzione di Bonus e Malus è a totale discrezione dell&apos;amministrazione dell&apos;evento.</span>
                            </li>
                        </ul>
                    </section>
                </div>

                {/* Tabella Bonus e Malus con Filtri */}
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-extrabold mb-4">Legenda <span className="text-viola drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]">Bonus & Malus</span></h2>
                    <p className="text-gray-400 mb-8">Scopri le azioni che determineranno la vittoria o la sconfitta della tua squadra.</p>

                    {/* Filtri */}
                    <div className="flex flex-wrap justify-center gap-3 mb-10">
                        <div className="flex items-center gap-2 mr-2 text-gray-500">
                            <FiFilter size={18} />
                            <span className="text-sm font-bold uppercase tracking-wider">Filtra per:</span>
                        </div>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveFilter(cat)}
                                className={`px-5 py-2 rounded-full font-bold text-sm transition-all shadow-lg ${activeFilter === cat
                                    ? cat === "Malus"
                                        ? "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                                        : "bg-oro text-blunotte shadow-[0_0_15px_rgba(255,215,0,0.5)]"
                                    : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Lista Regole */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredRules.map((rule) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                                key={rule.id}
                                className={`bg-[#131d36]/50 backdrop-blur-md rounded-2xl p-6 border relative transition-all hover:-translate-y-1 ${rule.points < 0 ? "border-red-900/50 hover:border-red-500" : "border-gray-800 hover:border-oro"
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        {getIconForCategory(rule.category)}
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-xl font-bold">{rule.title}</h3>
                                                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-gray-800 text-gray-400">
                                                    {rule.category}
                                                </span>
                                            </div>
                                            <p className="text-gray-400 leading-relaxed text-sm">{rule.description}</p>
                                        </div>
                                    </div>
                                    <div className={`flex-shrink-0 font-black text-xl px-4 py-2 rounded-xl border ${getRuleColor(rule.points)}`}>
                                        {rule.points > 0 ? `+${rule.points}` : rule.points}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

            </div>
        </main>
    );
}
