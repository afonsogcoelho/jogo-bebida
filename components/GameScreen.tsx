"use client";

import { useEffect, useState } from "react";
import type { GameState, Match } from "@/types/game";
import { findChallenge, findRareEvent, finishGame, openNextRound, roundPool, timesLabel } from "@/lib/game";
import { formatShortDay, getMatchMode, roundClockTime, roundUnlockTime } from "@/lib/dates";
import { clearGame, isFreshDraw, markFreshDraw, readModeOverride, saveGame } from "@/lib/storage";
import { track } from "@/lib/analytics";
import { DrawReveal, type PlayerResult } from "@/components/DrawReveal";
import { GlobalRules } from "@/components/GlobalRules";
import { ConfirmSheet } from "@/components/ConfirmSheet";
import { ShareButton } from "@/components/ShareButton";

export function GameScreen({ match, game }: { match: Match; game: GameState }) {
  const currentIndex = game.rounds.length - 1;
  const [viewIndex, setViewIndex] = useState<number | null>(null);
  const [confirming, setConfirming] = useState(false);
  // Ronda cujo sorteio está a ser animado agora (só a que acabou de ser sorteada nesta sessão).
  const [animating, setAnimating] = useState<number | null>(() =>
    isFreshDraw(game.rounds[currentIndex].roundId) ? game.rounds[currentIndex].roundId : null,
  );

  const index = viewIndex ?? currentIndex;
  const isPast = index !== currentIndex;
  const assignment = game.rounds[index];
  const round = match.rounds[index];
  const nextRound = match.rounds[currentIndex + 1];
  const isAnimating = !isPast && animating === assignment.roundId;

  // A próxima ronda só pode ser sorteada perto da hora certa do jogo (sempre com confirmação manual).
  // ?modo=jogo desbloqueia tudo para testes.
  const [forceUnlocked] = useState(() => readModeOverride() === "game");
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 15_000);
    return () => window.clearInterval(id);
  }, []);
  const nextUnlocked =
    !nextRound || forceUnlocked || now >= roundUnlockTime(match, nextRound.startMinute);

  const results: Record<string, PlayerResult> = {};
  for (const p of game.players) {
    const pick = assignment.picks[p.id];
    const main = findChallenge(match, pick?.mainChallengeId);
    const rare = findRareEvent(match, pick?.rareEventId);
    if (main && rare) results[p.id] = { main, rare };
  }

  function stopAnimation() {
    setAnimating(null);
    markFreshDraw(null);
  }

  function confirmNext() {
    setConfirming(false);
    if (!nextUnlocked) return;
    setViewIndex(null);
    if (nextRound) {
      markFreshDraw(nextRound.id);
      setAnimating(nextRound.id);
      saveGame(openNextRound(game, match));
      track("round_opened", { round: nextRound.id });
    } else {
      saveGame(finishGame(game));
      track("game_finished");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function restart() {
    if (!confirm("Recomeçar? Os desafios sorteados perdem-se.")) return;
    track("game_restarted", { round: currentIndex + 1, from: "game" });
    clearGame(match);
  }

  const shareText = [
    `Ronda ${round.id} · ${round.label} · ${match.teamA} vs ${match.teamB}`,
    "",
    ...game.players.map((p) => {
      const r = results[p.id];
      return r
        ? `${p.name}: ${r.main.text} (${timesLabel(r.main.times)}) · Raro: ${r.rare.text} (${timesLabel(r.rare.times)})`
        : p.name;
    }),
    "",
    "Joga também:",
  ].join("\n");

  return (
    <main className="flex flex-1 flex-col md:grid md:grid-cols-[280px_1fr] md:grid-rows-[auto_auto_1fr] md:gap-x-14 md:pt-10 md:pb-16 md:[grid-template-areas:'head_list'_'actions_list'_'extras_list'] lg:grid-cols-[380px_1fr]">
      {/* Cabeçalho da ronda */}
      <div className="md:[grid-area:head]">
        <div className="flex items-center justify-between pt-4 md:pt-0">
          <span className="text-sm text-muted">
            {match.teamA} vs {match.teamB}
          </span>
          <button type="button" onClick={restart} className="-mr-2 h-11 px-2 text-sm text-muted hover:text-ink">
            Recomeçar
          </button>
        </div>

        <nav aria-label="Rondas" className="mt-1 grid grid-cols-4 gap-1.5 md:mt-4">
          {match.rounds.map((r, i) => {
            const opened = i <= currentIndex;
            return (
              <button
                key={r.id}
                type="button"
                disabled={!opened || isAnimating}
                onClick={() => setViewIndex(i === currentIndex ? null : i)}
                aria-current={i === index ? "step" : undefined}
                aria-label={opened ? `Ver ronda ${r.id}` : `Ronda ${r.id} por sortear`}
                className="flex flex-col gap-2 pt-2 text-left disabled:cursor-default"
              >
                <span className={`h-1 rounded-full ${i === index ? "bg-ink" : opened ? "bg-pitch" : "bg-line"}`} />
                <span className={`text-xs font-medium ${i === index ? "text-ink" : "text-muted"}`}>
                  {opened ? `R${r.id}` : `R${r.id} · ${r.startMinute}'`}
                </span>
              </button>
            );
          })}
        </nav>

        <header className="mt-4 flex items-baseline gap-2 md:mt-10 md:block">
          <h1 className="font-display text-[2.25rem] leading-none font-bold uppercase md:text-[5rem] md:leading-[0.85]">
            Ronda {round.id}
          </h1>
          <span className="font-display text-[1.625rem] leading-none font-semibold text-muted md:mt-2 md:block md:text-3xl">
            <span className="md:hidden">· </span>
            {round.label}
          </span>
        </header>
        <p className="mt-1 text-sm text-muted md:mt-3 md:text-base" aria-live="polite">
          {isAnimating ? "A sortear…" : isPast ? "Ronda terminada · já não conta." : "Só contam neste intervalo."}
        </p>
      </div>

      {/* Desafios dos jogadores */}
      <div className="mt-3 md:mt-0 md:pt-2 md:[grid-area:list]">
        <DrawReveal
          key={assignment.roundId}
          players={game.players}
          results={results}
          pool={game.players.length <= round.challenges.length ? round.challenges : roundPool(round)}
          animate={isAnimating}
          onDone={stopAnimation}
        />
      </div>

      {/* Partilha + regras */}
      <div
        className={`mt-3 flex flex-col gap-1.5 transition-opacity duration-300 md:mt-6 md:gap-3 md:[grid-area:extras] ${
          isAnimating ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <ShareButton text={shareText} label="Enviar ronda ao grupo" location="game" kind="round" variant="ghost" compact />
        <GlobalRules rules={match.globalRules} />
      </div>

      {/* Ação principal */}
      <div className="action-bar mt-auto pt-5 md:mt-8 md:[grid-area:actions]">
        {isAnimating ? (
          <button type="button" className="btn btn-ghost" onClick={stopAnimation}>
            Saltar
          </button>
        ) : isPast ? (
          <button type="button" className="btn btn-secondary" onClick={() => setViewIndex(null)}>
            Voltar à Ronda {currentIndex + 1}
          </button>
        ) : nextRound ? (
          <>
            <p className="mb-2 text-center text-[13px] leading-snug text-muted md:text-left md:text-sm">
              <span className="font-semibold text-ink uppercase">
                Ronda {nextRound.id} · {nextRound.label}
              </span>
              <br />
              Disponível por volta dos {nextRound.startMinute}&apos; · ~
              {getMatchMode(match, now) === "pre" ? `${formatShortDay(match).split(",")[0]} ` : ""}
              {roundClockTime(match, nextRound.startMinute)}
            </p>
            <button
              type="button"
              className={`btn ${nextUnlocked ? "btn-primary" : "btn-secondary"}`}
              disabled={!nextUnlocked}
              onClick={() => setConfirming(true)}
            >
              {nextUnlocked ? `Sortear Ronda ${nextRound.id}` : `Ronda ${nextRound.id} ainda fechada`}
            </button>
          </>
        ) : (
          <button type="button" className="btn btn-primary" onClick={() => setConfirming(true)}>
            Apito final
          </button>
        )}
      </div>

      {confirming &&
        (nextRound ? (
          <ConfirmSheet
            title={`Já vão nos ${nextRound.startMinute}'?`}
            body={`Os desafios da Ronda ${round.id} deixam de contar. Cada um recebe um desafio e um evento raro novos para ${nextRound.label}. Não dá para voltar atrás.`}
            confirmLabel={`Sortear Ronda ${nextRound.id}`}
            onConfirm={confirmNext}
            onCancel={() => setConfirming(false)}
          />
        ) : (
          <ConfirmSheet
            title="Acabou o jogo?"
            body="Fecha a última ronda e mostra o resumo."
            confirmLabel="Apito final"
            onConfirm={confirmNext}
            onCancel={() => setConfirming(false)}
          />
        ))}
    </main>
  );
}
