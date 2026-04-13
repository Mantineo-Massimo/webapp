"use client";

import { motion } from "framer-motion";
import { FiUserPlus, FiUsers, FiAward, FiArrowRight } from "react-icons/fi";

const steps = [
    {
        icon: FiUserPlus,
        title: "Iscrizione",
        subtitle: "Il tuo pass d'artista",
        description: "Crea il tuo profilo in meno di un minuto e preparati a scalare la vetta della Piazza.",
        color: "from-oro to-ocra",
        iconColor: "text-blunotte"
    },
    {
        icon: FiUsers,
        title: "Team Draft",
        subtitle: "L'Arte è Strategia",
        description: "Drafta i tuoi 5 artisti d'élite con 100 Armoni. Il budget è limitato, il talento no.",
        color: "from-viola to-purple-600",
        iconColor: "text-white"
    },
    {
        icon: FiAward,
        title: "Gloria",
        subtitle: "Piazza d'Onore",
        description: "Accumula punti bonus, domina le leghe di Morgana e Orum e vinci premi culturali esclusivi.",
        color: "from-oro to-ocra",
        iconColor: "text-blunotte"
    }
];

export default function HowToPlay() {
    return (
        <section className="py-32 relative overflow-hidden bg-white/[0.01]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
                    <div className="space-y-4">
                        <span className="text-oro font-black uppercase tracking-[0.5em] text-xs">Getting Started</span>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
                            Domina la <br /> <span className="text-gradient-oro">Piazza</span>
                        </h2>
                    </div>
                    <p className="text-gray-400 max-w-sm text-lg font-light leading-relaxed">
                        Entra nell&apos;elite del Fantagioco dedicato alle associazioni universitarie Morgana e Orum. 
                        Pochi passi separano i sognatori dai vincitori.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.8 }}
                            className="glass group p-10 rounded-[3rem] border-white/5 relative flex flex-col items-start hover:border-oro/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                        >
                            {/* Step Number */}
                            <div className="absolute top-10 right-10 text-6xl font-black text-white/[0.03] pointer-events-none group-hover:text-oro/10 transition-colors duration-500">
                                0{index + 1}
                            </div>

                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} ${step.iconColor} flex items-center justify-center mb-8 shadow-xl transform rotate-3 group-hover:rotate-12 transition-all duration-500`}>
                                <step.icon size={28} />
                            </div>

                            <div className="space-y-4 flex-grow">
                                <div>
                                    <span className="text-[10px] font-black text-oro uppercase tracking-widest">{step.subtitle}</span>
                                    <h3 className="text-3xl font-black mt-1">{step.title}</h3>
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed font-light">{step.description}</p>
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/5 w-full flex items-center justify-between group-hover:border-oro/20 transition-colors">
                                <span className="text-[10px] uppercase font-black tracking-widest text-white/40 group-hover:text-oro transition-colors">scopri di più</span>
                                <FiArrowRight className="text-gray-600 group-hover:text-oro transition-all group-hover:translate-x-1" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
