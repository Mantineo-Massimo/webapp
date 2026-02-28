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

    // Chiudi il menu quando cambia la rotta
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    if (pathname.startsWith("/auth")) return null;

    const navLinks = [
        { href: "/", label: "Home", icon: FiHome },
        { href: "/regolamento", label: "Regolamento", icon: FiBookOpen },
        { href: "/leaderboards", label: "Classifiche", icon: FiList },
    ];

    if (status === "authenticated" && session) {
        navLinks.push({ href: "/team/create", label: "Mia Squadra", icon: FiPlus });
        navLinks.push({ href: "/account", label: "Account", icon: FiUser });
    }

    const isAdmin = status === "authenticated" && session?.user?.role === "ADMIN";

    return (
        <>
            <nav className={`fixed top-0 w-full backdrop-blur-xl border-b border-gray-800/10 z-[60] transition-all duration-500 ${scrolled ? "h-16 bg-[#0a0f1c]/90" : "h-24 md:h-28 bg-[#0a0f1c]/60"
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                    <div className="flex justify-between h-full items-center">
                        <div className="flex items-center">
                            <Link href="/" className="flex-shrink-0 flex items-center group">
                                <Image
                                    src="/fanta-logo.png"
                                    alt="FantaPiazza Logo"
                                    width={400}
                                    height={150}
                                    className={`w-auto object-contain drop-shadow-[0_0_15px_rgba(255,215,0,0.3)] group-hover:drop-shadow-[0_0_20px_rgba(255,215,0,0.5)] transition-all duration-500 ${scrolled ? "h-10 md:h-12" : "h-16 md:h-20"
                                        }`}
                                />
                            </Link>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-2">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${isActive
                                            ? "text-oro bg-gray-800/40"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                            }`}
                                    >
                                        <Icon size={18} className={isActive ? "text-oro" : "text-gray-500"} />
                                        {link.label}
                                    </Link>
                                );
                            })}

                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 border border-purple-500/10 ${pathname.startsWith("/admin")
                                        ? "text-purple-400 bg-purple-500/10"
                                        : "text-gray-400 hover:text-purple-300 hover:bg-purple-500/5"
                                        }`}
                                >
                                    <FiSettings size={18} />
                                    Admin
                                </Link>
                            )}

                            {status === "authenticated" ? (
                                <button
                                    onClick={() => signOut()}
                                    className="px-5 py-2 text-sm font-bold text-red-500/70 hover:text-red-500 transition-colors ml-4"
                                >
                                    Esci
                                </button>
                            ) : (
                                <Link
                                    href="/auth/login"
                                    className="px-6 py-2 bg-oro text-blunotte font-black rounded-full hover:scale-105 transition-all ml-4"
                                >
                                    Accedi
                                </Link>
                            )}
                        </div>

                        {/* Mobile Hamburger Toggle */}
                        <div className="flex md:hidden items-center">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 text-gray-400 hover:text-white transition-colors"
                            >
                                {isMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[55] bg-blunotte flex flex-col pt-32 px-8"
                    >
                        <div className="flex flex-col space-y-4">
                            {navLinks.map((link, index) => {
                                const Icon = link.icon;
                                const isActive = pathname === link.href;
                                return (
                                    <motion.div
                                        key={link.href}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 + index * 0.1 }}
                                    >
                                        <Link
                                            href={link.href}
                                            className={`flex items-center gap-4 py-4 px-6 rounded-2xl text-xl font-bold transition-all ${isActive ? "bg-oro text-blunotte" : "text-gray-400 hover:text-white hover:bg-white/5"
                                                }`}
                                        >
                                            <Icon size={24} />
                                            {link.label}
                                        </Link>
                                    </motion.div>
                                );
                            })}

                            {isAdmin && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + navLinks.length * 0.1 }}
                                >
                                    <Link
                                        href="/admin"
                                        className="flex items-center gap-4 py-4 px-6 rounded-2xl text-xl font-bold text-purple-400 border border-purple-500/20 bg-purple-500/5 mt-4"
                                    >
                                        <FiSettings size={24} />
                                        Admin Dashboard
                                    </Link>
                                </motion.div>
                            )}
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-auto mb-12 flex flex-col gap-4"
                        >
                            {status === "authenticated" ? (
                                <button
                                    onClick={() => signOut()}
                                    className="w-full py-4 rounded-2xl bg-red-500/10 text-red-500 font-bold border border-red-500/20"
                                >
                                    Disconnetti
                                </button>
                            ) : (
                                <Link
                                    href="/auth/login"
                                    className="w-full py-4 rounded-2xl bg-oro text-blunotte font-black text-center text-lg shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                                >
                                    Accedi ora
                                </Link>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
