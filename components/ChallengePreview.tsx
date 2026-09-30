import type { Match } from "@/types/game";
import { teaserChallenges, timesLabel, totalChallenges } from "@/lib/game";

const MOBILE_COUNT = 3;

/**
 * Preview dos desafios principais da Ronda 1: 3 no mobile, 5 no desktop.
 * Os eventos raros nunca aparecem aqui.
 */
export function ChallengePreview({ match }: { match: Match }) {
  const teaser = teaserChallenges(match);
  const total = totalChallenges(match);

  return (
    <section aria-labelledby="preview-title" className="pb-2">
      <h2 id="preview-title" className="text-[13px] font-medium tracking-wide text-muted uppercase md:text-sm">
        Alguns desafios da 1.ª ronda
      </h2>
      <ul className="mt-2.5 flex flex-col gap-1.5 md:mt-4 md:gap-2.5">
        {teaser.map((c, i) => (
          <li
            key={c.id}
            className={`rise items-center justify-between gap-4 rounded-xl bg-surface px-4 py-2.5 md:rounded-2xl md:px-5 md:py-4 ${
              i < MOBILE_COUNT ? "flex" : "hidden md:flex"
            }`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <span className="font-display text-lg leading-tight font-semibold uppercase md:text-2xl">{c.text}</span>
            <span className="shrink-0 font-display text-xl leading-none font-bold md:text-2xl">
              {timesLabel(c.times)}
            </span>
          </li>
        ))}
        {/* Mobile: linha discreta, para não competir com o CTA */}
        <li
          className="rise rounded-xl border border-dashed border-line py-2 text-center font-display text-lg font-semibold text-muted uppercase md:hidden"
          style={{ animationDelay: `${MOBILE_COUNT * 60}ms` }}
        >
          +{total - MOBILE_COUNT} desafios por revelar
        </li>
        <li
          className="rise card-back hidden min-h-24 flex-col items-center justify-center rounded-2xl text-center text-white md:flex"
          style={{ animationDelay: `${teaser.length * 60}ms` }}
        >
          <span className="font-display text-2xl font-bold uppercase">+{total - teaser.length} desafios por revelar</span>
          <span className="mt-0.5 text-sm text-white/80">Sorteados ronda a ronda, no dia do jogo</span>
        </li>
      </ul>
    </section>
  );
}
