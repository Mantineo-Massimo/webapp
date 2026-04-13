"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Sponsor {
    id: string;
    name: string;
    logo: string;
}

function SponsorItem({ sponsor }: { sponsor: Sponsor }) {
    const [imgError, setImgError] = useState(false);

    return (
        <div className="flex-shrink-0 flex flex-col items-center justify-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 group">
            <div className="relative h-12 md:h-20 w-32 md:w-56 flex items-center justify-center">
                {!imgError && sponsor.logo ? (
                    <Image
                        src={sponsor.logo}
                        alt={sponsor.name}
                        fill
                        className="object-contain"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="px-6 py-4 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center">
                         <span className="text-oro font-black uppercase tracking-widest text-[10px] text-center leading-tight">
                            {sponsor.name}
                         </span>
                    </div>
                )}
            </div>
            <span className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/0 group-hover:text-oro/40 transition-colors">
                {sponsor.name}
            </span>
        </div>
    );
}

export default function SponsorMarquee() {
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);

    useEffect(() => {
        fetch("/api/sponsors")
            .then((res) => res.json())
            .then((data) => setSponsors(data))
            .catch((err) => console.error("Error fetching sponsors:", err));
    }, []);

    if (sponsors.length === 0) return null;

    // Duplica gli sponsor per far scorrere il marquee senza interruzioni
    const marqueeSponsors = [...sponsors, ...sponsors, ...sponsors, ...sponsors];

    return (
        <div className="relative w-full overflow-hidden py-12">
            {/* Fade effect edges */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-blunotte to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-blunotte to-transparent z-10 pointer-events-none"></div>

            <div className="flex w-fit whitespace-nowrap animate-marquee items-center gap-12 md:gap-24">
                {marqueeSponsors.map((sponsor, idx) => (
                    <SponsorItem key={`${sponsor.id}-${idx}`} sponsor={sponsor} />
                ))}
            </div>
        </div>
    );
}
