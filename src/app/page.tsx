import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import CountdownTimer from "@/components/CountdownTimer";

export default async function Home() {
  const settings = await prisma.systemSettings.findFirst();
  const deadlineIso = settings?.draftDeadline ? settings.draftDeadline.toISOString() : null;

  return (
    <main className="min-h-screen text-white flex flex-col pt-56 md:pt-44 items-center">

      {/* Hero Section */}
      <section className="w-full px-6 flex flex-col items-center justify-center text-center max-w-5xl space-y-8 animate-fade-in">
        <div className="relative inline-block mt-8 mb-4">
          <Image
            src="/fanta-logo.png"
            alt="FantaPiazza Logo"
            width={800}
            height={300}
            className="w-full max-w-4xl mx-auto drop-shadow-[0_0_30px_rgba(255,215,0,0.4)]"
            priority
          />
        </div>

        <p className="text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed italic mt-6">
          &quot;Dove l&apos;Arte incontra il gioco. Due associazioni, un&apos;unica grande piazza.
          Costruisci la tua squadra dei sogni, scommetti sui tuoi Armoni, e conquista le leghe
          di Morgana e Orum.&quot;
        </p>

        {deadlineIso && (
          <div className="mt-8 mb-4 w-full flex justify-center">
            <CountdownTimer targetDate={deadlineIso} />
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Link
            href="/auth/register"
            className="px-8 py-3 rounded-full bg-oro text-blunotte font-bold text-lg hover:bg-yellow-300 transition-all shadow-[0_0_15px_rgba(255,215,0,0.5)] transform hover:scale-105"
          >
            Inizia l&apos;Avventura
          </Link>
          <Link
            href="/auth/login"
            className="px-8 py-3 rounded-full bg-viola text-white font-bold text-lg hover:bg-purple-800 transition-all border border-purple-500 shadow-[0_0_15px_rgba(88,28,135,0.4)] transform hover:scale-105"
          >
            Accedi
          </Link>
        </div>
      </section>



    </main>
  );
}
