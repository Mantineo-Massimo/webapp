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

        const sponsors = await prisma.sponsor.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(sponsors);
    } catch (error) {
        console.error("ADMIN_GET_SPONSORS_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

        const user = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (!user || user.role !== "ADMIN") return new NextResponse("Forbidden", { status: 403 });

        const body = await req.json();
        const { name, logoUrl } = body;

        if (!name || !logoUrl) {
            return new NextResponse("Missing name or logoUrl", { status: 400 });
        }

        const sponsor = await prisma.sponsor.create({
            data: {
                name,
                logoUrl
            }
        });

        return NextResponse.json(sponsor);
    } catch (error) {
        console.error("ADMIN_POST_SPONSOR_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

        const user = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (!user || user.role !== "ADMIN") return new NextResponse("Forbidden", { status: 403 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) return new NextResponse("Missing sponsor ID", { status: 400 });

        await prisma.sponsor.delete({
            where: { id }
        });

        return new NextResponse("Sponsor deleted", { status: 200 });
    } catch (error) {
        console.error("ADMIN_DELETE_SPONSOR_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
