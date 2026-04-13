"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiCheck, FiX, FiActivity, FiShield, FiSave, FiCamera } from "react-icons/fi";
import ImageCropper from "@/components/ImageCropper";
import Image from "next/image";

export default function AccountPage() {
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [profile, setProfile] = useState({
        name: "",
        surname: "",
        phone: "",
        email: "",
        image: ""
    });

    // Image Upload & Cropping States
    const [isUploading, setIsUploading] = useState(false);
    const [tempImage, setTempImage] = useState<string | null>(null);
    const [isCropModalOpen, setIsCropModalOpen] = useState(false);

    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    useEffect(() => {
        fetch("/api/user/profile")
            .then(res => res.json())
            .then(data => {
                setProfile({
                    name: data.name || "",
                    surname: data.surname || "",
                    phone: data.phone || "",
                    email: data.email,
                    image: data.image || ""
                });
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: profile.name,
                    surname: profile.surname,
                    phone: profile.phone,
                    email: profile.email,
                    image: profile.image
                })
            });

            if (!res.ok) {
                throw new Error(await res.text() || "Errore durante l'aggiornamento");
            }

            await update({ name: `${profile.name} ${profile.surname}`.trim() });
            setSuccess("Profilo aggiornato con successo!");
            setTimeout(() => setSuccess(""), 4000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            setError("Le password non coincidono");
            return;
        }

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: passwords.currentPassword,
                    newPassword: passwords.newPassword
                })
            });

            if (!res.ok) {
                throw new Error(await res.text() || "Errore nel cambio password");
            }

            setSuccess("Sicurezza aggiornata!");
            setPasswords({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
            setTimeout(() => setSuccess(""), 4000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setTempImage(reader.result as string);
            setIsCropModalOpen(true);
        };
        reader.readAsDataURL(file);
        e.target.value = "";
    };

    const onCropComplete = async (croppedBlob: Blob) => {
        setIsCropModalOpen(false);
        setTempImage(null);
        setIsUploading(true);
        setError("");

        const formData = new FormData();
        formData.append("file", croppedBlob, "profile-image.jpg");

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData
            });

            if (!res.ok) throw new Error("Upload fallito");
            const data = await res.json();
            setProfile(p => ({ ...p, image: data.url }));
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-12 h-12 border-4 border-oro/20 border-t-oro rounded-full animate-spin"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">Accesso Profilo...</span>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen pt-44 pb-32 selection:bg-oro/30">
            <div className="max-w-7xl mx-auto px-6">
                
                <header className="mb-24 text-center space-y-4">
                    <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-oro font-black uppercase tracking-[0.4em] text-[10px]"
                    >
                        Configurazione Manager
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-8xl font-black uppercase tracking-tighter"
                    >
                        Il Tuo <span className="text-gradient-oro">Dossier</span>
                    </motion.h1>
                    <p className="text-gray-400 max-w-xl mx-auto font-light text-lg">
                        Controlla la tua identità digitale nella Piazza e mantieni elevati i tuoi standard di sicurezza.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* PROFILE SETTINGS */}
                    <div className="lg:col-span-12 xl:col-span-7">
                        <motion.section
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass p-10 md:p-16 rounded-[4rem] border-white/5 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-10 text-white/[0.03] font-black text-8xl pointer-events-none">USER</div>
                            
                            <div className="relative z-10 space-y-12">
                                 <div className="flex flex-col md:flex-row items-center gap-10 pb-8 border-b border-white/5">
                                    <div className="relative group">
                                        <div className="w-32 h-32 rounded-[2rem] overflow-hidden bg-white/5 border-2 border-oro/30 shadow-2xl relative">
                                            {profile.image ? (
                                                <Image src={profile.image} alt="Avatar" fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-oro/40">
                                                    <FiUser size={48} />
                                                </div>
                                            )}
                                            {isUploading && (
                                                <div className="absolute inset-0 bg-blunotte/60 flex items-center justify-center">
                                                    <div className="w-6 h-6 border-2 border-oro/30 border-t-oro rounded-full animate-spin"></div>
                                                </div>
                                            )}
                                        </div>
                                        <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-oro text-blunotte rounded-xl flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-all z-20">
                                            <FiCamera size={18} />
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                                        </label>
                                    </div>
                                    <div className="text-center md:text-left">
                                        <h2 className="text-4xl font-black uppercase tracking-tighter">Profilo <span className="text-oro">Elite</span></h2>
                                        <p className="text-white/20 text-[10px] font-black uppercase tracking-widest mt-2">ID: {session?.user?.id || '...'}</p>
                                    </div>
                                </div>

                                <form onSubmit={handleProfileUpdate} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Nome</label>
                                            <input
                                                type="text"
                                                value={profile.name}
                                                onChange={e => setProfile({ ...profile, name: e.target.value })}
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-oro transition-all font-bold placeholder:text-white/10"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Cognome</label>
                                            <input
                                                type="text"
                                                value={profile.surname}
                                                onChange={e => setProfile({ ...profile, surname: e.target.value })}
                                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-oro transition-all font-bold placeholder:text-white/10"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4 flex items-center gap-2"><FiActivity size={12} /> Contatto Rapido</label>
                                        <input
                                            type="tel"
                                            value={profile.phone}
                                            onChange={e => setProfile({ ...profile, phone: e.target.value })}
                                            placeholder="+39..."
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-oro transition-all font-bold"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4 flex items-center gap-2"><FiMail size={12} /> Email d&apos;Accesso</label>
                                        <input
                                            type="email"
                                            value={profile.email}
                                            onChange={e => setProfile({ ...profile, email: e.target.value })}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white/40 focus:outline-none border-dashed"
                                            readOnly
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full md:w-auto px-12 py-5 bg-gradient-to-r from-oro to-ocra text-blunotte font-black rounded-2xl shadow-xl hover:-translate-y-1 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        <FiSave /> {saving ? "Aggiornamento..." : "Salva Dossier"}
                                    </button>
                                </form>
                            </div>
                        </motion.section>
                    </div>

                    {/* SECURITY SETTINGS */}
                    <div className="lg:col-span-12 xl:col-span-5">
                         <motion.section
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="glass p-10 md:p-12 rounded-[3.5rem] border-white/5 relative overflow-hidden"
                        >
                            <div className="relative z-10 space-y-10">
                                <div className="flex items-center gap-4 pb-6 border-b border-white/5">
                                    <div className="w-12 h-12 rounded-xl bg-white/[0.03] flex items-center justify-center text-oro border border-white/10">
                                        <FiShield size={24} />
                                    </div>
                                    <h2 className="text-2xl font-black uppercase tracking-tighter">Protocolli <span className="text-oro">Sicurezza</span></h2>
                                </div>

                                <form onSubmit={handlePasswordUpdate} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Chiave Attuale</label>
                                        <input
                                            type="password"
                                            value={passwords.currentPassword}
                                            onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-oro transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>

                                    <div className="space-y-4 pt-4">
                                        <div className="space-y-2">
                                             <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">Nuova Chiave</label>
                                             <input
                                                type="password"
                                                value={passwords.newPassword}
                                                onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                                                className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-oro transition-all"
                                                placeholder="Nuova password..."
                                            />
                                        </div>
                                        <input
                                            type="password"
                                            value={passwords.confirmPassword}
                                            onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                            className="w-full bg-white/[0.01] border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-oro transition-all"
                                            placeholder="Conferma nuova password..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full py-5 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl border border-white/10 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3"
                                    >
                                        <FiLock /> {saving ? "Criptazione..." : "Aggiorna Chiavi"}
                                    </button>
                                </form>

                                {(error || success) && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }} 
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center border ${
                                            error ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-green-500/10 border-green-500/20 text-green-500"
                                        }`}
                                    >
                                        {error || success}
                                    </motion.div>
                                )}
                            </div>
                        </motion.section>
                    </div>
                </div>

                {/* Footer Insight */}
                <div className="mt-24 text-center">
                    <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.4em]">
                        Your identity is protected by sprint fortress release 2.0
                    </p>
                </div>
            </div>

            <AnimatePresence>
                {isCropModalOpen && tempImage && (
                    <ImageCropper 
                        image={tempImage} 
                        onCropComplete={onCropComplete} 
                        onCancel={() => {
                            setIsCropModalOpen(false);
                            setTempImage(null);
                        }} 
                    />
                )}
            </AnimatePresence>
        </main>
    );
}
