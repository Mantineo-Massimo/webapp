import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 30; // Cache for 30 seconds

export async function GET() {
    try {
        const artists = await prisma.artist.findMany({
            select: {
                id: true,
                name: true,
                image: true,
                totalScore: true,
                // Events removed from main list, loaded on detail click
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
