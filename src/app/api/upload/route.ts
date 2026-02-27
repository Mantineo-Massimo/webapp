import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return new NextResponse("Unauthorized", { status: 401 });

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return new NextResponse("User not found", { status: 404 });

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return new NextResponse("No file uploaded", { status: 400 });
        }

        // Upload to Vercel Blob
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
        const blob = await put(`uploads/${filename}`, file, {
            access: 'public',
        });

        console.log(`File uploaded to Vercel Blob: ${blob.url}`);

        return NextResponse.json({ url: blob.url });
    } catch (error: any) {
        console.error("UPLOAD_ERROR_DETAILS:", {
            message: error.message,
            stack: error.stack
        });
        return new NextResponse(`Errore Server (Blob): ${error.message}`, { status: 500 });
    }
}
