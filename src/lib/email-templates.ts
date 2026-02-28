/**
 * FantaPiazza Email Templates
 * Branded HTML templates for automated communications.
 */

const APP_COLOR_GOLD = "#bc9c5d";
const APP_COLOR_DARK_BLUE = "#0a0f1c";

const BASE_URL = process.env.NEXTAUTH_URL || "https://fantapiazza.it";

/**
 * Modern HTML wrapper for all FantaPiazza emails.
 */
const emailWrapper = (content: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        body {
            margin: 0;
            padding: 0;
            background-color: #f4f7fa;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #1e293b;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0,0,0,0.05);
        }
        .header {
            background-color: ${APP_COLOR_DARK_BLUE};
            padding: 40px;
            text-align: center;
        }
        .logo {
            width: 180px;
            height: auto;
        }
        .content {
            padding: 40px;
            line-height: 1.6;
        }
        .h1 {
            color: ${APP_COLOR_DARK_BLUE};
            font-size: 28px;
            font-weight: 900;
            margin-bottom: 24px;
            text-transform: uppercase;
            letter-spacing: -0.02em;
        }
        .text {
            font-size: 16px;
            margin-bottom: 24px;
            color: #475569;
        }
        .button {
            display: inline-block;
            padding: 16px 32px;
            background: linear-gradient(135deg, ${APP_COLOR_GOLD}, #8e7345);
            color: #0a0f1c !important;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 900;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            box-shadow: 0 5px 15px rgba(188, 156, 93, 0.3);
        }
        .footer {
            background-color: #f8fafc;
            padding: 30px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
            border-top: 1px solid #f1f5f9;
        }
        .social-link {
            color: ${APP_COLOR_GOLD};
            margin: 0 10px;
            text-decoration: none;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <!-- Logo uses dynamic BASE_URL to ensure visibility in all environments -->
            <img src="${BASE_URL}/fanta-logo.png" alt="FantaPiazza" class="logo">
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <p>&copy; 2024 FantaPiazza • Piazza dell'Arte</p>
            <p>
                Associazione Culturale Morgana & Orum
            </p>
        </div>
    </div>
</body>
</html>
`;


export const welcomeEmail = (email: string) => emailWrapper(`
    <h1 class="h1">Benvenuto in Piazza! 🎠</h1>
    <p class="text">Ciao <strong>${email}</strong>,</p>
    <p class="text">La tua iscrizione a <strong>FantaPiazza</strong> è stata confermata con successo! Sei pronto a sfidare i tuoi amici nel gioco più appassionante della Piazza dell'Arte?</p>
    <p class="text">Ecco cosa puoi fare ora:</p>
    <ul class="text" style="padding-left: 20px;">
        <li>Crea la tua squadra con 5 artisti</li>
        <li>Scegli un <strong>Capitano</strong> per raddoppiare i punti!</li>
        <li>Scala la classifica generale</li>
    </ul>
    <div style="text-align: center; margin-top: 40px;">
        <a href="${BASE_URL}/team/create" class="button">Fonda la tua Squadra</a>
    </div>
`);

export const newArtistEmail = (name: string, cost: number) => emailWrapper(`
    <h1 class="h1">Nuovo Artista sul Palco! 🎭</h1>
    <p class="text">Grandi novità! Un nuovo artista si è appena unito alla competizione di FantaPiazza.</p>
    <div style="background-color: #f1f5f9; padding: 24px; border-radius: 16px; margin-bottom: 24px; text-align: center;">
        <h2 style="margin: 0; color: #0a0f1c; font-size: 24px;">${name}</h2>
        <p style="margin: 8px 0 0 0; color: ${APP_COLOR_GOLD}; font-weight: 900; text-transform: uppercase; font-size: 14px;">Costo: ${cost} Armoni</p>
    </div>
    <p class="text">Controlla subito se questo artista può fare al caso tuo e aggiorna la tua formazione prima della prossima scadenza!</p>
    <div style="text-align: center; margin-top: 40px;">
        <a href="${BASE_URL}/team/create" class="button">Gestisci Squadra</a>
    </div>
`);

export const verificationEmail = (token: string) => emailWrapper(`
    <h1 class="h1">Verifica la tua Email 📧</h1>
    <p class="text">Grazie per esserti iscritto a <strong>FantaPiazza</strong>! Per completare la registrazione e iniziare a creare la tua squadra, clicca sul pulsante qui sotto:</p>
    <div style="text-align: center; margin-top: 40px;">
        <a href="${BASE_URL}/api/auth/verify?token=${token}" class="button">Verifica Account</a>
    </div>
    <p class="text" style="margin-top: 40px; font-size: 12px; color: #94a3b8;">
        Se il pulsante non funziona, copia e incolla questo link nel tuo browser:<br>
        ${BASE_URL}/api/auth/verify?token=${token}
    </p>
`);
