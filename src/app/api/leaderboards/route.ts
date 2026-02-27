import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const leagues = await prisma.league.findMany({
            include: {
                teams: {
                    include: {
                        team: true,
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
