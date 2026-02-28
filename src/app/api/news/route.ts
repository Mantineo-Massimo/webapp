import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const news = await prisma.news.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            take: 10,
        });
        return NextResponse.json(news);
    } catch (error: any) {
        console.error("Error fetching news:", error);
        return NextResponse.json({ error: "Errore nel caricamento delle news" }, { status: 500 });
    }
}
