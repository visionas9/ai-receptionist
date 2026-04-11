"use client";

import { useLocale } from "next-intl";

export default function LanguageSwitcher() {
  const locale = useLocale();

  const switchLocale = (newLocale: string) => {
    if (newLocale === locale) return;
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000;SameSite=Lax`;
    localStorage.setItem("locale", newLocale);
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-1 bg-[#f8f4ee] border border-[#f0ebe0] rounded-full p-1">
      <button
        onClick={() => switchLocale("pl")}
        className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full transition-all ${
          locale === "pl"
            ? "bg-[#1a1a1a] text-white cursor-pointer"
            : "text-[#666] hover:text-[#1a1a1a] cursor-pointer"
        }`}
      >
        🇵🇱 PL
      </button>
      <button
        onClick={() => switchLocale("en")}
        className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full transition-all ${
          locale === "en"
            ? "bg-[#1a1a1a] text-white cursor-pointer"
            : "text-[#666] hover:text-[#1a1a1a] cursor-pointer"
        }`}
      >
        🇬🇧 EN
      </button>
    </div>
  );
}
