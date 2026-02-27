import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        // Authorization
        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user || user.role !== "ADMIN") {
            return new NextResponse("Forbidden: Admin access required", { status: 403 });
        }

        const body = await req.json();
        const { draftDeadline } = body;

        // We assume draftDeadline is either a valid ISO string or null
        let settings = await prisma.systemSettings.findFirst();

        if (settings) {
            settings = await prisma.systemSettings.update({
                where: { id: settings.id },
                data: {
                    draftDeadline: draftDeadline ? new Date(draftDeadline) : null
                }
            });
        } else {
            settings = await prisma.systemSettings.create({
                data: {
                    draftDeadline: draftDeadline ? new Date(draftDeadline) : null
                }
            });
        }

        return NextResponse.json(settings);

    } catch (error) {
        console.error("ADMIN_SETTINGS_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
