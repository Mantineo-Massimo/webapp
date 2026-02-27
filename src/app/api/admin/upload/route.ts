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
        if (!user || user.role !== "ADMIN") return new NextResponse("Forbidden", { status: 403 });

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return new NextResponse("No file uploaded", { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
        const path = join(process.cwd(), "public", "artists", filename);

        // Ensure directory exists
        await mkdir(join(process.cwd(), "public", "artists"), { recursive: true });

        await writeFile(path, buffer);
        console.log(`File uploaded to ${path}`);

        return NextResponse.json({ url: `/artists/${filename}` });
    } catch (error) {
        console.error("UPLOAD_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
