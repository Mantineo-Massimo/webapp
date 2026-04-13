import Image from "next/image";
import Link from "next/link";
import { FiInstagram, FiFacebook, FiMail, FiChevronRight } from "react-icons/fi";

export default function Footer() {
    return (
        <footer className="w-full relative z-20 mt-32 border-t border-white/5 bg-blunotte">
            {/* Ambient background for footer */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full bg-viola/5 blur-[120px] pointer-events-none -z-10"></div>
            
            <div className="max-w-7xl mx-auto px-6 py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
                    
                    {/* Brand Meta */}
                    <div className="lg:col-span-1 space-y-8">
                        <Link href="/" className="inline-block">
                            <Image
                                src="/fanta-logo.png"
                                alt="FantaPiazza"
                                width={180}
                                height={60}
                                className="opacity-90 hover:opacity-100 transition-opacity"
                            />
                        </Link>
                        <p className="text-gray-500 text-sm font-light leading-relaxed">
                            Il Fantagioco d&apos;elite dedicato alla Piazza dell&apos;Arte. In sinergia con Morgana e O.R.U.M. per celebrare il talento e la cultura.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="space-y-8">
                        <h4 className="text-oro font-black uppercase tracking-[0.3em] text-[10px]">Archivio</h4>
                        <nav className="flex flex-col gap-4 text-sm font-bold text-gray-400">
                            <Link href="/" className="hover:text-oro transition-all flex items-center gap-2 group">
                                <FiChevronRight className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-oro" /> Home
                            </Link>
                            <Link href="/regolamento" className="hover:text-oro transition-all flex items-center gap-2 group">
                                <FiChevronRight className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-oro" /> Regolamento
                            </Link>
                            <Link href="/leaderboards" className="hover:text-oro transition-all flex items-center gap-2 group">
                                <FiChevronRight className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-oro" /> Ranking
                            </Link>
                        </nav>
                    </div>

                    {/* Arena Access */}
                    <div className="space-y-8">
                        <h4 className="text-oro font-black uppercase tracking-[0.3em] text-[10px]">Arena</h4>
                        <nav className="flex flex-col gap-4 text-sm font-bold text-gray-400">
                            <Link href="/team/create" className="hover:text-oro transition-all flex items-center gap-2 group">
                                <FiChevronRight className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-oro" /> Il mio Team
                            </Link>
                            <Link href="/account" className="hover:text-oro transition-all flex items-center gap-2 group">
                                <FiChevronRight className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-oro" /> Profilo Manager
                            </Link>
                            <Link href="/auth/login" className="hover:text-oro transition-all flex items-center gap-2 group">
                                <FiChevronRight className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-oro" /> Portale d&apos;Uscita
                            </Link>
                        </nav>
                    </div>

                    {/* Connect */}
                    <div className="space-y-8">
                        <h4 className="text-oro font-black uppercase tracking-[0.3em] text-[10px]">Connettiti</h4>
                        <div className="flex gap-4">
                            <a href="https://www.instagram.com/piazzadellarte_/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-oro hover:text-blunotte transition-all border border-white/5 active:scale-95 shadow-lg">
                                <FiInstagram size={20} />
                            </a>
                            <a href="https://www.facebook.com/PiazzadellArte" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-oro hover:text-blunotte transition-all border border-white/5 active:scale-95 shadow-lg">
                                <FiFacebook size={20} />
                            </a>
                            <a href="mailto:info@fantapiazza.it" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-oro hover:text-blunotte transition-all border border-white/5 active:scale-95 shadow-lg">
                                <FiMail size={20} />
                            </a>
                        </div>
                        <div className="pt-4">
                             <div className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em]">Designed for Art</div>
                             <div className="text-[10px] text-white/10 font-black uppercase tracking-[0.2em] mt-1">Fortress Build 2.0</div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="space-y-2 text-center md:text-left">
                        <p className="text-gray-600 text-[9px] font-black uppercase tracking-widest">
                            &copy; {new Date().getFullYear()} FantaPiazza &bull; Tutti i diritti riservati.
                        </p>
                        <p className="text-gray-700 text-[8px] font-black uppercase tracking-[0.3em]">
                            Associazione Universitaria MORGANA &bull; Messina
                        </p>
                        <p className="text-oro/40 text-[8px] font-black uppercase tracking-[0.4em] pt-2">
                            Fatto per la Piazza dell&apos;Arte da Massimo Mantineo
                        </p>
                    </div>
                    
                    <div className="flex gap-8">
                        <Link href="/privacy" className="text-gray-700 hover:text-oro text-[9px] font-black uppercase tracking-widest transition-colors">Privacy</Link>
                        <Link href="/terms" className="text-gray-700 hover:text-oro text-[9px] font-black uppercase tracking-widest transition-colors">Legal</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
