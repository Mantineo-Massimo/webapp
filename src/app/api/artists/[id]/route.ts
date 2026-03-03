import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;

        const artist = await prisma.artist.findUnique({
            where: { id },
            include: {
                events: {
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });

        if (!artist) {
            return new NextResponse("Artist not found", { status: 404 });
        }

        return NextResponse.json(artist);
    } catch (error) {
        console.error("GET_ARTIST_DETAIL_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
