import { insights } from "./data";
import { Icon } from "./icons";

type InsightsPanelProps = {
  onSelect: (action: string) => void;
};

export function InsightsPanel({ onSelect }: InsightsPanelProps) {
  return (
    <section
      id="ai-insights"
      aria-labelledby="insights-title"
      className="scroll-mt-24 rounded-[26px] border border-charcoal/[0.07] bg-white p-5 sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-terracotta">
            <Icon name="sparkles" size={14} />
            <p className="text-[10px] font-medium uppercase tracking-[0.2em]">AI insights</p>
          </div>
          <h2 id="insights-title" className="mt-1.5 text-xl font-semibold tracking-[-0.035em] text-charcoal">
            Worth your attention
          </h2>
        </div>
        <span className="rounded-full bg-linen/45 px-2.5 py-1 text-[9px] font-medium text-charcoal/45">
          Updated 8 min ago
        </span>
      </div>

      <div className="mt-5 divide-y divide-charcoal/[0.07]">
        {insights.map((insight, index) => (
          <article key={insight.title} className="group flex gap-3 py-4 first:pt-0 last:pb-0 sm:gap-4">
            <span
              className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-[12px] ${
                insight.tone === "terracotta"
                  ? "bg-terracotta/10 text-terracotta"
                  : insight.tone === "mist"
                    ? "bg-mist/25 text-[#52758C]"
                    : "bg-linen/65 text-charcoal/50"
              }`}
            >
              <span className="text-[10px] font-semibold">0{index + 1}</span>
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-charcoal/34">
                {insight.eyebrow}
              </p>
              <h3 className="mt-1.5 text-[13px] font-semibold leading-5 tracking-[-0.015em] text-charcoal">
                {insight.title}
              </h3>
              <p className="mt-1.5 text-[11px] leading-[1.55] text-charcoal/45">{insight.description}</p>
              <button
                type="button"
                onClick={() => onSelect(insight.action)}
                className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-semibold text-charcoal/48 transition hover:text-terracotta"
              >
                {insight.action}
                <Icon name="chevron-right" size={12} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
