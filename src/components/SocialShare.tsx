"use client";

import { FiShare2, FiTwitter, FiSend, FiMessageCircle } from "react-icons/fi";

type SocialShareProps = {
    url: string;
    title: string;
};

export default function SocialShare({ url, title }: SocialShareProps) {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const shareOptions = [
        {
            name: "X (Twitter)",
            icon: FiTwitter,
            url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
            color: "bg-black/50 hover:bg-black"
        },
        {
            name: "WhatsApp",
            icon: FiMessageCircle,
            url: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
            color: "bg-green-600/50 hover:bg-green-600"
        },
        {
            name: "Telegram",
            icon: FiSend,
            url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
            color: "bg-blue-500/50 hover:bg-blue-500"
        }
    ];

    const handleWebShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "FantaPiazza - La mia Squadra",
                    text: title,
                    url: url
                });
            } catch (err) {
                console.error("Web Share failed", err);
            }
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(`${title} ${url}`);
            alert("Link copiato negli appunti! 🚀");
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-3">
            <button
                onClick={handleWebShare}
                className="flex items-center gap-2 px-6 py-2.5 bg-oro text-blunotte font-black rounded-xl hover:scale-105 transition-all shadow-[0_5px_15px_rgba(255,215,0,0.2)] text-sm uppercase tracking-widest"
            >
                <FiShare2 size={18} /> Condividi
            </button>
            <div className="flex gap-2">
                {shareOptions.map((opt) => (
                    <a
                        key={opt.name}
                        href={opt.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-10 h-10 ${opt.color} text-white rounded-xl transition-all flex items-center justify-center border border-white/10 backdrop-blur-sm`}
                        title={opt.name}
                    >
                        <opt.icon size={18} />
                    </a>
                ))}
            </div>
        </div>
    );
}
