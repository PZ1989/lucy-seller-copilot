import type { IconName } from "./icons";

export type Stat = {
  label: string;
  value: string;
  delta: string;
  context: string;
  icon: IconName;
  points: string;
};

export type ToolItem = {
  name: string;
  description: string;
  titleKey: string;
  descriptionKey: string;
};

export type ToolGroup = {
  name: string;
  titleKey: string;
  icon: IconName;
  items: ToolItem[];
};

export const shopStats: Stat[] = [
  {
    label: "Revenue",
    value: "$8.5K",
    delta: "+14%",
    context: "vs last month",
    icon: "wallet",
    points: "0,10 20,8 40,12 58,7 72,5",
  },
  {
    label: "Orders",
    value: "312",
    delta: "+9%",
    context: "in the last 30 days",
    icon: "chart",
    points: "0,12 18,10 36,14 54,9 72,7",
  },
  {
    label: "Views",
    value: "24.6K",
    delta: "+18%",
    context: "store reach",
    icon: "eye",
    points: "0,15 20,11 40,8 58,5 72,2",
  },
  {
    label: "Conversion",
    value: "3.8%",
    delta: "+0.6%",
    context: "improvement",
    icon: "sparkles",
    points: "0,8 16,7 32,9 50,6 72,4",
  },
];

export const quickTools: Array<{
  title: string;
  description: string;
  icon: IconName;
  badge: string;
}> = [
  { title: "Створити чернетку лістингу", description: "Підготувати нову чернетку для Etsy", icon: "plus", badge: "New" },
  { title: "Аналіз конкурентів", description: "Порівняння ринку та цін", icon: "search", badge: "Live" },
  { title: "Покращити SEO", description: "Тайтли, теги та описи", icon: "sparkles", badge: "Top" },
  { title: "Звіт за тиждень", description: "Коротка сводка показників", icon: "chart", badge: "AI" },
  { title: "Автоматизація", description: "Правила, черги та розклад", icon: "bolt", badge: "Fast" },
  { title: "Оновити лістинг", description: "Підлаштування під попит", icon: "refresh", badge: "Smart" },
];

export const insights = [
  {
    eyebrow: "Можливість",
    title: "Різниця в конверсії найсильніша у вашій найкращій ніші.",
    description: "Ваші ключові варіації нижчі за бенчмарк. Оновіть перше фото та скорегуйте структуру заголовка.",
    action: "Покращити лістинг",
    tone: "terracotta",
  },
  {
    eyebrow: "Тренд",
    title: "Попит на мінімалістичний декор зростає.",
    description: "У вас є кілька схожих товарів, які недооцінені. Це хороший момент для розширення продажів.",
    action: "Дослідити ключові слова",
    tone: "mist",
  },
  {
    eyebrow: "Звіт",
    title: "Три лістинги витрачають час без достатньої віддачі.",
    description: "Lucy може запропонувати більш прибуткове редизайн або рекомендацію з архівування.",
    action: "Перевірити лістинги",
    tone: "linen",
  },
];

export const accountStatuses = [
  { name: "Etsy", monogram: "E", status: "Підключено", tone: "success" },
  { name: "Lucy AI", monogram: "L", status: "У тарифі", tone: "success" },
  { name: "Telegram", monogram: "T", status: "Потрібне оновлення", tone: "warning" },
];

export const toolGroups: ToolGroup[] = [
  {
    name: "Лістинги",
    titleKey: "tool.group.listings",
    icon: "shop",
    items: [
      { name: "Створити чернетку", description: "Створити чернетку товару з ключовими словами", titleKey: "tool.listing.create", descriptionKey: "tool.listing.createDesc" },
      { name: "Мої чернетки", description: "Переглянути збережені товари", titleKey: "tool.listing.drafts", descriptionKey: "tool.listing.draftsDesc" },
      { name: "Редагувати чернетку", description: "SEO та візуальне оновлення чернетки", titleKey: "tool.listing.update", descriptionKey: "tool.listing.updateDesc" },
      { name: "Масове створення", description: "Створити кілька товарів одночасно", titleKey: "tool.listing.bulk", descriptionKey: "tool.listing.bulkDesc" },
      { name: "Завантажити фото", description: "Перевірити та оптимізувати медіа", titleKey: "tool.listing.upload", descriptionKey: "tool.listing.uploadDesc" },
      { name: "Підготувати чернетку", description: "Підготувати чернетку лістингу до фінальної перевірки", titleKey: "tool.listing.prepareDraft", descriptionKey: "tool.listing.prepareDraftDesc" },
    ],
  },
  {
    name: "Дослідження",
    titleKey: "tool.group.research",
    icon: "search",
    items: [
      { name: "Аналіз конкурентів", description: "Відслідковувати цінові та лістинг-патерни", titleKey: "tool.research.competitors", descriptionKey: "tool.research.competitorsDesc" },
      { name: "Пошук ключових слів", description: "Знайти сильніші пошукові фрази", titleKey: "tool.research.keywords", descriptionKey: "tool.research.keywordsDesc" },
      { name: "Аналіз ніші", description: "Знайти менш заповнені сегменти", titleKey: "tool.research.niche", descriptionKey: "tool.research.nicheDesc" },
    ],
  },
  {
    name: "SEO",
    titleKey: "tool.group.seo",
    icon: "sparkles",
    items: [
      { name: "SEO-аналіз", description: "Перевірити title та теги", titleKey: "tool.seo.analysis", descriptionKey: "tool.seo.analysisDesc" },
      { name: "Генератор заголовків", description: "Складати чіткі та сильні заголовки", titleKey: "tool.seo.titles", descriptionKey: "tool.seo.titlesDesc" },
      { name: "Генератор описів", description: "Покращити опис товару", titleKey: "tool.seo.descriptions", descriptionKey: "tool.seo.descriptionsDesc" },
    ],
  },
  {
    name: "Аналітика",
    titleKey: "tool.group.analytics",
    icon: "chart",
    items: [
      { name: "Щоденний звіт", description: "Головні зміни за день", titleKey: "tool.analytics.daily", descriptionKey: "tool.analytics.dailyDesc" },
      { name: "Тижневий звіт", description: "Підсумок ефективності", titleKey: "tool.analytics.weekly", descriptionKey: "tool.analytics.weeklyDesc" },
      { name: "Звіт з доходу", description: "Порівняння трендів і прибутку", titleKey: "tool.analytics.revenue", descriptionKey: "tool.analytics.revenueDesc" },
    ],
  },
  {
    name: "Автоматизація",
    titleKey: "tool.group.automation",
    icon: "bolt",
    items: [
      { name: "Черга", description: "Автоматизувати задачі продукту", titleKey: "tool.automation.queue", descriptionKey: "tool.automation.queueDesc" },
      { name: "Правила", description: "Встановити логіку робочого процесу", titleKey: "tool.automation.rules", descriptionKey: "tool.automation.rulesDesc" },
      { name: "Розклад", description: "Запланувати запуск дій", titleKey: "tool.automation.schedule", descriptionKey: "tool.automation.scheduleDesc" },
    ],
  },
  {
    name: "Інтеграції",
    titleKey: "tool.group.integrations",
    icon: "link",
    items: [
      { name: "Etsy", description: "Статус підключеного магазину", titleKey: "tool.integrations.etsy", descriptionKey: "tool.integrations.etsyDesc" },
      { name: "Lucy AI", description: "AI входить до тарифу Lucy", titleKey: "tool.integrations.lucyAi", descriptionKey: "tool.integrations.lucyAiDesc" },
      { name: "Telegram", description: "Сповіщення та оновлення", titleKey: "tool.integrations.telegram", descriptionKey: "tool.integrations.telegramDesc" },
    ],
  },
];
