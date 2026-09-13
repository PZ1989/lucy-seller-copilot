import {
  ArrowUpRight, BarChart3, Bot, Check, ChevronLeft, ChevronRight, CircleUserRound,
  CreditCard, Eye, FileBarChart, Home, Link as LinkIcon, MessageCircle, Plug, Plus,
  RefreshCw, Search, Send, Settings, ShieldCheck, Sparkles, Store, Tag, Wallet, X, CircleHelp, Menu,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type IconName =
  | "arrow-up-right"
  | "analytics"
  | "bot"
  | "chart"
  | "bolt"
  | "check"
  | "chevron-left"
  | "chevron-right"
  | "close"
  | "credit-card"
  | "eye"
  | "file-chart"
  | "link"
  | "home"
  | "message"
  | "menu"
  | "plus"
  | "plug"
  | "profile"
  | "refresh"
  | "search"
  | "send"
  | "settings"
  | "shield-check"
  | "shop"
  | "sparkles"
  | "tag"
  | "wallet";

type IconProps = {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
};

const iconMap: Record<IconName, LucideIcon> = {
  "arrow-up-right": ArrowUpRight, analytics: BarChart3, bot: Bot, bolt: Bot, chart: BarChart3,
  check: Check, "chevron-left": ChevronLeft, "chevron-right": ChevronRight, close: X,
  "credit-card": CreditCard, eye: Eye, "file-chart": FileBarChart, home: Home,
  link: LinkIcon, menu: Menu, message: MessageCircle, plug: Plug, plus: Plus, profile: CircleUserRound,
  refresh: RefreshCw, search: Search, send: Send, settings: Settings, "shield-check": ShieldCheck, shop: Store,
  sparkles: Sparkles, tag: Tag, wallet: Wallet,
};

export function Icon({ name, size, strokeWidth, className }: IconProps) {
  const Component = iconMap[name] ?? CircleHelp;
  return <Component size={size ?? 16} strokeWidth={strokeWidth ?? 1.8} className={className} aria-hidden="true" />;
}
