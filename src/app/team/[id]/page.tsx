import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import SocialShare from "@/components/SocialShare";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const team = await prisma.team.findUnique({
        where: { id: params.id },
        select: { name: true }
    });
    if (!team) return { title: "Squadra non trovata" };
    return {
        title: `${team.name} - FantaPiazza`,
        description: `Scopri la squadra ${team.name} su FantaPiazza!`,
        openGraph: {
            title: `${team.name} - FantaPiazza`,
            description: `Scopri la squadra ${team.name} su FantaPiazza!`,
            type: 'website',
            images: [
                {
                    url: '/fanta-logo.png',
                    width: 1200,
                    height: 630,
                    alt: 'FantaPiazza',
                },
            ],
        },
    };
}

export default async function TeamProfilePage({ params }: { params: { id: string } }) {
    const team = await prisma.team.findFirst({
        where: { id: params.id },
        include: {
            artists: {
                orderBy: {
                    totalScore: 'desc'
                }
            },
            leagues: {
                include: {
                    league: true
                }
            }
        }
    });

    if (!team) notFound();

    const generalLeague = team.leagues.find((l: any) => l.league.name === "Generale");
    const totalScore = generalLeague ? generalLeague.score : team.artists.reduce((acc: number, a: any) => acc + a.totalScore, 0);

    // In a real app, use an env variable for BASE_URL
    const baseUrl = process.env.NEXTAUTH_URL || "https://fantapiazza.it";
    const shareUrl = `${baseUrl}/team/${team.id}`;

    return (
        <main className="min-h-screen text-white pt-56 md:pt-44 pb-32 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-oro/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                {/* Team Header */}
                <div className="flex flex-col md:flex-row items-center gap-10 mb-20 text-center md:text-left">
                    <div className="w-40 h-40 rounded-[3rem] bg-[#131d36] border-2 border-oro/30 overflow-hidden flex items-center justify-center shadow-2xl shrink-0 group">
                        {team.image ? (
                            <img src={team.image} alt={team.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                            <img src="/fanta-logo.png" alt="Default" className="w-full h-full object-contain p-6 opacity-40 group-hover:opacity-60 transition-opacity" />
                        )}
                    </div>
                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div>
                                <h1 className="text-5xl md:text-6xl font-black text-white mb-3 tracking-tight">
                                    {team.name}
                                </h1>
                                <p className="text-oro font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">
                                    Squadra Ufficiale • FantaPiazza 2024
                                </p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] px-10 py-6 shadow-xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-oro/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <span className="relative block text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Punteggio Totale</span>
                                <span className="relative text-5xl font-black text-oro drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                                    {totalScore} <span className="text-sm opacity-60 font-medium">pt</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Artists Section */}
                <div className="mb-16">
                    <h2 className="text-xs font-black uppercase tracking-[0.4em] text-gray-500 mb-8 ml-2">I 5 Armoni in squadra</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {team.artists.map((artist: any) => (
                            <div key={artist.id} className="bg-[#131d36]/50 backdrop-blur-md rounded-[2rem] border border-gray-800/50 p-6 flex items-center gap-6 group hover:border-oro/40 hover:bg-[#131d36]/80 transition-all duration-500">
                                <div className="w-20 h-20 rounded-2xl bg-[#0a0f1c] border border-gray-700 overflow-hidden shrink-0 flex items-center justify-center text-oro font-black text-2xl relative shadow-lg">
                                    {artist.image ? (
                                        <img src={artist.image} alt={artist.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        artist.name.charAt(0)
                                    )}
                                    <div className="absolute inset-0 border border-white/5 rounded-2xl pointer-events-none"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-xl font-bold mb-1 truncate group-hover:text-oro transition-colors">{artist.name}</h3>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{artist.cost} Armoni</span>
                                        <span className="w-1 h-1 bg-gray-800 rounded-full"></span>
                                        <span className="text-[10px] font-black text-oro/80 uppercase tracking-widest">{artist.totalScore} Punti</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Share Section */}
                <div className="bg-gradient-to-br from-[#131d36] to-[#0a0f1c] rounded-[3rem] p-12 border border-gray-800 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-oro/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black mb-3">Sostieni questa squadra!</h2>
                        <p className="text-gray-400 max-w-sm">Condividi la formazione ufficiale e sfida i tuoi amici nella Piazza dell'Arte.</p>
                    </div>
                    <div className="relative z-10 w-full md:w-auto">
                        <SocialShare
                            url={shareUrl}
                            title={`Guarda la mia squadra ${team.name} su FantaPiazza! Ho totalizzato ${totalScore} punti! 🚀`}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}
