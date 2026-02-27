import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { sendEmail } from "@/lib/email";

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

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            }
        });

        // Send Welcome Email
        try {
            await sendEmail({
                to: email,
                subject: "Benvenuto su FantaPiazza! 🎠",
                body: `
                    <h2 style="color: #bc9c5d;">Benvenuto in FantaPiazza!</h2>
                    <p>Siamo felici di averti con noi.</p>
                    <p>Ora puoi iniziare a costruire la tua squadra, selezionando i tuoi 5 artisti preferiti e partecipando alla lega ufficiale.</p>
                    <hr/>
                    <p>Il Team di FantaPiazza</p>
                `
            });
        } catch (err) {
            console.error("WELCOME_EMAIL_ERROR", err);
        }

        return NextResponse.json({ id: user.id, email: user.email, role: user.role });
    } catch (error) {
        console.error("REGISTRATION_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
