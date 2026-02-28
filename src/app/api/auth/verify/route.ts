import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get("token");

        if (!token) {
            return new NextResponse("Token mancante", { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { verificationToken: token }
        });

        if (!user) {
            return new NextResponse("Token non valido o scaduto", { status: 400 });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: new Date(),
                verificationToken: null // Clear token after use
            }
        });

        // Redirect to login with success message
        return NextResponse.redirect(new URL("/auth/login?verified=true", req.url));

    } catch (error) {
        console.error("VERIFY_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
