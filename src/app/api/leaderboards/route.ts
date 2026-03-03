import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 30; // Cache for 30 seconds

export async function GET() {
    try {
        const leagues = await prisma.league.findMany({
            where: {
                name: "Generale"
            },
            include: {
                teams: {
                    include: {
                        team: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                captainId: true,
                                artists: {
                                    select: {
                                        id: true,
                                        name: true,
                                        image: true,
                                        totalScore: true
                                        // Events are NOT pre-loaded here to save bandwidth and memory
                                    }
                                }
                            }
                        },
                    },
                    orderBy: {
                        score: 'desc'
                    }
                }
            }
        });

        return NextResponse.json(leagues);
    } catch (error) {
        console.error("GET_LEADERBOARDS_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
