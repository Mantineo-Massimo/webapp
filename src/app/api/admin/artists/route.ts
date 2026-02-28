import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { newArtistEmail } from "@/lib/email-templates";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return new NextResponse("Unauthorized", { status: 401 });

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user || user.role !== "ADMIN") return new NextResponse("Forbidden", { status: 403 });

        const body = await req.json();
        const { name, cost, image } = body;

        if (!name || cost === undefined) {
            return new NextResponse("Missing name or cost", { status: 400 });
        }

        const newArtist = await prisma.artist.create({
            data: {
                name,
                cost: parseInt(cost),
                image: image || null,
                totalScore: 0
            }
        });

        // Notify Users
        try {
            const users = await prisma.user.findMany({ select: { email: true } });
            for (const u of users) {
                await sendEmail({
                    to: u.email,
                    subject: `Nuova Artist FantaPiazza: ${name}`,
                    body: newArtistEmail(name, parseInt(cost))
                });
            }
        } catch (err) {
            console.error("NOTIFY_USERS_ERROR", err);
        }

        return NextResponse.json(newArtist);
    } catch (error) {
        console.error("ADMIN_CREATE_ARTIST_ERROR", error);
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

        if (!id) return new NextResponse("Missing artist ID", { status: 400 });

        await prisma.artist.delete({
            where: { id }
        });

        return new NextResponse("Deleted", { status: 200 });
    } catch (error) {
        console.error("ADMIN_DELETE_ARTIST_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
