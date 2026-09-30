import { CURRENT_MATCH as match } from "@/data/matches";
import { MatchHero } from "@/components/MatchHero";
import { LandingActions } from "@/components/LandingActions";
import { ChallengePreview } from "@/components/ChallengePreview";

export default function Home() {
  return (
    <>
      <main className="flex flex-1 flex-col md:grid md:grid-cols-2 md:items-center md:gap-16 md:py-16 lg:gap-24">
        <div className="flex flex-1 flex-col md:flex-none">
          <MatchHero match={match} />
          <LandingActions match={match} />
        </div>
        <aside className="hidden md:block">
          <ChallengePreview match={match} />
        </aside>
      </main>
      <footer className="pt-2 pb-[calc(1.5rem+env(safe-area-inset-bottom))] text-center text-xs text-muted/70">
        Bebe com moderação. Proibido a menores de 18.
      </footer>
    </>
  );
}
