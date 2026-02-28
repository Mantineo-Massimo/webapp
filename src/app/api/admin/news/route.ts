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

        const news = await prisma.news.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(news);
    } catch (error) {
        console.error("ADMIN_GET_NEWS_ERROR", error);
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
        const { title, content, image } = body;

        if (!title || !content) {
            return new NextResponse("Missing title or content", { status: 400 });
        }

        const newsItem = await prisma.news.create({
            data: {
                title,
                content,
                image,
                authorId: session.user.id
            }
        });

        return NextResponse.json(newsItem);
    } catch (error) {
        console.error("ADMIN_POST_NEWS_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

        const user = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (!user || user.role !== "ADMIN") return new NextResponse("Forbidden", { status: 403 });

        const body = await req.json();
        const { id, title, content, image } = body;

        if (!id) return new NextResponse("Missing ID", { status: 400 });

        const newsItem = await prisma.news.update({
            where: { id },
            data: {
                title,
                content,
                image
            }
        });

        return NextResponse.json(newsItem);
    } catch (error) {
        console.error("ADMIN_PUT_NEWS_ERROR", error);
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

        if (!id) return new NextResponse("Missing News ID", { status: 400 });

        await prisma.news.delete({
            where: { id }
        });

        return new NextResponse("News deleted", { status: 200 });
    } catch (error) {
        console.error("ADMIN_DELETE_NEWS_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
