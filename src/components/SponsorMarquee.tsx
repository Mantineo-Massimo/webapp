"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Sponsor = {
    id: string;
    name: string;
    logoUrl: string;
};

export default function SponsorMarquee() {
    const [sponsors, setSponsors] = useState<Sponsor[]>([]);

    useEffect(() => {
        const fetchSponsors = async () => {
            try {
                const res = await fetch("/api/sponsors");
                if (res.ok) {
                    const data = await res.json();
                    setSponsors(data);
                }
            } catch (err) {
                console.error("Error fetching sponsors:", err);
            }
        };
        fetchSponsors();
    }, []);

    if (sponsors.length === 0) return null;

    return (
        <div className="w-full py-12 bg-white/2 backdrop-blur-sm border-y border-gray-800/30 overflow-hidden relative group">
            <div className="flex w-max animate-marquee items-center translate-x-0">
                {/* Screen 1 */}
                <div className="flex shrink-0 w-screen justify-around items-center px-4 md:px-12">
                    {sponsors.map((sponsor) => (
                        <div
                            key={`${sponsor.id}-1`}
                            className="flex-shrink-0 flex items-center justify-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                        >
                            <Image
                                src={sponsor.logoUrl}
                                alt={sponsor.name}
                                width={160}
                                height={60}
                                className="h-10 md:h-12 w-auto object-contain"
                            />
                        </div>
                    ))}
                </div>
                {/* Screen 2 - Perfect Duplicate */}
                <div className="flex shrink-0 w-screen justify-around items-center px-4 md:px-12">
                    {sponsors.map((sponsor) => (
                        <div
                            key={`${sponsor.id}-2`}
                            className="flex-shrink-0 flex items-center justify-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                        >
                            <Image
                                src={sponsor.logoUrl}
                                alt={sponsor.name}
                                width={160}
                                height={60}
                                className="h-10 md:h-12 w-auto object-contain"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Gradient Overlays */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-blunotte to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-blunotte to-transparent z-10 pointer-events-none"></div>
        </div>
    );
}
