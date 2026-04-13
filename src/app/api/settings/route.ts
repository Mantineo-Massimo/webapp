import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 60; // Cache for 1 minute

export async function GET() {
    try {
        let settings = await prisma.systemSettings.findFirst();
        if (!settings) {
            // Create default if not exists
            settings = await prisma.systemSettings.create({
                data: {}
            });
        }
        return NextResponse.json(settings);
    } catch (error: any) {
        console.error("SETTINGS_GET_ERROR", error);
        return NextResponse.json({ 
            error: "Errore nel caricamento dei parametri di sistema",
            details: error.message
        }, { status: 500 });
    }
}
