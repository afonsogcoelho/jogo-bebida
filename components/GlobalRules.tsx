import type { GlobalRule } from "@/types/game";
import { timesLabel } from "@/lib/game";

/** Secundário: fechado por defeito, uma linha discreta. O jogo faz-se sem isto. */
export function GlobalRules({ rules }: { rules: GlobalRule[] }) {
  return (
    <details className="rounded-xl text-sm shadow-[inset_0_0_0_1px_var(--color-line)]">
      <summary className="flex min-h-11 cursor-pointer items-center justify-between px-4 text-muted">
        Regras para todos
        <svg className="chevron transition-transform" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <ul className="px-4 pb-2">
        {rules.map((rule) => (
          <li key={rule.text} className="flex items-center justify-between gap-4 border-t border-line py-2">
            <span className="text-ink/85">{rule.text}</span>
            <span className="shrink-0 whitespace-nowrap text-muted">Todos · {timesLabel(rule.times)}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}
