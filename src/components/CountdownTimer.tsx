"use client";

import { useState, useEffect } from "react";

export default function CountdownTimer({ targetDate }: { targetDate: string | null }) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    const [isExpired, setIsExpired] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!targetDate) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const target = new Date(targetDate).getTime();
            const difference = target - now;

            if (difference <= 0) {
                setIsExpired(true);
                clearInterval(interval);
            } else {
                setIsExpired(false);
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000),
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    if (!mounted || !targetDate) return null;

    if (isExpired) {
        return (
            <div className="bg-red-900/30 border border-red-500 text-red-300 font-bold py-3 px-6 rounded-2xl w-full max-w-md mx-auto text-center shadow-[0_0_15px_rgba(220,38,38,0.4)]">
                Le iscrizioni sono CHIUSE.
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center">
            <p className="text-sm text-gray-400 font-medium mb-2 uppercase tracking-widest">Scadenza Iscrizioni</p>
            <div className="flex gap-4">
                {[
                    { label: "Giorni", value: timeLeft.days },
                    { label: "Ore", value: timeLeft.hours },
                    { label: "Min.", value: timeLeft.minutes },
                    { label: "Sec.", value: timeLeft.seconds }
                ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center bg-[#0a0f1c]/80 backdrop-blur-md border border-gray-700 p-3 w-20 rounded-xl shadow-lg">
                        <span className="text-2xl font-mono font-bold text-oro">{item.value.toString().padStart(2, "0")}</span>
                        <span className="text-xs text-gray-500 uppercase">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
