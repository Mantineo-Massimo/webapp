import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const events = await prisma.bonusMalusEvent.findMany({
            include: {
                artist: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return NextResponse.json(events);
    } catch (error) {
        console.error("GET_EVENTS_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return new NextResponse("Unauthorized", { status: 401 });

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user || user.role !== "ADMIN") return new NextResponse("Forbidden", { status: 403 });

        const body = await req.json();
        const { artistId, points, description } = body;

        if (!artistId || points === undefined || !description) {
            return new NextResponse("Invalid request data.", { status: 400 });
        }

        const result = await prisma.$transaction(async (tx: any) => {
            const event = await tx.bonusMalusEvent.create({
                data: { artistId, points: parseInt(points), description }
            });

            await tx.artist.update({
                where: { id: artistId },
                data: { totalScore: { increment: parseInt(points) } }
            });

            const teamsWithArtist = await tx.team.findMany({
                where: { artists: { some: { id: artistId } } },
                select: { id: true }
            });

            const teamIds = teamsWithArtist.map((t: { id: string }) => t.id);
            if (teamIds.length > 0) {
                await tx.teamLeague.updateMany({
                    where: { teamId: { in: teamIds } },
                    data: { score: { increment: parseInt(points) } }
                });
            }
            return event;
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("ADMIN_EVENT_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return new NextResponse("Unauthorized", { status: 401 });

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user || user.role !== "ADMIN") return new NextResponse("Forbidden", { status: 403 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) return new NextResponse("Missing event ID", { status: 400 });

        const event = await prisma.bonusMalusEvent.findUnique({ where: { id } });
        if (!event) return new NextResponse("Event not found", { status: 404 });

        const { artistId, points } = event;

        await prisma.$transaction(async (tx: any) => {
            // 1. Delete event
            await tx.bonusMalusEvent.delete({ where: { id } });

            // 2. Subtract points from artist
            await tx.artist.update({
                where: { id: artistId },
                data: { totalScore: { decrement: points } }
            });

            // 3. Subtract points from teams
            const teamsWithArtist = await tx.team.findMany({
                where: { artists: { some: { id: artistId } } },
                select: { id: true }
            });

            const teamIds = teamsWithArtist.map((t: { id: string }) => t.id);
            if (teamIds.length > 0) {
                await tx.teamLeague.updateMany({
                    where: { teamId: { in: teamIds } },
                    data: { score: { decrement: points } }
                });
            }
        });

        return new NextResponse("Deleted and scores reconciled", { status: 200 });
    } catch (error) {
        console.error("ADMIN_DELETE_EVENT_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
