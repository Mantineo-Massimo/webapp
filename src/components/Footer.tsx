import Image from "next/image";
import Link from "next/link";
import { FiInstagram, FiFacebook, FiMail } from "react-icons/fi";

export default function Footer() {
    return (
        <footer className="w-full bg-blunotte/80 backdrop-blur-xl border-t border-gray-800/50 pt-16 pb-8 mt-20 relative z-20">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Brand Info */}
                    <div className="space-y-6 text-center md:text-left">
                        <div className="flex justify-center md:justify-start">
                            <Image
                                src="/fanta-logo.png"
                                alt="FantaPiazza"
                                width={180}
                                height={60}
                                className="opacity-80 hover:opacity-100 transition-opacity"
                            />
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
                            Un progetto di Piazza dell&apos;Arte in collaborazione con le Associazioni Morgana e O.R.U.M.
                            Portiamo l&apos;arte in gioco.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="text-center">
                        <h4 className="text-oro font-black uppercase tracking-widest text-xs mb-6">Link Rapidi</h4>
                        <nav className="flex flex-col gap-4 text-sm font-bold text-gray-400">
                            <Link href="/" className="hover:text-white transition-colors">Home</Link>
                            <Link href="/regolamento" className="hover:text-white transition-colors">Regolamento</Link>
                            <Link href="/classifica" className="hover:text-white transition-colors">Classifica</Link>
                        </nav>
                    </div>

                    {/* Connect */}
                    <div className="text-center md:text-right space-y-6">
                        <h4 className="text-oro font-black uppercase tracking-widest text-xs mb-6">Connettiti</h4>
                        <div className="flex justify-center md:justify-end gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-oro hover:text-blunotte transition-all border border-gray-800">
                                <FiInstagram size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-oro hover:text-blunotte transition-all border border-gray-800">
                                <FiFacebook size={20} />
                            </a>
                            <a href="mailto:info@fantapiazza.it" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-oro hover:text-blunotte transition-all border border-gray-800">
                                <FiMail size={20} />
                            </a>
                        </div>
                        <div className="text-[10px] text-gray-600 uppercase tracking-tighter">
                            Designed with ❤️ for Piazza dell&apos;Arte
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800/30 pt-8 text-center">
                    <p className="text-gray-600 text-[10px] uppercase tracking-widest">
                        &copy; {new Date().getFullYear()} FantaPiazza. Tutti i diritti riservati.
                    </p>
                </div>
            </div>
        </footer>
    );
}
