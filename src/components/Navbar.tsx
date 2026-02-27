"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { FiHome, FiList, FiPlus, FiLogOut, FiSettings, FiBookOpen, FiUser } from "react-icons/fi";

export default function Navbar() {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (pathname.startsWith("/auth")) return null; // Nascondi in login/register

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
        <nav className={`fixed top-0 w-full backdrop-blur-xl border-b border-gray-800/50 z-50 transition-all duration-500 ${scrolled ? "h-16 bg-[#0a0f1c]/90" : "h-24 md:h-32 bg-[#0a0f1c]/60"
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
                                className={`w-auto object-contain drop-shadow-[0_0_15px_rgba(255,215,0,0.3)] group-hover:drop-shadow-[0_0_20px_rgba(255,215,0,0.5)] transition-all duration-500 ${scrolled ? "h-12 md:h-14" : "h-20 md:h-28"
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
                                        ? "text-oro bg-gradient-to-r from-gray-800/80 to-gray-800/20 shadow-inner"
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
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 border border-purple-500/20 ${pathname.startsWith("/admin")
                                    ? "text-purple-400 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                                    : "text-gray-400 hover:text-purple-300 hover:bg-purple-500/5"
                                    }`}
                            >
                                <FiSettings size={18} className={pathname.startsWith("/admin") ? "text-purple-400" : "text-gray-500"} />
                                Admin
                            </Link>
                        )}

                        {status === "authenticated" ? (
                            <button
                                onClick={() => signOut()}
                                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-red-400 bg-red-900/10 hover:bg-red-900/30 rounded-xl transition-colors ml-6 border border-red-900/30 font-sans"
                            >
                                <FiLogOut size={16} />
                                Esci
                            </button>
                        ) : status === "unauthenticated" ? (
                            <Link
                                href="/auth/login"
                                className="px-6 py-2.5 bg-gradient-to-r from-oro to-ocra text-blunotte font-extrabold rounded-xl transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] ml-6"
                            >
                                Accedi
                            </Link>
                        ) : null}
                    </div>

                    {/* Mobile Menu Icon (Semplificato) */}
                    <div className="flex md:hidden items-center">
                        {/* Qui potresti mettere un hamburger menu */}
                    </div>
                </div>
            </div>

            {/* Mobile nav placeholder - espandibile */}
            <div className="md:hidden border-t border-gray-800/50 bg-[#060a12]/90 backdrop-blur-md">
                <div className="flex overflow-x-auto py-3 px-4 gap-6 items-center justify-center hide-scrollbar">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex flex-col flex-shrink-0 items-center justify-center p-2 text-xs font-semibold transition-colors ${isActive ? "text-oro" : "text-gray-500"
                                    }`}
                            >
                                <div className={`p-2 rounded-xl mb-1 ${isActive ? "bg-oro/10" : "bg-transparent"}`}>
                                    <Icon size={22} className={isActive ? "drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" : ""} />
                                </div>
                                {link.label}
                            </Link>
                        );
                    })}

                    {isAdmin && (
                        <Link
                            href="/admin"
                            className={`flex flex-col flex-shrink-0 items-center justify-center p-2 text-xs font-semibold transition-colors ${pathname.startsWith("/admin") ? "text-purple-400" : "text-gray-500"
                                }`}
                        >
                            <div className={`p-2 rounded-xl mb-1 ${pathname.startsWith("/admin") ? "bg-purple-500/10" : "bg-transparent"}`}>
                                <FiSettings size={22} className={pathname.startsWith("/admin") ? "drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" : ""} />
                            </div>
                            Admin
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
