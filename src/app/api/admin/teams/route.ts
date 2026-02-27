import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

        const user = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (!user || user.role !== "ADMIN") return new NextResponse("Forbidden", { status: 403 });

        const teams = await prisma.team.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                artists: true,
                leagues: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(teams);
    } catch (error) {
        console.error("ADMIN_GET_TEAMS_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
