"use client";

import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const plans = [
  {
    name: "Starter",
    price: "29",
    description: "Perfect for small businesses just getting started.",
    features: [
      "Unlimited AI phone calls",
      "Real-time booking dashboard",
      "Call recordings & transcripts",
      "Email support",
    ],
    cta: "Get started",
    highlight: false,
  },
  {
    name: "Growth",
    price: "79",
    description: "For growing businesses that want more channels.",
    features: [
      "Everything in Starter",
      "WhatsApp & SMS bookings",
      "Telegram bookings",
      "Number porting support",
      "Custom AI voice & tone",
      "Priority support",
    ],
    cta: "Get started",
    highlight: true,
  },
  {
    name: "Pro",
    price: "149",
    description: "For established businesses that want it all.",
    features: [
      "Everything in Growth",
      "Multiple locations",
      "Advanced analytics",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee",
    ],
    cta: "Get started",
    highlight: false,
  },
];

export default function PricingPage() {
  const router = useRouter();

  const handleSelect = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("clinics")
        .update({ onboarded: true })
        .eq("user_id", user.id);
    }
    router.push("/dashboard");
  };

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
          Your AI receptionist is ready
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-black text-[#1a1a1a] mb-4">
          Choose your plan
        </h1>
        <p className="text-[#666] max-w-md mx-auto">
          Start with 15 free minutes. No credit card required. Cancel anytime.
        </p>
      </div>

      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, i) => (
          <div
            key={plan.name}
            className={`fade-up delay-${i + 1} rounded-2xl p-6 flex flex-col ${
              plan.highlight
                ? "bg-[#1a1a1a] text-white border-2 border-[#1a1a1a]"
                : "bg-white border border-[#f0ebe0]"
            }`}
          >
            {plan.highlight && (
              <div className="text-xs font-medium bg-[#E65100] text-white px-3 py-1 rounded-full w-fit mb-4">
                Most popular
              </div>
            )}

            <h2
              className={`font-display text-2xl font-black mb-1 ${plan.highlight ? "text-white" : "text-[#1a1a1a]"}`}
            >
              {plan.name}
            </h2>
            <p
              className={`text-sm mb-6 ${plan.highlight ? "text-[#999]" : "text-[#666]"}`}
            >
              {plan.description}
            </p>

            <div className="mb-8">
              <span
                className={`text-4xl font-bold ${plan.highlight ? "text-white" : "text-[#1a1a1a]"}`}
              >
                ${plan.price}
              </span>
              <span
                className={`text-sm ml-1 ${plan.highlight ? "text-[#999]" : "text-[#666]"}`}
              >
                /month
              </span>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2.5 text-sm">
                  <Check
                    className={`h-4 w-4 flex-shrink-0 ${plan.highlight ? "text-[#E65100]" : "text-[#2E7D32]"}`}
                  />
                  <span
                    className={plan.highlight ? "text-[#ccc]" : "text-[#666]"}
                  >
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleSelect}
              className={`w-full py-3 rounded-full text-sm font-medium transition-colors ${
                plan.highlight
                  ? "bg-[#E65100] text-white hover:bg-[#bf4000]"
                  : "bg-[#1a1a1a] text-white hover:bg-[#333]"
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-[#999] mt-8">
        All plans include{" "}
        <span className="text-[#E65100] font-medium">unlimited AI calls</span>.
        Start with 15 free minutes, no credit card required.
      </p>
    </div>
  );
}
