"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n";

type PreviewSize = "small" | "medium" | "large";

type LucyEmptyPreviewProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  size?: PreviewSize;
};

const sizeClasses: Record<PreviewSize, { panel: string; image: string; title: string }> = {
  small: { panel: "min-h-[180px] p-4", image: "h-28 w-28", title: "text-[14px]" },
  medium: { panel: "min-h-[280px] p-5", image: "h-48 w-48", title: "text-[16px]" },
  large: { panel: "min-h-[420px] p-6", image: "h-[300px] w-[300px]", title: "text-[18px]" },
};

export function LucyEmptyPreview({ title, description, actionLabel, onAction, size = "medium" }: LucyEmptyPreviewProps) {
  const { t } = useI18n();
  const styles = sizeClasses[size];

  return (
    <div className={`flex flex-col items-center justify-center overflow-hidden rounded-[16px] border border-[#E7E0DA] bg-[#FFF8F3] text-center ${styles.panel}`}>
      <div className="relative flex items-center justify-center">
        <div className="absolute h-[72%] w-[72%] rounded-full bg-[#F74E03]/10 blur-2xl" />
        <Image src="/lucy/lucy-updated.png" alt="Lucy" width={420} height={420} className={`relative z-10 object-contain drop-shadow-[0_18px_28px_rgba(247,78,3,0.16)] ${styles.image}`} />
      </div>
      <h3 className={`mt-2 font-semibold text-[#333333] ${styles.title}`}>{title ?? t("preview.empty.title")}</h3>
      <p className="mt-2 max-w-[360px] text-[13px] leading-5 text-[#333333]/55">{description ?? t("preview.empty.description")}</p>
      {actionLabel && onAction && <button type="button" onClick={onAction} className="mt-4 rounded-[10px] bg-[#F74E03] px-3 py-2 text-[13px] font-semibold text-white">{actionLabel}</button>}
    </div>
  );
}
