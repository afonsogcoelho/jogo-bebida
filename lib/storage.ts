import { useSyncExternalStore } from "react";
import type { GameState, Match, MatchMode } from "@/types/game";
import { isValidGame } from "@/lib/game";
import { getMatchMode } from "@/lib/dates";

// localStorage com fallback em memória (Safari privado antigo, storage cheio, etc.)
const memory = new Map<string, string | null>();
const listeners = new Set<() => void>();

function read(key: string): string | null {
  if (memory.has(key)) return memory.get(key) ?? null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
    memory.delete(key);
  } catch {
    memory.set(key, value);
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

const gameKey = (match: Match) => `jogo:${match.slug}`;
const SETUP_KEY = "jogo:setup";

let cache: { raw: string | null; game: GameState | null } | null = null;

function getGameSnapshot(match: Match): GameState | null {
  const raw = read(gameKey(match));
  if (cache && cache.raw === raw) return cache.game;
  let game: GameState | null = null;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    game = isValidGame(parsed, match) ? parsed : null;
  } catch {
    game = null;
  }
  cache = { raw, game };
  return game;
}

/** undefined = ainda a ler (render de servidor / hidratação); null = não há jogo. */
export function useGame(match: Match): GameState | null | undefined {
  return useSyncExternalStore(
    subscribe,
    () => getGameSnapshot(match),
    () => undefined,
  );
}

export function saveGame(game: GameState) {
  write(`jogo:${game.matchSlug}`, JSON.stringify(game));
}

export function clearGame(match: Match) {
  write(gameKey(match), null);
}

/** Rascunho do setup (nº de jogadores + nomes), para sobreviver a refresh e ao próximo jogo. */
export interface SetupDraft {
  count: number;
  names: string[];
}

export function saveSetupDraft(draft: SetupDraft) {
  write(SETUP_KEY, JSON.stringify(draft));
}

export function readSetupDraft(): SetupDraft | null {
  try {
    const parsed = JSON.parse(read(SETUP_KEY) ?? "null") as Partial<SetupDraft> | null;
    if (!parsed || typeof parsed.count !== "number" || !Array.isArray(parsed.names)) return null;
    return { count: parsed.count, names: parsed.names.map((n) => (typeof n === "string" ? n : "")) };
  } catch {
    return null;
  }
}

// Ronda acabada de sortear nesta sessão: só essa tem animação. Um refresh limpa isto.
let freshDrawRound: number | null = null;
export function markFreshDraw(roundId: number | null) {
  freshDrawRound = roundId;
}
export function isFreshDraw(roundId: number) {
  return freshDrawRound === roundId;
}

// ?modo=pre | jogo | fim força o modo (para testar). Fica guardado na sessão.
const MODE_PARAM: Record<string, MatchMode> = { pre: "pre", jogo: "game", fim: "post" };
const MODE_OVERRIDE_KEY = "jogo:modo";

/** Modo forçado por ?modo= (testes). `?modo=jogo` também desbloqueia todas as rondas. */
export function readModeOverride(): MatchMode | null {
  try {
    const param = new URLSearchParams(window.location.search).get("modo");
    if (param && MODE_PARAM[param]) {
      window.sessionStorage.setItem(MODE_OVERRIDE_KEY, param);
      return MODE_PARAM[param];
    }
    const saved = window.sessionStorage.getItem(MODE_OVERRIDE_KEY);
    return saved ? (MODE_PARAM[saved] ?? null) : null;
  } catch {
    return null;
  }
}

const noopSubscribe = () => () => {};

/** null durante o render de servidor; o modo é sempre calculado no cliente. */
export function useMatchMode(match: Match): MatchMode | null {
  return useSyncExternalStore(
    noopSubscribe,
    () => readModeOverride() ?? getMatchMode(match, Date.now()),
    () => null,
  );
}
