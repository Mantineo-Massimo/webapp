import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const rules = await prisma.ruleDefinition.findMany({
            orderBy: [
                { category: 'asc' },
                { points: 'desc' }
            ]
        });
        return NextResponse.json(rules);
    } catch (error) {
        console.error("GET_RULES_ERROR", error);
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
        const { category, title, description, points } = body;

        if (!category || !title || !description || points === undefined) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const newRule = await prisma.ruleDefinition.create({
            data: {
                category,
                title,
                description,
                points: parseInt(points)
            }
        });

        return NextResponse.json(newRule);
    } catch (error) {
        console.error("CREATE_RULE_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return new NextResponse("Unauthorized", { status: 401 });

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user || user.role !== "ADMIN") return new NextResponse("Forbidden", { status: 403 });

        const body = await req.json();
        const { id, category, title, description, points } = body;

        if (!id) return new NextResponse("Missing ID", { status: 400 });

        const updatedRule = await prisma.ruleDefinition.update({
            where: { id },
            data: {
                category,
                title,
                description,
                points: points !== undefined ? parseInt(points) : undefined
            }
        });

        return NextResponse.json(updatedRule);
    } catch (error) {
        console.error("UPDATE_RULE_ERROR", error);
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

        if (!id) return new NextResponse("Missing ID", { status: 400 });

        // Complex Reversion Logic
        await prisma.$transaction(async (tx: any) => {
            // 1. Find all events linked to this rule
            const events = await tx.bonusMalusEvent.findMany({
                where: { ruleId: id }
            });

            // 2. For each event, revert points from artists and teams
            for (const event of events) {
                // Subtract from Artist
                await tx.artist.update({
                    where: { id: event.artistId },
                    data: { totalScore: { decrement: event.points } }
                });

                // Find teams with this artist
                const teamsWithArtist = await tx.team.findMany({
                    where: { artists: { some: { id: event.artistId } } },
                    select: { id: true }
                });

                const teamIds = teamsWithArtist.map((t: { id: string }) => t.id);
                if (teamIds.length > 0) {
                    // Subtract from TeamLeague scores
                    await tx.teamLeague.updateMany({
                        where: { teamId: { in: teamIds } },
                        data: { score: { decrement: event.points } }
                    });
                }

                // Delete the event
                await tx.bonusMalusEvent.delete({ where: { id: event.id } });
            }

            // 3. Finally delete the rule itself
            await tx.ruleDefinition.delete({
                where: { id }
            });
        });

        return new NextResponse("Deleted and points storned", { status: 200 });
    } catch (error) {
        console.error("DELETE_RULE_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
