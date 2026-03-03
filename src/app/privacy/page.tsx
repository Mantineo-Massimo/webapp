"use client";

import { motion } from "framer-motion";

export default function PrivacyPage() {
    return (
        <main className="min-h-screen text-white p-6 md:p-12 pt-56 md:pt-44 pb-32">
            <div className="max-w-3xl mx-auto bg-[#131d36] p-8 md:p-12 rounded-[2.5rem] border border-gray-800 shadow-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl font-black text-oro mb-8">Informativa sulla Privacy</h1>

                    <div className="space-y-6 text-gray-300 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-white mb-3 tracking-wide uppercase text-sm">1. Introduzione</h2>
                            <p>
                                Benvenuto su FantaPiazza. La tua privacy è importante per noi. Questa informativa spiega come raccogliamo, utilizziamo e proteggiamo i tuoi dati personali in occasione del concorso organizzato dalle Associazioni Morgana e O.R.U.M.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3 tracking-wide uppercase text-sm">2. Dati Raccolti</h2>
                            <p>
                                Raccogliamo esclusivamente i dati necessari per la gestione del gioco:
                            </p>
                            <ul className="list-disc ml-6 mt-2 space-y-2">
                                <li>Indirizzo Email (per l&apos;autenticazione e le comunicazioni di servizio)</li>
                                <li>Nome utente o Nome Squadra</li>
                                <li>Preferenze di gioco (gli Armoni scelti per la squadra)</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3 tracking-wide uppercase text-sm">3. Finalità del Trattamento</h2>
                            <p>
                                I tuoi dati vengono utilizzati solo per:
                            </p>
                            <ul className="list-disc ml-6 mt-2 space-y-2">
                                <li>Consentirti di creare e gestire la tua squadra.</li>
                                <li>Pubblicare il tuo punteggio nella classifica generale.</li>
                                <li>Inviarti email tecniche (conferma registrazione, recupero password).</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3 tracking-wide uppercase text-sm">4. Condivisione dei Dati</h2>
                            <p>
                                Non vendiamo né cediamo i tuoi dati a terzi. I dati sono accessibili solo agli amministratori delle associazioni organizzatrici per finalità legate al concorso.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-3 tracking-wide uppercase text-sm">5. I tuoi Diritti</h2>
                            <p>
                                Puoi richiedere la cancellazione del tuo account e dei tuoi dati in qualsiasi momento inviando una email a <a href="mailto:info@fantapiazza.it" className="text-oro hover:underline">info@fantapiazza.it</a>.
                            </p>
                        </section>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-800 text-center">
                        <p className="text-gray-500 text-xs italic">
                            Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}
                        </p>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
