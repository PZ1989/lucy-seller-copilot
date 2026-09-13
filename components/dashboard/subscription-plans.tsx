import { Icon } from "./icons";

type SubscriptionPlansProps = {
  onAction: (action: string) => void;
};

const plans = [
  {
    name: "PRO PLAN",
    price: "$59",
    cadence: "/ місяць",
    shops: "1 магазин",
    description: "Усі інструменти, ChatGPT + Claude, аналітика та базова автоматизація.",
    action: "Керувати планом",
    current: true,
  },
  {
    name: "MULTI STORE",
    price: "$99",
    cadence: "/ місяць",
    shops: "до 5 магазинів",
    description: "Усі інструменти, розширена аналітика, автоматизація та пріоритетна підтримка.",
    action: "Оновити підписку",
    current: false,
  },
];

export function SubscriptionPlans({ onAction }: SubscriptionPlansProps) {
  return (
    <section
      id="subscription"
      aria-labelledby="subscription-title"
      className="scroll-mt-24 rounded-[26px] border border-charcoal/[0.07] bg-white p-5 sm:p-6"
    >
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-terracotta">ПІДПИСКА</p>
          <h2 id="subscription-title" className="mt-1.5 text-xl font-semibold tracking-[-0.035em] text-charcoal">
            План для кожного етапу
          </h2>
        </div>
        <p className="max-w-sm text-[10px] leading-4 text-charcoal/38 sm:text-right">
          Керуйте доступом до інструментів та можливостями плану.
        </p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={`relative overflow-hidden rounded-[20px] border p-5 ${
              plan.current
                ? "border-charcoal/[0.08] bg-[#F7F4F1]"
                : "border-mist/40 bg-mist/[0.09]"
            }`}
          >
            {!plan.current && (
              <span className="absolute -right-10 -top-12 size-32 rounded-full bg-mist/25 blur-2xl" />
            )}
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold tracking-[-0.02em] text-charcoal">{plan.name}</h3>
                  {plan.current && (
                    <span className="rounded-full bg-charcoal px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.1em] text-white">
                      Поточний
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-[30px] font-semibold leading-none tracking-[-0.05em] text-charcoal">
                    {plan.price}
                  </span>
                  <span className="pb-0.5 text-[10px] text-charcoal/40">{plan.cadence}</span>
                </div>
              </div>
              <span
                className={`grid size-9 place-items-center rounded-[12px] ${
                  plan.current ? "bg-linen text-charcoal/55" : "bg-mist/35 text-[#52758C]"
                }`}
              >
                <Icon name={plan.current ? "profile" : "shop"} size={16} />
              </span>
            </div>
            <p className="relative mt-4 flex items-center gap-2 text-[11px] font-semibold text-charcoal/66">
              <span className="grid size-4 place-items-center rounded-full bg-[#ECF7F0] text-[#2D8158]">
                <Icon name="check" size={10} strokeWidth={2.3} />
              </span>
              {plan.shops}
            </p>
            <p className="relative mt-2 text-[10px] leading-4 text-charcoal/40">{plan.description}</p>
            <button
              type="button"
              onClick={() => onAction(plan.action)}
              className={`relative mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-xl text-[10px] font-semibold transition ${
                plan.current
                  ? "border border-charcoal/10 bg-white text-charcoal/62 hover:border-charcoal/20 hover:text-charcoal"
                  : "bg-charcoal text-white hover:bg-[#252525]"
              }`}
            >
              {plan.action}
              <Icon name="arrow-up-right" size={13} />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
