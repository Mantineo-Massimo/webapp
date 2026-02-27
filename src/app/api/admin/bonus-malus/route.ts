import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        // Check if user is logged in
        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Check if user is an ADMIN
        // Depending on NextAuth setup, session.user.role might be available
        // or we fetch it from the DB just to be safe
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user || user.role !== "ADMIN") {
            return new NextResponse("Forbidden: Admin access required", { status: 403 });
        }

        const body = await req.json();
        const { artistId, points, description } = body;

        if (!artistId || points === undefined || !description) {
            return new NextResponse("Invalid request data.", { status: 400 });
        }

        // Transaction to update Artist Score, Log the Event, and Update all Teams in Leagues
        const result = await prisma.$transaction(async (tx) => {

            // 1. Create the BonusMalusEvent
            const event = await tx.bonusMalusEvent.create({
                data: {
                    artistId,
                    points: parseInt(points),
                    description
                }
            });

            // 2. Update the Artist's total score
            await tx.artist.update({
                where: { id: artistId },
                data: {
                    totalScore: {
                        increment: parseInt(points)
                    }
                }
            });

            // 3. Find all Teams that have this artist
            const teamsWithArtist = await tx.team.findMany({
                where: {
                    artists: {
                        some: { id: artistId }
                    }
                },
                select: { id: true }
            });

            const teamIds = teamsWithArtist.map(t => t.id);

            // 4. Increment the score for these teams in EVERY league they participate
            if (teamIds.length > 0) {
                await tx.teamLeague.updateMany({
                    where: {
                        teamId: { in: teamIds }
                    },
                    data: {
                        score: {
                            increment: parseInt(points)
                        }
                    }
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
