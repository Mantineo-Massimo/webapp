import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Save in public/uploads
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
        const relativePath = `/uploads/${filename}`;
        const absolutePath = join(process.cwd(), "public", "uploads", filename);

        // Ensure directory exists
        await mkdir(join(process.cwd(), "public", "uploads"), { recursive: true });

        await writeFile(absolutePath, buffer);
        console.log(`File uploaded to ${absolutePath}`);

        return NextResponse.json({ url: relativePath });
    } catch (error: any) {
        console.error("UPLOAD_ERROR_DETAILS:", {
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        return new NextResponse(`Errore Server: ${error.message}`, { status: 500 });
    }
}
