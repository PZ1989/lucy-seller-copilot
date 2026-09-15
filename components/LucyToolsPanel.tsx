"use client";

import { useState } from "react";

const groups = [
  { title: "Лістинги", icon: "▤", items: ["Створити чернетку", "Мої чорновики", "Покращити лістинг", "Масове створення", "Завантажити фото", "Підготувати чернетку"] },
  { title: "Дослідження", icon: "⌕", items: ["Аналіз конкурентів", "Пошук ключових слів", "Аналіз ніші", "Аналіз магазину", "Тренди ринку"] },
  { title: "SEO", icon: "◎", items: ["SEO-аналіз", "Генератор тайтлів", "Генератор тегів", "Опис товару", "Оптимізація лістингу"] },
  { title: "Аналітика", icon: "▣", items: ["Щоденний звіт", "Тижневий звіт", "Місячний звіт", "Фінансовий звіт"] },
  { title: "Автоматизація", icon: "⚙", items: ["Черга", "Запустити чергу", "Розклад", "Правила автоматизації"] },
  { title: "Інтеграції", icon: "⎇", items: ["Etsy", "Lucy AI", "Telegram"] },
];

export default function LucyToolsPanel() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<Record<string, boolean>>({
    "Лістинги": true,
    "Дослідження": true,
    "SEO": false,
    "Аналітика": false,
    "Автоматизація": false,
    "Інтеграції": false,
  });

  return (
    <aside className="w-[300px] min-h-screen border-l border-[#333333]/8 bg-[#FBFAF8] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#F74E03]">Catalog</div>
          <h2 className="mt-1 text-lg font-semibold text-[#333333]">Функції Люсі</h2>
        </div>
        <button className="grid h-9 w-9 place-items-center rounded-xl text-[#333333]/50 transition hover:bg-white hover:text-[#333333]">
          ⌄
        </button>
      </div>

      <div className="relative mb-5">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#333333]/35">⌕</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Пошук функцій..."
          className="h-10 w-full rounded-xl border border-[#333333]/10 bg-white pl-9 pr-3 text-sm text-[#333333] outline-none placeholder:text-[#333333]/35 focus:border-[#F74E03] focus:ring-4 focus:ring-[#F74E03]/10"
        />
      </div>

      <div className="space-y-3">
        {groups.map((group) => {
          const filtered = group.items.filter((item) => item.toLowerCase().includes(search.toLowerCase()));
          if (filtered.length === 0) return null;

          return (
            <div key={group.title} className="overflow-hidden rounded-2xl border border-[#333333]/8 bg-white">
              <button
                type="button"
                onClick={() => setOpen((prev) => ({ ...prev, [group.title]: !prev[group.title] }))}
                className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-xl bg-[#E7E0DA] text-[#333333]/65">{group.icon}</span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#333333]/60">{group.title}</span>
                </div>
                <span className="text-[#333333]/45">{open[group.title] ? "−" : "+"}</span>
              </button>

              {open[group.title] && (
                <div className="space-y-1 border-t border-[#333333]/8 p-2">
                  {filtered.map((item) => (
                    <button
                      key={item}
                      className="w-full rounded-xl px-3 py-2 text-left text-sm text-[#333333]/75 transition hover:bg-[#F7F4F1] hover:text-[#F74E03]"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button className="mt-6 w-full rounded-2xl border border-[#333333]/10 bg-white py-3 text-sm font-medium text-[#333333] transition hover:border-[#F74E03]/30 hover:text-[#F74E03]">
        Усі функції
      </button>
    </aside>
  );
}
