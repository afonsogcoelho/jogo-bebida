import type { Match } from "@/types/game";
import { teaserChallenges, timesLabel, totalChallenges } from "@/lib/game";

/** Os 5 desafios principais da Ronda 1 + o que falta revelar. Os eventos raros nunca aparecem aqui. */
export function ChallengePreview({ match }: { match: Match }) {
  const teaser = teaserChallenges(match);
  const hidden = totalChallenges(match) - teaser.length;

  return (
    <section aria-labelledby="preview-title" className="pb-4">
      <h2 id="preview-title" className="text-sm font-medium tracking-wide text-muted uppercase">
        Alguns desafios da 1.ª ronda
      </h2>
      <ul className="mt-4 flex flex-col gap-2.5">
        {teaser.map((c, i) => (
          <li
            key={c.id}
            className="rise flex items-center justify-between gap-4 rounded-2xl bg-surface px-5 py-4"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <span className="font-display text-[1.375rem] leading-tight font-semibold uppercase md:text-2xl">
              {c.text}
            </span>
            <span className="shrink-0 font-display text-2xl leading-none font-bold">{timesLabel(c.times)}</span>
          </li>
        ))}
        <li
          className="rise card-back flex min-h-24 flex-col items-center justify-center rounded-2xl text-center text-white"
          style={{ animationDelay: `${teaser.length * 60}ms` }}
        >
          <span className="font-display text-2xl font-bold uppercase">+{hidden} desafios por revelar</span>
          <span className="mt-0.5 text-sm text-white/80">Sorteados ronda a ronda, no dia do jogo</span>
        </li>
      </ul>
    </section>
  );
}
