import Image from "next/image";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex w-full items-center px-1 ${compact ? "justify-center" : ""}`}>
      <Image
        src="/brand/lucy-logo.png"
        alt="Lucy Seller Copilot logo"
        width={165}
        height={67}
        className={compact ? "h-auto w-[90%] object-contain" : "h-auto w-[90%] object-contain"}
      />
    </div>
  );
}
