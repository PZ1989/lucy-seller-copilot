import { accountStatuses } from "./data";
import { Icon } from "./icons";

type HeroCardProps = {
  onChat: () => void;
  onConnections: () => void;
};

export function HeroCard({ onChat, onConnections }: HeroCardProps) {
  return (
    <section
      id="dashboard-overview"
      aria-labelledby="welcome-title"
      className="scroll-mt-24 overflow-hidden rounded-[28px] border border-charcoal/[0.08] bg-white shadow-[0_18px_60px_rgba(51,51,51,0.07)]"
    >
      <div className="grid lg:grid-cols-[minmax(0,1fr)_290px]">
        <div className="relative overflow-hidden bg-charcoal px-6 py-7 text-white sm:px-8 sm:py-9">
          <div className="pointer-events-none absolute -right-14 -top-24 size-72 rounded-full border border-white/[0.06]" />
          <div className="pointer-events-none absolute -right-3 -top-12 size-48 rounded-full border border-terracotta/30" />
          <div className="pointer-events-none absolute -bottom-24 left-[38%] size-64 rounded-full bg-mist/[0.07] blur-2xl" />

          <div className="relative grid items-center gap-7 md:grid-cols-[minmax(0,1fr)_190px]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-white/65">
                  <span className="size-1.5 rounded-full bg-[#79C99E] shadow-[0_0_0_4px_rgba(121,201,158,0.12)]" />
                  Lucy is online
                </span>
                <span className="text-[11px] text-white/35">Wednesday, 26 August</span>
              </div>

              <h1
                id="welcome-title"
                className="mt-6 max-w-xl text-[clamp(2rem,4vw,3.5rem)] font-medium leading-[1.02] tracking-[-0.055em]"
              >
                Good morning,
                <span className="block text-linen">Natalia.</span>
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-6 text-white/58">
                Your shop is moving in the right direction. I found three focused opportunities
                worth your attention today.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onChat}
                  className="group inline-flex h-11 items-center gap-2 rounded-[14px] bg-terracotta px-4 text-xs font-semibold text-white shadow-[0_10px_30px_rgba(247,78,3,0.25)] transition hover:-translate-y-0.5 hover:bg-[#E94702]"
                >
                  Chat with Lucy
                  <Icon
                    name="arrow-up-right"
                    size={15}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </button>
                <button
                  type="button"
                  onClick={() => document.getElementById("ai-insights")?.scrollIntoView({ behavior: "smooth" })}
                  className="h-11 rounded-[14px] border border-white/12 px-4 text-xs font-medium text-white/68 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                >
                  View daily brief
                </button>
              </div>
            </div>

            <div className="relative hidden h-[210px] items-center justify-center md:flex">
              <span className="absolute size-44 rounded-full border border-white/[0.08]" />
              <span className="absolute size-36 rounded-full border border-dashed border-mist/20" />
              <span className="absolute left-3 top-8 grid size-8 place-items-center rounded-xl bg-white/[0.07] text-linen backdrop-blur-sm">
                <Icon name="sparkles" size={15} />
              </span>
              <span className="absolute bottom-7 right-0 size-3 rounded-full bg-terracotta shadow-[0_0_0_7px_rgba(247,78,3,0.1)]" />
              <div className="relative grid size-28 place-items-center rounded-full bg-[linear-gradient(145deg,#E7E0DA_0%,#AAC1D1_100%)] shadow-[0_24px_60px_rgba(0,0,0,0.25)]">
                <span className="text-[42px] font-semibold tracking-[-0.09em] text-charcoal">L</span>
                <span className="absolute right-1 top-2 grid size-7 place-items-center rounded-full border-4 border-charcoal bg-terracotta text-white">
                  <Icon name="sparkles" size={11} strokeWidth={2.2} />
                </span>
              </div>
              <div className="absolute bottom-1 left-1/2 w-[168px] -translate-x-1/2 rounded-2xl border border-white/10 bg-white/[0.075] px-3 py-2.5 text-center backdrop-blur-md">
                <p className="text-[10px] font-medium text-white/72">Your AI shop partner</p>
                <p className="mt-0.5 text-[9px] text-white/35">Working with mock data</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-charcoal/40">
                Connected accounts
              </p>
              <p className="mt-2 text-sm font-semibold tracking-[-0.02em] text-charcoal">
                Your workspace
              </p>
            </div>
            <span className="rounded-full bg-[#ECF7F0] px-2.5 py-1 text-[9px] font-semibold text-[#2D8158]">
              3 active
            </span>
          </div>

          <div className="mt-5 space-y-2">
            {accountStatuses.map((account) => (
              <div
                key={account.name}
                className="flex items-center gap-3 rounded-[14px] border border-charcoal/[0.07] px-3 py-2.5"
              >
                <span
                  className={`grid size-8 shrink-0 place-items-center rounded-[10px] text-[11px] font-semibold ${
                    account.name === "Etsy"
                      ? "bg-terracotta/10 text-terracotta"
                      : account.name === "Telegram"
                        ? "bg-mist/25 text-[#52758C]"
                        : "bg-charcoal/[0.06] text-charcoal/65"
                  }`}
                >
                  {account.monogram}
                </span>
                <span className="min-w-0 flex-1 text-xs font-medium text-charcoal">
                  {account.name}
                </span>
                <span
                  className={`flex items-center gap-1.5 text-[9px] font-medium ${
                    account.tone === "success" ? "text-[#2D8158]" : "text-terracotta"
                  }`}
                >
                  <span
                    className={`size-1.5 rounded-full ${
                      account.tone === "success" ? "bg-[#55A97C]" : "bg-terracotta"
                    }`}
                  />
                  {account.status}
                </span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onConnections}
            className="mt-4 flex w-full items-center justify-between rounded-xl px-1 py-1 text-[10px] font-semibold text-charcoal/48 transition hover:text-terracotta"
          >
            Manage connections
            <Icon name="chevron-right" size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
