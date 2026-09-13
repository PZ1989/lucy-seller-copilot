import { shopStats, type Stat } from "./data";
import { Icon } from "./icons";

function StatCard({ stat, featured = false }: { stat: Stat; featured?: boolean }) {
  return (
    <article
      className={`group relative overflow-hidden rounded-[22px] border p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(51,51,51,0.08)] ${
        featured
          ? "border-terracotta/10 bg-terracotta text-white"
          : "border-charcoal/[0.07] bg-white text-charcoal"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <p
          className={`text-[10px] font-medium uppercase tracking-[0.16em] ${
            featured ? "text-white/62" : "text-charcoal/42"
          }`}
        >
          {stat.label}
        </p>
        <span
          className={`grid size-8 place-items-center rounded-[11px] ${
            featured ? "bg-white/13 text-white" : "bg-linen/55 text-charcoal/55"
          }`}
        >
          <Icon name={stat.icon} size={15} />
        </span>
      </div>

      <div className="mt-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-[30px] font-semibold leading-none tracking-[-0.045em]">{stat.value}</p>
          <div className="mt-3 flex items-center gap-1.5 text-[10px]">
            <span
              className={`rounded-full px-2 py-1 font-semibold ${
                featured ? "bg-white/15 text-white" : "bg-[#ECF7F0] text-[#2D8158]"
              }`}
            >
              {stat.delta}
            </span>
            <span className={featured ? "text-white/55" : "text-charcoal/38"}>{stat.context}</span>
          </div>
        </div>

        <svg
          viewBox="0 0 72 26"
          className={`h-8 w-[72px] overflow-visible ${featured ? "text-white/75" : "text-terracotta/70"}`}
          role="img"
          aria-label={`${stat.label} trend is increasing`}
        >
          <polyline
            points={stat.points}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="70" cy={stat.points.endsWith(",2") ? "2" : "7"} r="2.5" fill="currentColor" />
        </svg>
      </div>
    </article>
  );
}

export function StatsGrid() {
  return (
    <section id="shop-performance" aria-labelledby="stats-title" className="scroll-mt-24">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-terracotta">Overview</p>
          <h2 id="stats-title" className="mt-1.5 text-xl font-semibold tracking-[-0.035em] text-charcoal">
            Shop performance
          </h2>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-charcoal/42">
          <span className="size-1.5 rounded-full bg-[#55A97C]" />
          Last 30 days
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
        {shopStats.map((stat, index) => (
          <StatCard key={stat.label} stat={stat} featured={index === 3} />
        ))}
      </div>
    </section>
  );
}
