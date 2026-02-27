import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import CountdownTimer from "@/components/CountdownTimer";

export default async function Home() {
  const settings = await prisma.systemSettings.findFirst();
  const deadlineIso = settings?.draftDeadline ? settings.draftDeadline.toISOString() : null;

  return (
    <main className="min-h-screen bg-blunotte text-white flex flex-col pt-44 md:pt-28 items-center">

      {/* Hero Section */}
      <section className="w-full px-6 flex flex-col items-center justify-center text-center max-w-5xl space-y-8 animate-fade-in">
        <div className="relative inline-block mt-8 mb-4">
          <Image
            src="/fanta-logo.png"
            alt="FantaPiazza Logo"
            width={400}
            height={150}
            className="w-full max-w-md mx-auto drop-shadow-[0_0_20px_rgba(255,215,0,0.4)]"
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

      {/* Sezioni Morgana e Orum */}
      <section className="w-full max-w-6xl mt-24 px-6 grid grid-cols-1 md:grid-cols-2 gap-12 pb-24">

        {/* Morgana */}
        <div className="group relative bg-[#131d36] rounded-3xl p-8 border border-gray-800 hover:border-oro transition-all duration-300 shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-oro opacity-5 rounded-full blur-3xl group-hover:opacity-20 transition-all"></div>
          <h3 className="text-3xl font-bold mb-4 text-oro">Associazione Morgana</h3>
          <p className="text-gray-400 leading-relaxed mb-6">
            L&apos;incanto della fiaba e la forza della narrazione. Morgana accoglie l&apos;arte sotto forma
            di mistero, magia e teatro. In questa lega, i bardi e i poeti trovano il loro palcoscenico naturale.
          </p>
          <div className="h-1 w-16 bg-oro rounded-full"></div>
        </div>

        {/* Orum */}
        <div className="group relative bg-[#131d36] rounded-3xl p-8 border border-gray-800 hover:border-ocra transition-all duration-300 shadow-xl overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-ocra opacity-5 rounded-full blur-3xl group-hover:opacity-20 transition-all"></div>
          <h3 className="text-3xl font-bold mb-4 text-ocra">O.R.U.M.</h3>
          <p className="text-gray-400 leading-relaxed mb-6">
            La concretezza dell&apos;azione, la piazza che respira musica, artigianato e strada.
            Orum è l&apos;urlo della città che si fa arte, un collettore di energie vibranti
            e incontrollabili.
          </p>
          <div className="h-1 w-16 bg-ocra rounded-full"></div>
        </div>

      </section>

    </main>
  );
}
