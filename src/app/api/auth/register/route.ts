import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { sendEmail } from "@/lib/email";
import { verificationEmail } from "@/lib/email-templates";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return new NextResponse("Email and password are required", { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return new NextResponse("User already exists", { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const verificationToken = crypto.randomUUID();

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                verificationToken
            }
        });

        // Send Verification Email
        try {
            await sendEmail({
                to: email,
                subject: "Verifica il tuo account FantaPiazza 🎠",
                body: verificationEmail(verificationToken)
            });
        } catch (err) {
            console.error("VERIFICATION_EMAIL_ERROR", err);
        }

        return NextResponse.json({ id: user.id, email: user.email, role: user.role });
    } catch (error) {
        console.error("REGISTRATION_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
