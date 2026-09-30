import type { Match } from "@/types/game";
import { formatShortDay, formatTime } from "@/lib/dates";

export function MatchHero({ match }: { match: Match }) {
  return (
    <header className="pt-14 pb-8 md:pt-0">
      <p className="text-sm font-medium tracking-wide text-muted uppercase md:text-base">
        {match.competition} · {formatShortDay(match)} · {formatTime(match.kickoff)}
      </p>
      <h1 className="mt-5 font-display leading-[0.9] font-bold uppercase">
        <span className="block text-[4rem] md:text-[6.5rem] lg:text-[7.5rem]">{match.teamA}</span>
        <span className="my-1 block text-2xl font-semibold text-muted md:text-3xl">vs</span>
        <span className="block text-[4rem] md:text-[6.5rem] lg:text-[7.5rem]">{match.teamB}</span>
      </h1>
      <p className="mt-6 max-w-[21rem] text-lg leading-snug text-ink/85 md:max-w-md md:text-xl">
        Cada um recebe um desafio e um evento raro. Quando acontecer, bebe o número indicado.
      </p>
    </header>
  );
}
