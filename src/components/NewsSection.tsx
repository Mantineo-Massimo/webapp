"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FiCalendar, FiArrowRight, FiInfo } from "react-icons/fi";

interface NewsItem {
    id: string;
    title: string;
    content: string;
    image?: string;
    createdAt: string;
}

export default function NewsSection() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/news")
            .then(res => res.json())
            .then(data => {
                setNews(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center py-20 animate-pulse">
            <div className="w-20 h-20 bg-white/5 rounded-full mb-4"></div>
            <div className="h-4 w-48 bg-white/5 rounded"></div>
        </div>
    );

    if (news.length === 0) return null;

    return (
        <div className="space-y-16">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-oro mb-2 tracking-[0.3em] font-black text-[10px] uppercase">
                        <FiInfo /> Update dalla Piazza
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Ultime <span className="text-oro">News</span></h2>
                </div>
                <button className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-white transition-colors group">
                    Scopri tutto l&apos;archivio <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {news.map((item, index) => (
                    <motion.article
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative flex flex-col bg-[#0d1224]/50 rounded-[2.5rem] border border-white/5 overflow-hidden hover:border-oro/20 transition-all duration-500 hover:-translate-y-2 shadow-2xl"
                    >
                        <div className="relative h-64 overflow-hidden">
                            <Image
                                src={item.image || "/fanta-logo.png"}
                                alt={item.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1224] to-transparent"></div>
                            <div className="absolute top-6 left-6 flex items-center gap-2 bg-blunotte/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest">
                                <FiCalendar className="text-oro" /> {new Date(item.createdAt).toLocaleDateString()}
                            </div>
                        </div>

                        <div className="p-8 space-y-4 flex-grow flex flex-col">
                            <h3 className="text-2xl font-black leading-tight group-hover:text-oro transition-colors line-clamp-2">
                                {item.title}
                            </h3>
                            <p className="text-gray-400 text-sm font-light leading-relaxed line-clamp-3">
                                {item.content}
                            </p>
                            <div className="pt-6 mt-auto">
                                <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 font-bold group-hover:bg-oro group-hover:text-blunotte transition-all duration-500 flex items-center justify-center gap-2">
                                    Leggi di più <FiArrowRight className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                </button>
                            </div>
                        </div>
                    </motion.article>
                ))}
            </div>
        </div>
    );
}
