import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 60; // Cache for 1 minute

// GET /api/artists
export async function GET() {
    try {
        const artists = await prisma.artist.findMany({
            orderBy: {
                cost: 'desc'
            }
        });

        return NextResponse.json(artists);
    } catch (error) {
        console.error("GET_ARTISTS_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
