import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const rulesData = [
    { category: "Canto", title: "A cappella", description: "L'artista canta almeno 15 secondi senza base musicale", points: 15 },
    { category: "Canto", title: "L'Acuto Spezza-Cristalli", description: "L'artista tiene una nota alta per più di 5 secondi", points: 10 },
    { category: "Canto", title: "Standing Ovation", description: "Tutto il pubblico si alza in piedi alla fine", points: 20 },
    { category: "Canto", title: "Pelle d'Oca", description: "Almeno un giurato viene inquadrato mentre si tocca il braccio per l'emozione", points: 10 },
    { category: "Canto", title: "Dedicato a te", description: "L'artista dedica la canzone a qualcuno presente in piazza", points: 5 },
    { category: "Canto", title: "Microfono a giraffa", description: "L'artista stacca il microfono dall'asta", points: 5 },
    { category: "Canto", title: "Il \"Batti le mani\"", description: "L'artista incita la piazza a battere le mani a tempo", points: 5 },
    { category: "Canto", title: "Vocalizzo selvaggio", description: "L'artista imita il verso di un animale o un suono non umano durante il brano", points: 10 },
    { category: "Danza", title: "Spaccata Improvvisa", description: "L'artista esegue una spaccata (anche se non prevista)", points: 15 },
    { category: "Danza", title: "Presa Acrobatica", description: "Sollevamento o acrobazia che sfida la gravità", points: 15 },
    { category: "Danza", title: "Sincro Perfetto", description: "Se in gruppo, i ballerini si muovono come un unico organismo per tutto il tempo", points: 10 },
    { category: "Danza", title: "Polvere di Fata", description: "L'artista usa borotalco o glitter che volano via durante un movimento", points: 10 },
    { category: "Danza", title: "Oggetto di Scena", description: "Uso creativo di un oggetto non convenzionale (una sedia, un ombrello, una maschera)", points: 10 },
    { category: "Danza", title: "Coreografia in Platea", description: "Il ballerino danza tra le sedie degli spettatori", points: 15 },
    { category: "Danza", title: "Assolo Infuocato", description: "Almeno 20 secondi di danza solista senza altri artisti sul palco", points: 10 },
    { category: "Tematici", title: "Mantello del Mistero", description: "L'artista indossa un mantello", points: 10 },
    { category: "Tematici", title: "Trasformismo", description: "Cambio d'abito rapido (on-stage)", points: 20 },
    { category: "Tematici", title: "Patto con l'Admin", description: "L'artista saluta l'Admin", points: 10 },
    { category: "Tematici", title: "Dab con Parisi", description: "L'artista fa la dab con il presentatore", points: 5 },
    { category: "Tematici", title: "Il Simbolo Segreto", description: "L'artista fa il ringraziamento per le associazioni Morgana o Orum", points: 15 },
    { category: "Piazza", title: "Pioggia d'Applausi", description: "Inizia a piovere ma l'artista continua l'esibizione", points: 30 },
    { category: "Piazza", title: "Incursione Animale", description: "Un cane, un gatto o un uccello entra nell'area della performance (Bonus Leggendario)", points: 50 },
    { category: "Piazza", title: "Parenti Serpenti", description: "Una nonna o un genitore dell'artista piange in prima fila", points: 15 },
    { category: "Piazza", title: "Il Bis", description: "Il pubblico urla \"Bis!\" a gran voce", points: 10 },
    { category: "Piazza", title: "Regalo dal Pubblico", description: "Qualcuno lancia un fiore o un peluche sul palco", points: 10 },
    { category: "Malus", title: "Nudo ma non Crudo", description: "Perdita accidentale di una spallina o pezzo di costume che rivela troppo", points: -20 },
    { category: "Malus", title: "Caduta del Microfono", description: "Il microfono scivola di mano", points: -10 },
    { category: "Malus", title: "Audio Fantasma", description: "Parte la base sbagliata o la base si ferma a metà", points: -15 },
    { category: "Malus", title: "Gelo in Piazza", description: "L'artista fa una battuta che non fa ridere nessuno", points: -10 },
    { category: "Malus", title: "Autogol", description: "L'artista inciampa sui cavi del service", points: -10 },
    { category: "Malus", title: "L'Orologio", description: "L'esibizione dura più di 2 minuti oltre il tempo massimo", points: -10 },
    { category: "Malus", title: "Polemica in Diretta", description: "L'artista contesta il voto della giuria appena lo riceve", points: -20 },
    { category: "Malus", title: "Il \"Fuori Tempo\"", description: "Il ballerino finisce la coreografia dopo che la musica è già spenta", points: -5 },
    { category: "Finale", title: "Vittoria Assoluta", description: "L'artista vince il premio della serata", points: 50 },
    { category: "Finale", title: "Ultimo Posto", description: "L'artista arriva ultimo nella classifica ufficiale (Bonus Consolazione)", points: 10 },
];

async function main() {
    console.log('Seeding rules...');
    for (const rule of rulesData) {
        await prisma.ruleDefinition.create({
            data: rule
        });
    }
    console.log('Seeding finished.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
