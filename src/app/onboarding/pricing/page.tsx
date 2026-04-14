"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function PricingPage() {
  const t = useTranslations("pricing");
  const router = useRouter();
  const [selecting, setSelecting] = useState(false);

  const provisionAndOnboard = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
      .from("clinics")
      .update({ onboarded: true })
      .eq("user_id", user.id);

    try {
      const response = await fetch("/api/provision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      console.log("Assistant provisioned:", data.assistantId);
    } catch (err) {
      console.error("Provisioning failed:", err);
    }
  };

  const handleSelect = async () => {
    setSelecting(true);
    await provisionAndOnboard();

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
      return;
    }

    router.push("/dashboard");
  };

  const handleSkip = async () => {
    setSelecting(true);
    await provisionAndOnboard();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#FFFCF7] flex flex-col px-4 py-12">
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.5s ease forwards; opacity: 0; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
      `}</style>

      <div className="text-center mb-12">
        <span className="font-display font-bold text-lg text-[#1a1a1a] block mb-8">
          Receply
        </span>
        <div className="inline-flex items-center gap-2 bg-[#E8F5E9] text-[#2E7D32] text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 bg-[#2E7D32] rounded-full" />
          {t("badge")}
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-black text-[#1a1a1a] mb-4">
          {t("title")}
        </h1>
        <p className="text-[#666] max-w-md mx-auto">
          {t("subtitle")}
        </p>
      </div>

      <div className="max-w-md mx-auto w-full">
        <div className="fade-up delay-1 rounded-2xl p-8 flex flex-col bg-[#1a1a1a] text-white border-2 border-[#1a1a1a]">
          <h2 className="font-display text-2xl font-black mb-1 text-white">
            {t("planName")}
          </h2>
          <p className="text-sm mb-6 text-[#999]">{t("planDescription")}</p>

          <div className="mb-8">
            <span className="text-4xl font-bold text-white">{t("price")}</span>
            <span className="text-sm ml-1 text-[#999]">
              {" "}{t("currency")}{t("period")}
            </span>
          </div>

          <ul className="space-y-3 mb-8 flex-1">
            {(["minutes", "calls", "dashboard", "recordings", "support"] as const).map((key) => (
              <li key={key} className="flex items-center gap-2.5 text-sm">
                <Check className="h-4 w-4 flex-shrink-0 text-[#E65100]" />
                <span className="text-[#ccc]">{t(`features.${key}`)}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={handleSelect}
            disabled={selecting}
            className="w-full py-3 rounded-full text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer bg-[#E65100] text-white hover:bg-[#bf4000]"
          >
            {selecting ? t("settingUp") : t("cta")}
          </button>
        </div>
      </div>
      <p className="text-center text-sm text-[#999] mt-8">
        {t("freeNote")}
      </p>

      <button
        onClick={handleSkip}
        className="block mx-auto mt-4 text-sm text-[#999] hover:text-[#666] transition-colors underline underline-offset-2 cursor-pointer"
      >
        {t("skip")}
      </button>
    </div>
  );
}
