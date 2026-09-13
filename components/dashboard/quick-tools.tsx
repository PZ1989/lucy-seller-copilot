import { quickTools } from "./data";
import { Icon } from "./icons";

type QuickToolsProps = {
  onToolSelect: (tool: string) => void;
  onViewAll: () => void;
};

export function QuickTools({ onToolSelect, onViewAll }: QuickToolsProps) {
  return (
    <section
      id="quick-tools"
      aria-labelledby="quick-tools-title"
      className="scroll-mt-24 rounded-[26px] border border-charcoal/[0.07] bg-white p-5 sm:p-6"
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-terracotta">
            Start here
          </p>
          <h2
            id="quick-tools-title"
            className="mt-1.5 text-xl font-semibold tracking-[-0.035em] text-charcoal"
          >
            Quick tools
          </h2>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className="group flex items-center gap-1.5 text-[11px] font-semibold text-charcoal/48 transition hover:text-terracotta"
        >
          View all
          <Icon name="arrow-up-right" size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </button>
      </div>

      <div className="mt-5 grid gap-2.5 sm:grid-cols-2 2xl:grid-cols-3">
        {quickTools.map((tool, index) => (
          <button
            key={tool.title}
            type="button"
            onClick={() => onToolSelect(tool.title)}
            className={`group flex min-h-[112px] items-start gap-3 rounded-[18px] border p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-terracotta/25 hover:shadow-[0_12px_30px_rgba(51,51,51,0.06)] ${
              index === 0 ? "border-terracotta/10 bg-terracotta/[0.045]" : "border-charcoal/[0.07] bg-white"
            }`}
          >
            <span
              className={`grid size-10 shrink-0 place-items-center rounded-[13px] transition ${
                index === 0
                  ? "bg-terracotta text-white"
                  : "bg-linen/55 text-charcoal/55 group-hover:bg-terracotta/10 group-hover:text-terracotta"
              }`}
            >
              <Icon name={tool.icon} size={17} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="text-[13px] font-semibold tracking-[-0.015em] text-charcoal">
                  {tool.title}
                </span>
                {tool.badge && (
                  <span className="rounded-full bg-terracotta/10 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.1em] text-terracotta">
                    {tool.badge}
                  </span>
                )}
              </span>
              <span className="mt-1.5 block text-[11px] leading-[1.55] text-charcoal/45">
                {tool.description}
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
