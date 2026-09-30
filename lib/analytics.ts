type EventProps = Record<string, string | number | boolean | null>;

// Visitas: Cloudflare Web Analytics (ativar no dashboard do projeto Pages, sem código).
// Eventos: ainda sem ferramenta ligada. As chamadas ficam no código; para ligar
// PostHog/Plausible/etc. basta implementar esta função.
export type AnalyticsEvent =
  | "play_clicked"
  | "game_started"
  | "game_resumed"
  | "round_opened"
  | "game_finished"
  | "game_restarted"
  | "share_clicked";

export function track(event: AnalyticsEvent, props?: EventProps) {
  if (process.env.NODE_ENV === "development") console.debug("[track]", event, props ?? {});
}
