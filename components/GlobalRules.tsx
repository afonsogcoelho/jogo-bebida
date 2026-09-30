import type { GlobalRule } from "@/types/game";
import { timesLabel } from "@/lib/game";

export function GlobalRules({ rules }: { rules: GlobalRule[] }) {
  return (
    <details className="rounded-2xl bg-surface">
      <summary className="flex min-h-14 cursor-pointer items-center justify-between px-5 font-semibold">
        Regras para todos
        <svg className="chevron transition-transform" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <ul className="px-5 pb-4">
        {rules.map((rule) => (
          <li key={rule.text} className="flex items-center justify-between gap-4 border-t border-line py-3">
            <span>{rule.text}</span>
            <span className="shrink-0 text-muted">Todos · {timesLabel(rule.times)}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}
