import type { Match, MatchMode } from "@/types/game";

const HALF_TIME_MINUTES = 15;
/** As rondas 2–4 podem ser sorteadas uns minutos antes da hora prevista (o stream pode ir adiantado/atrasado). */
const UNLOCK_MARGIN_MINUTES = 3;
const TIME_ZONE = "Europe/Lisbon";

/** 00:00 (hora de Lisboa) do dia do jogo e do dia seguinte. */
function matchDayBounds(match: Match) {
  const offset = match.kickoff.slice(-6); // "+01:00"
  const start = new Date(`${match.kickoff.slice(0, 10)}T00:00:00${offset}`).getTime();
  return { start, end: start + 24 * 60 * 60 * 1000 };
}

export function getMatchMode(match: Match, now: number): MatchMode {
  const { start, end } = matchDayBounds(match);
  if (now < start) return "pre";
  if (now < end) return "game";
  return "post";
}

/** Hora prevista (epoch ms) do minuto de jogo em que a ronda começa, contando com o intervalo. */
export function roundStartTime(match: Match, startMinute: number) {
  const extra = startMinute >= 46 ? HALF_TIME_MINUTES : 0;
  return new Date(match.kickoff).getTime() + (startMinute + extra) * 60_000;
}

/** A partir de quando a ronda pode ser sorteada (sempre com confirmação manual). */
export function roundUnlockTime(match: Match, startMinute: number) {
  return roundStartTime(match, startMinute) - UNLOCK_MARGIN_MINUTES * 60_000;
}

/** "20:08": só orientação para o grupo. */
export function roundClockTime(match: Match, startMinute: number) {
  return formatTime(roundStartTime(match, startMinute));
}

export function formatTime(t: number | string) {
  return new Intl.DateTimeFormat("pt-PT", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(t));
}

/** "quinta-feira, 1 de outubro" */
export function formatMatchDay(match: Match) {
  return new Intl.DateTimeFormat("pt-PT", {
    timeZone: TIME_ZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(match.kickoff));
}

/** "quinta-feira" */
export function formatWeekday(match: Match) {
  return new Intl.DateTimeFormat("pt-PT", { timeZone: TIME_ZONE, weekday: "long" }).format(
    new Date(match.kickoff),
  );
}

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/** "Qui, 1 out" (feito à mão: o formato curto do ICU varia entre ambientes) */
export function formatShortDay(match: Match) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date(match.kickoff));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const local = new Date(Date.UTC(get("year"), get("month") - 1, get("day")));
  return `${WEEKDAYS[local.getUTCDay()]}, ${get("day")} ${MONTHS[get("month") - 1]}`;
}
