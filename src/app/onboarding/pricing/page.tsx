"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useTranslations } from "next-intl";

type PlanKey = "starter" | "growth" | "pro";

const planKeys: { key: PlanKey; price: string; highlight: boolean; featureCount: number }[] = [
  { key: "starter", price: "29", highlight: false, featureCount: 4 },
  { key: "growth", price: "79", highlight: true, featureCount: 6 },
  { key: "pro", price: "149", highlight: false, featureCount: 6 },
];

// Maps translation key → Stripe planName expected by /api/stripe/checkout
const planNameMap: Record<PlanKey, string> = {
  starter: "Starter",
  growth: "Growth",
  pro: "Pro",
};

export default function PricingPage() {
  const t = useTranslations("pricing");
  const router = useRouter();
  const [selecting, setSelecting] = useState<string | null>(null);

  const provisionVapi = async (userId: string) => {
    try {
      await fetch("/api/provision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
    } catch (err) {
      console.error("Provisioning failed:", err);
    }
  };

  // "Skip for now" — provision + go straight to dashboard
  const handleSkip = async () => {
    setSelecting("free");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("clinics").update({ onboarded: true }).eq("user_id", user.id);
      await provisionVapi(user.id);
    }

    router.push("/dashboard");
  };

  // Paid plan — provision then redirect to Stripe checkout
  const handleSelect = async (planKey: PlanKey) => {
    setSelecting(planKey);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    await provisionVapi(user.id);

    // Read the user's language preference for Stripe locale
    const language = localStorage.getItem("locale") ?? "pl";

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        planName: planNameMap[planKey],
        language,
      }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      console.error("Checkout error:", data.error);
      setSelecting(null);
    }
  };

  // Split the allPlansNote string around the {highlight} placeholder
  const noteStr = t("allPlansNote");
  const [noteBefore, noteAfter] = noteStr.split("{highlight}");

  return (
    <div className="min-h-screen bg-[#FFFCF7] flex flex-col px-4 py-12">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700;900&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
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
          {t("readyBadge")}
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-black text-[#1a1a1a] mb-4">
          {t("title")}
        </h1>
        <p className="text-[#666] max-w-md mx-auto">{t("subtitle")}</p>
      </div>

      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        {planKeys.map(({ key, price, highlight, featureCount }, i) => {
          const isSelecting = selecting === key;
          return (
            <div
              key={key}
              className={`fade-up delay-${i + 1} rounded-2xl p-6 flex flex-col ${
                highlight
                  ? "bg-[#1a1a1a] text-white border-2 border-[#1a1a1a]"
                  : "bg-white border border-[#f0ebe0]"
              }`}
            >
              {highlight && (
                <div className="text-xs font-medium bg-[#E65100] text-white px-3 py-1 rounded-full w-fit mb-4">
                  {t("mostPopular")}
                </div>
              )}

              <h2
                className={`font-display text-2xl font-black mb-1 ${highlight ? "text-white" : "text-[#1a1a1a]"}`}
              >
                {planNameMap[key]}
              </h2>
              <p className={`text-sm mb-6 ${highlight ? "text-[#999]" : "text-[#666]"}`}>
                {t(`${key}.description`)}
              </p>

              <div className="mb-8">
                <span className={`text-4xl font-bold ${highlight ? "text-white" : "text-[#1a1a1a]"}`}>
                  ${price}
                </span>
                <span className={`text-sm ml-1 ${highlight ? "text-[#999]" : "text-[#666]"}`}>
                  {t("month")}
                </span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {Array.from({ length: featureCount }, (_, fi) => (
                  <li key={fi} className="flex items-center gap-2.5 text-sm">
                    <Check
                      className={`h-4 w-4 flex-shrink-0 ${highlight ? "text-[#E65100]" : "text-[#2E7D32]"}`}
                    />
                    <span className={highlight ? "text-[#ccc]" : "text-[#666]"}>
                      {t(`${key}.f${fi + 1}`)}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelect(key)}
                disabled={!!selecting}
                className={`w-full py-3 rounded-full text-sm font-medium transition-colors disabled:opacity-50 ${
                  highlight
                    ? "bg-[#E65100] text-white hover:bg-[#bf4000]"
                    : "bg-[#1a1a1a] text-white hover:bg-[#333]"
                }`}
              >
                {isSelecting ? t("settingUp") : t("getStarted")}
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-center text-sm text-[#999] mt-8">
        {noteBefore}
        <span className="text-[#E65100] font-medium">{t("allPlansHighlight")}</span>
        {noteAfter}
      </p>

      <button
        onClick={handleSkip}
        disabled={!!selecting}
        className="block mx-auto mt-4 text-sm text-[#999] hover:text-[#666] transition-colors underline underline-offset-2 disabled:opacity-50"
      >
        {t("skipForNow")}
      </button>
    </div>
  );
}
