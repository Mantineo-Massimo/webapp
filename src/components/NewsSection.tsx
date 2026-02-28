"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiCalendar } from "react-icons/fi";
import Link from "next/link";

type NewsItem = {
    id: string;
    title: string;
    content: string;
    image?: string | null;
    createdAt: string;
};

export default function NewsSection() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/news")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setNews(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading news:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="h-8 w-48 bg-gray-800 rounded-lg mb-8 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-[#131d36]/50 rounded-3xl h-80 animate-pulse border border-gray-800"></div>
                ))}
            </div>
        </div>
    );

    if (news.length === 0) return null;

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-viola opacity-[0.03] blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                            Ultime <span className="text-oro drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]">News</span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-xl">
                            Rimani aggiornato su tutto quello che succede nella Piazza dell'Arte.
                        </p>
                    </div>
                    {/* Future link to News Archive if needed */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {news.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group bg-[#131d36]/40 backdrop-blur-md rounded-[2.5rem] border border-gray-800 hover:border-oro/30 transition-all duration-500 overflow-hidden flex flex-col h-full"
                        >
                            {item.image && (
                                <div className="h-52 w-full overflow-hidden relative">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#131d36] to-transparent opacity-60"></div>
                                </div>
                            )}
                            <div className="p-8 flex flex-col flex-1">
                                <div className="flex items-center gap-2 text-oro/60 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                                    <FiCalendar />
                                    {new Date(item.createdAt).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })}
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-oro transition-colors line-clamp-2 leading-tight">
                                    {item.title}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed mb-8 line-clamp-3">
                                    {item.content}
                                </p>
                                <div className="mt-auto">
                                    <button className="flex items-center gap-2 text-white font-bold text-sm group/btn hover:text-oro transition-all">
                                        Leggi tutto
                                        <FiArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
