"use client";

import { motion } from "framer-motion";

export default function PrivacyPage() {
    return (
        <main className="min-h-screen text-white p-6 md:p-12 pt-56 md:pt-44 pb-32">
            <div className="max-w-4xl mx-auto bg-[#131d36]/80 backdrop-blur-xl p-8 md:p-16 rounded-[2.5rem] border border-gray-800 shadow-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl md:text-5xl font-black text-oro mb-4 tracking-tighter">Informativa Privacy</h1>
                    <p className="text-gray-400 mb-12 font-medium">Art. 13 Regolamento UE 2016/679 (GDPR)</p>

                    <div className="space-y-10 text-gray-300 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-oro rounded-full"></span>
                                1. Titolare del Trattamento
                            </h2>
                            <p>
                                Il Titolare del trattamento è l&apos;<strong>Associazione Universitaria MORGANA</strong>, Codice Fiscale 97103490831, con sede in Via Del Vespro n°57 – 98123 Messina. 
                                <br />Contatti: <a href="mailto:associazione.morgana@gmail.com" className="text-oro hover:underline">associazione.morgana@gmail.com</a> | +39 3481346050.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-oro rounded-full"></span>
                                2. Finalità e Base Giuridica
                            </h2>
                            <p>I tuoi dati personali sono trattati per le seguenti finalità:</p>
                            <ul className="list-disc ml-6 mt-4 space-y-3">
                                <li><strong>Gestione del Gioco:</strong> Consentire l&apos;iscrizione a Fantarte, la creazione della squadra e la gestione delle classifiche.</li>
                                <li><strong>Erogazione Premi:</strong> Gestire la comunicazione con i vincitori e coordinare la consegna dei servizi offerti dai partner.</li>
                                <li><strong>Comunicazioni di servizio:</strong> Inviare email tecniche necessarie al corretto funzionamento dell&apos;account (es. recupero password).</li>
                            </ul>
                            <p className="mt-4">
                                <strong>Base Giuridica:</strong> Il trattamento è necessario all&apos;esecuzione di un contratto (la partecipazione al concorso accettando il regolamento) ex Art. 6.1 lett. b) del GDPR.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-oro rounded-full"></span>
                                3. Destinatari e Trasferimento Dati
                            </h2>
                            <p>
                                I dati sono accessibili esclusivamente agli amministratori dell&apos;Associazione. Tuttavia, i dati necessari all&apos;autenticazione sono gestiti tramite la piattaforma <strong>Supabase</strong>. 
                            </p>
                            <p className="mt-4 bg-white/5 p-4 rounded-xl border border-gray-800">
                                <strong>Importante:</strong> In caso di vincita, i dati anagrafici minimi necessari (nome, cognome, email) potranno essere comunicati ai <strong>Partner/Sponsor</strong> dell&apos;iniziativa esclusivamente per permettere l&apos;erogazione del servizio premio (es. emissione di un biglietto nominativo).
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-oro rounded-full"></span>
                                4. Conservazione dei Dati
                            </h2>
                            <p>
                                I dati saranno conservati per tutta la durata dell&apos;iniziativa e per il tempo strettamente necessario ad adempiere agli obblighi legali e di rendicontazione dell&apos;associazione.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-oro rounded-full"></span>
                                5. I tuoi Diritti
                            </h2>
                            <p>
                                Puoi esercitare in ogni momento i diritti previsti dal GDPR (accesso, rettifica, cancellazione, limitazione, opposizione) inviando una comunicazione formale all&apos;indirizzo email del Titolare.
                            </p>
                        </section>
                    </div>

                    <div className="mt-20 pt-8 border-t border-gray-800/50 text-center">
                        <p className="text-gray-600 text-[10px] uppercase tracking-widest">
                            Ultimo aggiornamento: 13 Aprile 2026
                        </p>
                    </div>
                </motion.div>
            </div>

        </main>
    );
}
