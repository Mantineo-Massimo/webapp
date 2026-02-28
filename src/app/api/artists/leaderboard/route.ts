import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const artists = await prisma.artist.findMany({
            include: {
                events: {
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            },
            orderBy: {
                totalScore: 'desc'
            }
        });

        return NextResponse.json(artists);
    } catch (error) {
        console.error("GET_ARTISTS_LEADERBOARD_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
