"use client";

import { motion } from "framer-motion";
import { FiShield, FiAlertCircle, FiLock, FiCpu } from "react-icons/fi";

export default function TermsPage() {
    return (
        <main className="min-h-screen text-white p-6 md:p-12 pt-56 md:pt-44 pb-32">
            <div className="max-w-4xl mx-auto bg-[#131d36]/80 backdrop-blur-xl p-8 md:p-16 rounded-[2.5rem] border border-gray-800 shadow-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl md:text-5xl font-black text-oro mb-4 tracking-tighter">Termini di Servizio</h1>
                    <p className="text-gray-400 mb-12 font-medium">Condizioni generali di utilizzo della piattaforma Fantarte</p>

                    <div className="space-y-12 text-gray-300 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <FiShield className="text-oro" size={24} />
                                1. Accettazione dei Termini
                            </h2>
                            <p>
                                L&apos;accesso e l&apos;utilizzo del sito "Fantarte" sono subordinati all&apos;accettazione dei presenti Termini. Registrandosi alla piattaforma, l&apos;utente dichiara di essere uno studente universitario o comunque di agire per scopi ludico-culturali non professionali.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <FiLock className="text-oro" size={24} />
                                2. Regole di Condotta e Multi-account
                            </h2>
                            <p>
                                Al fine di garantire l&apos;integrità del concorso basato sul merito, è severamente vietata la creazione di <strong>multi-account</strong> da parte dello stesso utente. 
                            </p>
                            <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-200 text-sm">
                                <strong>Sanzione:</strong> L&apos;Associazione Morgana si riserva il diritto di squalificare e rimuovere senza preavviso tutti gli account riconducibili allo stesso utente in caso di violazione.
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <FiAlertCircle className="text-oro" size={24} />
                                3. Limitazione di Responsabilità
                            </h2>
                            <div className="space-y-4">
                                <p>L&apos;Associazione Morgana non è responsabile per:</p>
                                <ul className="list-disc ml-6 space-y-2">
                                    <li>Malfunzionamenti tecnici del sito dovuti a cause di forza maggiore o problemi di rete.</li>
                                    <li>Variazioni nei programmi degli artisti o annullamenti di performance reali che possano influenzare il punteggio del gioco.</li>
                                    <li>La qualità dei servizi erogati dai partner esterni (Sponsor), per i quali risponde direttamente l&apos;ente erogatore.</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <FiCpu className="text-oro" size={24} />
                                4. Proprietà Intellettuale
                            </h2>
                            <p>
                                Il nome "Fantarte", il logo, il codice sorgente e tutti i contenuti grafici del sito sono di proprietà intellettuale dell&apos;Associazione Morgana o dei rispettivi autori. È vietata la riproduzione, anche parziale, senza autorizzazione scritta dell&apos;Associazione.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <FiAlertCircle className="text-oro" size={24} />
                                5. Modifiche e Recesso
                            </h2>
                            <p>
                                L&apos;Associazione si riserva il diritto di modificare i presenti termini qualora le esigenze di gestione lo rendano necessario. L&apos;utente può recedere in ogni momento richiedendo la cancellazione del proprio account.
                            </p>
                        </section>
                    </div>

                    <div className="mt-20 pt-8 border-t border-gray-800/50 text-center">
                        <p className="text-gray-600 text-[10px] uppercase tracking-widest italic">
                            Associazione Universitaria MORGANA - Messina
                        </p>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
