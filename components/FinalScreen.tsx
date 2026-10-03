"use client";

import type { GameState, Match } from "@/types/game";
import { findChallenge, findRareEvent, MAIN_PENALTY, RARE_PENALTY } from "@/lib/game";
import { clearGame } from "@/lib/storage";
import { track } from "@/lib/analytics";
import { ShareButton } from "@/components/ShareButton";

export function FinalScreen({ match, game }: { match: Match; game: GameState }) {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col md:pb-16">
      <header className="rise pt-14 md:pt-16">
        <p className="text-sm font-medium tracking-wide text-muted uppercase">
          {match.teamA} vs {match.teamB}
        </p>
        <h1 className="mt-4 font-display text-[4.5rem] leading-[0.85] md:text-[7rem] font-bold uppercase">Apito final</h1>
        <p className="mt-4 text-lg text-ink/85">Revanche no próximo jogo.</p>
      </header>

      <section aria-label="Resumo" className="mt-10 grid grid-cols-1 gap-7 md:mt-14 md:grid-cols-2 md:gap-x-12 md:gap-y-10">
        {game.rounds.map((assignment, i) => {
          const round = match.rounds[i];
          return (
            <div key={round.id} className="rise" style={{ animationDelay: `${120 + i * 70}ms` }}>
              <h2 className="flex items-baseline justify-between border-b border-line pb-2">
                <span className="font-display text-xl font-bold uppercase">Ronda {round.id}</span>
                <span className="text-sm text-muted">{round.label}</span>
              </h2>
              <ul>
                {game.players.map((p) => {
                  const pick = assignment.picks[p.id];
                  const main = findChallenge(match, pick?.mainChallengeId);
                  const rare = findRareEvent(match, pick?.rareEventId);
                  return (
                    <li key={p.id} className="flex gap-3 border-b border-line/60 py-2.5 text-[15px]">
                      <span className="w-24 shrink-0 truncate text-muted">{p.name}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between gap-3">
                          <span className="min-w-0">{main?.text}</span>
                          {main && <span className="shrink-0 font-semibold whitespace-nowrap">{MAIN_PENALTY}</span>}
                        </div>
                        {rare && (
                          <div className="mt-0.5 flex justify-between gap-3 text-sm text-muted">
                            <span className="min-w-0">
                              <span className="mr-1.5 inline-block text-[11px] font-semibold tracking-[0.12em] text-accent uppercase">
                                Raro
                              </span>
                              {rare.text}
                            </span>
                            <span className="shrink-0 whitespace-nowrap">{RARE_PENALTY}</span>
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </section>

      <div className="action-bar mt-auto flex flex-col gap-2 pt-8 md:mt-12 md:max-w-xl md:flex-row">
        <ShareButton
          text={`${match.teamA} vs ${match.teamB}: jogámos o jogo. Joga o próximo com o teu grupo.`}
          label="Partilhar"
          location="final"
          variant="primary"
        />
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            track("game_restarted", { round: game.rounds.length, from: "final" });
            clearGame(match);
            window.scrollTo({ top: 0 });
          }}
        >
          Novo jogo
        </button>
      </div>
    </main>
  );
}
