import type { Match } from "@/types/game";
import { formatShortDay, formatTime } from "@/lib/dates";

export function MatchHero({ match }: { match: Match }) {
  return (
    <header className="pt-8 pb-5 md:pt-0 md:pb-8">
      <p className="text-[13px] font-medium tracking-wide text-muted uppercase md:text-base">
        {match.competition} · {formatShortDay(match)} · {formatTime(match.kickoff)}
      </p>
      <h1 className="mt-3 font-display leading-[0.9] font-bold uppercase md:mt-5">
        <span className="text-[3rem] md:block md:text-[6.5rem] lg:text-[7.5rem]">{match.teamA}</span>
        <span className="ml-2.5 text-xl font-semibold text-muted md:my-1 md:ml-0 md:block md:text-3xl">vs</span>
        <span className="block text-[3rem] md:text-[6.5rem] lg:text-[7.5rem]">{match.teamB}</span>
      </h1>
      <p className="mt-3 max-w-[21rem] text-base leading-snug text-ink/85 md:mt-6 md:max-w-md md:text-xl">
        Cada pessoa recebe um desafio e um raro. Se acontecer, bebe o número indicado.
      </p>
    </header>
  );
}
