"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Match } from "@/types/game";
import { clearGame, useGame, useMatchMode } from "@/lib/storage";
import { totalChallenges } from "@/lib/game";
import { formatWeekday } from "@/lib/dates";
import { track } from "@/lib/analytics";
import { ShareButton } from "@/components/ShareButton";
import { ChallengePreview } from "@/components/ChallengePreview";

export function LandingActions({ match }: { match: Match }) {
  const mode = useMatchMode(match);
  const game = useGame(match);
  const router = useRouter();

  // Render de servidor: reserva espaço para não haver salto de layout.
  if (mode === null || game === undefined) return <div className="min-h-64 md:min-h-40" aria-hidden="true" />;

  const shareText = `${match.teamA} vs ${match.teamB}, ${formatWeekday(match)}. Cada um recebe um desafio e um evento raro por ronda. Quando acontecer, bebe o número indicado.`;
  const inProgress = game && !game.finished;
  const startLabel = mode === "pre" ? "Criar jogo" : mode === "post" ? "Jogar mesmo assim" : "Começar";

  return (
    <>
      {mode === "pre" ? (
        <>
          {/* Mobile: preview dos desafios da R1 (no desktop está na coluna da direita) */}
          <div className="md:hidden">
            <ChallengePreview match={match} />
          </div>
          <p className="hidden text-lg text-muted md:block">
            Cria já o jogo e vê os desafios da Ronda 1. As outras rondas abrem durante o jogo.
          </p>
        </>
      ) : (
        !inProgress && (
          <dl className="rise grid grid-cols-3 gap-2 border-y border-line py-5 text-center md:max-w-md md:text-left">
            {[
              [match.rounds.length, "rondas"],
              [totalChallenges(match), "desafios"],
              ["2–8", "jogadores"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="font-display text-4xl leading-none font-bold">{value}</dd>
                <dd className="mt-1 text-sm text-muted">{label}</dd>
              </div>
            ))}
          </dl>
        )
      )}
      {mode === "post" && !inProgress && (
        <p className="rise mt-5 text-muted">Este jogo já acabou. Ainda dá para jogar a repetição.</p>
      )}

      <div className="action-bar mt-auto flex flex-col gap-2 md:mt-8 md:max-w-sm">
        {inProgress ? (
          <>
            <Link
              href="/jogo"
              className="btn btn-primary"
              onClick={() => track("game_resumed", { round: game.rounds.length })}
            >
              Continuar · Ronda {game.rounds.length}
            </Link>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                if (!confirm("Começar um jogo novo? Os desafios sorteados perdem-se.")) return;
                track("game_restarted", { round: game.rounds.length, from: "landing" });
                clearGame(match);
                router.push("/jogo");
              }}
            >
              Novo jogo
            </button>
          </>
        ) : (
          <>
            <Link
              href="/jogo"
              className="btn btn-primary"
              onClick={() => {
                track("play_clicked", { mode });
                if (game?.finished) clearGame(match);
              }}
            >
              {startLabel}
            </Link>
            <ShareButton text={shareText} label="Partilhar com o grupo" location="landing" variant="ghost" />
          </>
        )}
      </div>
    </>
  );
}
