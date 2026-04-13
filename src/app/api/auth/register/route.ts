import { checkRateLimit, sanitizeInput, isBot } from "@/lib/security";

export async function POST(req: Request) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
        
        // Rate limit: 10 registrations per hour per IP
        const allowed = await checkRateLimit(ip, "register", 10, 60 * 60 * 1000);
        if (!allowed) {
            return NextResponse.json({ error: "Troppi tentativi. Riprova più tardi." }, { status: 429 });
        }

        const body = await req.json();
        const { email, password, confirmPassword, name, surname, phone, phone_confirm } = body;

        // Honeypot check
        if (isBot(phone_confirm)) {
            console.warn("Bot detected via honeypot:", ip);
            return NextResponse.json({ error: "Registrazione completata correttamente." }); // Fake success for bots
        }

        if (!email || !password || !name || !surname) {
            return new NextResponse("Email, password, nome e cognome sono obbligatori.", { status: 400 });
        }

        // Sanitize names
        const cleanName = sanitizeInput(name);
        const cleanSurname = sanitizeInput(surname);
        const cleanPhone = sanitizeInput(phone || "");

        if (password !== confirmPassword) {
            return new NextResponse("Le password non coincidono.", { status: 400 });
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
                verificationToken,
                name: cleanName,
                surname: cleanSurname,
                phone: cleanPhone
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
    } catch (error: any) {
        console.error("REGISTRATION_ERROR", error);
        return NextResponse.json({ 
            error: "Errore durante la registrazione",
            details: error.message
        }, { status: 500 });
    }
}
