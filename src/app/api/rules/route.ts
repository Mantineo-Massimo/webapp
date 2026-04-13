import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const rules = await prisma.ruleDefinition.findMany({
            orderBy: [
                { category: 'asc' },
                { points: 'desc' }
            ]
        });
        return NextResponse.json(rules);
    } catch (error: any) {
        console.error("GET_PUBLIC_RULES_ERROR", error);
        return NextResponse.json({ 
            error: "Errore nel caricamento del regolamento",
            details: error.message 
        }, { status: 500 });
    }
}
