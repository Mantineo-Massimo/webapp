import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    } catch (error) {
        console.error("GET_SETTINGS_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
