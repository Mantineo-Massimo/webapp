"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
    FiHome, FiList, FiPlus, FiLogOut, FiSettings,
    FiBookOpen, FiUser, FiMenu, FiX
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    if (pathname.startsWith("/auth")) return null;

    const navLinks = [
        { href: "/", label: "Home", icon: FiHome },
        { href: "/regolamento", label: "Regole", icon: FiBookOpen },
        { href: "/leaderboards", label: "Ranking", icon: FiList },
    ];

    if (status === "authenticated" && session) {
        navLinks.push({ href: "/team/create", label: "Arena", icon: FiPlus });
        navLinks.push({ href: "/account", label: "Profilo", icon: FiUser });
    }

    const isAdmin = status === "authenticated" && session?.user?.role === "ADMIN";

    return (
        <>
            <nav className={`fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-[100] transition-all duration-700 ${
                scrolled ? "top-2" : "top-4"
            }`}>
                <div className={`glass rounded-[2rem] px-6 h-16 md:h-20 flex items-center justify-between transition-all duration-500 ${
                    scrolled ? "bg-blunotte/80 border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.4)]" : "bg-white/5 border-white/5"
                }`}>
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex-shrink-0 flex items-center group relative">
                            <Image
                                src="/fanta-logo.png"
                                alt="FantaPiazza Logo"
                                width={180}
                                height={60}
                                className={`w-auto object-contain transition-all duration-500 group-hover:scale-105 ${
                                    scrolled ? "h-10 md:h-12" : "h-12 md:h-16"
                                }`}
                            />
                            <div className="absolute -inset-2 bg-oro/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden lg:flex items-center gap-1">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`relative group flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                                            isActive 
                                            ? "text-white" 
                                            : "text-gray-400 hover:text-white"
                                        }`}
                                    >
                                        <Icon size={16} className={isActive ? "text-oro" : "text-gray-500 group-hover:text-gray-300"} />
                                        {link.label}
                                        {isActive && (
                                            <motion.div 
                                                layoutId="nav-active"
                                                className="absolute inset-0 bg-white/5 border border-white/10 rounded-full -z-10"
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden lg:flex items-center gap-3">
                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold border border-viola/30 bg-viola/10 hover:bg-viola/20 transition-all ${
                                        pathname.startsWith("/admin") ? "text-white" : "text-viola-400"
                                    }`}
                                >
                                    <FiSettings size={16} />
                                    Admin
                                </Link>
                            )}

                            {status === "authenticated" ? (
                                <button
                                    onClick={() => signOut()}
                                    className="px-5 py-2.5 text-sm font-black text-white/40 hover:text-red-400 transition-all uppercase tracking-widest"
                                >
                                    Esci
                                </button>
                            ) : (
                                <Link
                                    href="/auth/login"
                                    className="px-8 py-2.5 bg-gradient-to-r from-oro to-ocra text-blunotte font-black rounded-full hover:shadow-[0_0_20px_var(--oro-glow)] transition-all uppercase tracking-tighter"
                                >
                                    Accedi
                                </Link>
                            )}
                        </div>

                        {/* Mobile Hamburger Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-3 bg-white/5 rounded-2xl text-oro hover:bg-white/10 transition-all"
                        >
                            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-[90] bg-blunotte/95 backdrop-blur-2xl flex flex-col items-center justify-center p-8 lg:hidden"
                    >
                        <div className="flex flex-col space-y-6 w-full max-w-sm">
                            {navLinks.map((link, index) => {
                                const Icon = link.icon;
                                const isActive = pathname === link.href;
                                return (
                                    <motion.div
                                        key={link.href}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Link
                                            href={link.href}
                                            className={`flex items-center gap-5 py-5 px-8 rounded-[2rem] text-2xl font-black transition-all ${
                                                isActive ? "bg-oro text-blunotte" : "text-gray-400 hover:text-white hover:bg-white/5"
                                            }`}
                                        >
                                            <Icon size={32} />
                                            {link.label}
                                        </Link>
                                    </motion.div>
                                );
                            })}
                            
                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    className="flex items-center gap-5 py-5 px-8 rounded-[2rem] text-2xl font-black text-viola-400 border border-viola/20 bg-viola/5"
                                >
                                    <FiSettings size={32} />
                                    Admin Panel
                                </Link>
                            )}

                            <div className="pt-8 border-t border-white/5 mt-4">
                                {status === "authenticated" ? (
                                    <button
                                        onClick={() => signOut()}
                                        className="w-full py-5 rounded-[2rem] bg-red-500/10 text-red-500 font-black text-xl uppercase"
                                    >
                                        Disconnetti
                                    </button>
                                ) : (
                                    <Link
                                        href="/auth/login"
                                        className="w-full block text-center py-5 rounded-[2rem] bg-oro text-blunotte font-black text-2xl uppercase shadow-[0_0_30px_var(--oro-glow)]"
                                    >
                                        Accedi
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
