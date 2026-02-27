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

        const users = await prisma.user.findMany({
            include: {
                team: {
                    include: {
                        artists: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error("ADMIN_GET_USERS_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

        const admin = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (!admin || admin.role !== "ADMIN") return new NextResponse("Forbidden", { status: 403 });

        const body = await req.json();
        const { id, name, role } = body;

        if (!id) return new NextResponse("Missing user ID", { status: 400 });

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                name: name !== undefined ? name : undefined,
                role: role !== undefined ? role : undefined
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("ADMIN_UPDATE_USER_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

        const admin = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (!admin || admin.role !== "ADMIN") return new NextResponse("Forbidden", { status: 403 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) return new NextResponse("Missing user ID", { status: 400 });

        // Don't allow deleting yourself
        if (id === session.user.id) {
            return new NextResponse("Cannot delete yourself", { status: 400 });
        }

        await prisma.user.delete({
            where: { id }
        });

        return new NextResponse("User deleted", { status: 200 });
    } catch (error) {
        console.error("ADMIN_DELETE_USER_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
