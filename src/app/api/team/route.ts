import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        const body = await req.json();
        const { teamName, artistIds, image } = body;

        // Validation
        if (!teamName || !artistIds || artistIds.length !== 5) {
            return new NextResponse("Invalid request data. Must provide a team name and exactly 5 artists.", { status: 400 });
        }

        // --- Deadline Check ---
        const settings = await prisma.systemSettings.findFirst();
        if (settings?.draftDeadline && new Date() > settings.draftDeadline) {
            return new NextResponse("Draft deadline has passed. You can no longer create a team.", { status: 403 });
        }
        // ----------------------

        const artists = await prisma.artist.findMany({
            where: { id: { in: artistIds } }
        });

        if (artists.length !== 5) {
            return new NextResponse("Some artists were not found", { status: 400 });
        }

        const totalCost = artists.reduce((sum: number, artist: { cost: number }) => sum + artist.cost, 0);
        if (totalCost > 100) {
            return new NextResponse("Armoni insufficienti", { status: 400 });
        }

        const existingTeam = await prisma.team.findUnique({
            where: { userId: user.id }
        });

        if (existingTeam) {
            return new NextResponse("User already has a team", { status: 409 });
        }

        const nameInUse = await prisma.team.findUnique({
            where: { name: teamName }
        });

        if (nameInUse) {
            return new NextResponse("Team name already taken", { status: 409 });
        }

        // Identify the 5 Leagues to auto-enroll (now 1 Generale)
        const leagues = await prisma.league.findMany();

        // Transaction to ensure atomicity
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const team = await prisma.$transaction(async (tx: any) => {
            // 1. Create the team
            const newTeam = await tx.team.create({
                data: {
                    name: teamName,
                    image: image || null,
                    userId: user.id,
                    artists: {
                        connect: artists.map((a: { id: string }) => ({ id: a.id }))
                    }
                }
            });

            // 2. Enroll the team in all leagues with current points
            const initialScore = artists.reduce((sum: number, a: { totalScore: number }) => sum + a.totalScore, 0);

            const teamLeaguesData = leagues.map((league: { id: string }) => ({
                teamId: newTeam.id,
                leagueId: league.id,
                score: initialScore
            }));

            await tx.teamLeague.createMany({
                data: teamLeaguesData
            });

            return newTeam;
        });

        return NextResponse.json(team);

    } catch (error) {
        console.error("CREATE_TEAM_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        const team = await prisma.team.findUnique({
            where: { userId: user.id },
            include: { artists: true }
        });

        return NextResponse.json(team || null);
    } catch (error) {
        console.error("GET_TEAM_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        const body = await req.json();
        const { teamName, artistIds, image } = body;

        if (!teamName || !artistIds || artistIds.length !== 5) {
            return new NextResponse("Invalid request data", { status: 400 });
        }

        // Deadline check
        const settings = await prisma.systemSettings.findFirst();
        if (settings?.draftDeadline && new Date() > settings.draftDeadline) {
            return new NextResponse("Draft deadline has passed. You can no longer modify the team.", { status: 403 });
        }

        const artists = await prisma.artist.findMany({
            where: { id: { in: artistIds } }
        });

        if (artists.length !== 5) {
            return new NextResponse("Some artists were not found", { status: 400 });
        }

        const totalCost = artists.reduce((sum: number, artist: { cost: number }) => sum + artist.cost, 0);
        if (totalCost > 100) {
            return new NextResponse("Armoni insufficienti", { status: 400 });
        }

        const existingTeam = await prisma.team.findUnique({
            where: { userId: user.id },
            include: { artists: true }
        });

        if (!existingTeam) {
            return new NextResponse("Team not found", { status: 404 });
        }

        // Check if name is taken by another team
        const nameInUse = await prisma.team.findUnique({
            where: { name: teamName }
        });
        if (nameInUse && nameInUse.id !== existingTeam.id) {
            return new NextResponse("Team name already taken", { status: 409 });
        }

        // Update team and its score in leagues
        const updatedScore = artists.reduce((sum: number, a: { totalScore: number }) => sum + a.totalScore, 0);

        const updatedTeam = await prisma.$transaction(async (tx: any) => {
            // 1. Update team artists
            const team = await tx.team.update({
                where: { id: existingTeam.id },
                data: {
                    name: teamName,
                    image: image || null,
                    artists: {
                        set: artistIds.map((id: string) => ({ id }))
                    }
                }
            });

            // 2. Update scores in all leagues
            await tx.teamLeague.updateMany({
                where: { teamId: existingTeam.id },
                data: {
                    score: updatedScore
                }
            });

            return team;
        });

        return NextResponse.json(updatedTeam);

    } catch (error) {
        console.error("UPDATE_TEAM_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
