import { checkRateLimit } from "@/lib/security";

export async function POST(req: Request) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

        // Rate limit: 5 password reset requests per hour per IP
        const allowed = await checkRateLimit(ip, "forgot_password", 5, 60 * 60 * 1000);
        if (!allowed) {
            return NextResponse.json({ error: "Troppi tentativi. Riprova più tardi." }, { status: 429 });
        }
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ error: "Email obbligatoria" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        // For security reasons, don't reveal if user exists or not
        if (!user) {
            return NextResponse.json({ message: "Se l'email è presente nel nostro database, riceverai un link di reset." });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken,
                resetTokenExpiry
            }
        });

        const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;

        await sendEmail({
            to: user.email,
            subject: "Reset Password - FantaPiazza",
            body: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
                    <h2 style="color: #bc9c5d;">Richiesta Reset Password</h2>
                    <p>Hai richiesto di resettare la password del tuo account su <strong>FantaPiazza</strong>.</p>
                    <p>Clicca sul pulsante qui sotto per procedere:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background-color: #bc9c5d; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Resetta Password</a>
                    </div>
                    <p>Se non hai richiesto tu il reset, ignora questa email.</p>
                    <p>Il link scadrà tra un'ora.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;" />
                    <p style="font-size: 12px; color: #666;">Associazione Universitaria Morgana & Orum</p>
                </div>
            `
        });

        return NextResponse.json({ message: "Se l'email è presente nel nostro database, riceverai un link di reset." });

    } catch (error: any) {
        console.error("FORGOT_PASSWORD_ERROR", error);
        return NextResponse.json({ 
            error: "Errore durante la richiesta di reset",
            details: error.message 
        }, { status: 500 });
    }
}
