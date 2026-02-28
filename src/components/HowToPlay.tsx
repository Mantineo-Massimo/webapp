"use client";

import { motion } from "framer-motion";
import { FiUserPlus, FiUsers, FiAward } from "react-icons/fi";

const steps = [
    {
        icon: FiUserPlus,
        title: "Iscriviti",
        description: "Crea il tuo account in pochi secondi per iniziare la tua scalata verso la vittoria.",
        color: "bg-oro",
        textColor: "text-blunotte"
    },
    {
        icon: FiUsers,
        title: "Crea la Squadra",
        description: "Scegli i tuoi 5 artisti preferiti con un budget di 100 Armoni. Sii strategico!",
        color: "bg-viola",
        textColor: "text-white"
    },
    {
        icon: FiAward,
        title: "Vinci",
        description: "Accumula punti grazie alle performance dei tuoi artisti e scala la classifica generale.",
        color: "bg-oro",
        textColor: "text-blunotte"
    }
];

export default function HowToPlay() {
    return (
        <section className="py-24 bg-[#0a0f1c]/30 backdrop-blur-sm border-y border-gray-800/30">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black mb-4">Come si <span className="text-oro">Gioca</span></h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">Tre semplici passi per entrare nel vivo della competizione più artistica dell'anno.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Connection Line (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-800/50 -translate-y-1/2 z-0"></div>

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="relative z-10 flex flex-col items-center text-center group"
                        >
                            <div className={`${step.color} ${step.textColor} w-20 h-20 rounded-[2rem] flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                <step.icon size={36} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed max-w-[250px]">{step.description}</p>

                            {/* Step Number Badge */}
                            <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-gray-800 border-2 border-[#131d36] text-[10px] font-black flex items-center justify-center text-oro">
                                0{index + 1}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
