"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Check } from "lucide-react";

const plan = {
  name: "Pro",
  price: "799",
  currency: "PLN",
  description: "Everything you need to automate your reception.",
  features: [
    "1,500 minutes per month",
    "Unlimited AI phone calls",
    "Real-time booking dashboard",
    "Call recordings & transcripts",
    "Priority support",
  ],
  cta: "Upgrade to Pro",
};

export default function PaywallPage() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleUpgrade = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FFFCF7] flex flex-col px-4 py-12">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700;900&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.5s ease forwards; opacity: 0; }
        .delay-1 { animation-delay: 0.1s; }
      `}</style>

      <div className="text-center mb-12">
        <span className="font-display font-bold text-lg text-[#1a1a1a] block mb-8">
          Receply
        </span>
        <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 bg-red-500 rounded-full" />
          Your free minutes have been used up
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-black text-[#1a1a1a] mb-4">
          You've had a taste — ready to commit?
        </h1>
        <p className="text-[#666] max-w-md mx-auto">
          Your AI receptionist has been working hard. Upgrade to keep it running
          24/7 with unlimited calls.
        </p>
      </div>

      <div className="max-w-md mx-auto w-full">
        <div className="fade-up delay-1 rounded-2xl p-8 flex flex-col bg-[#1a1a1a] text-white border-2 border-[#1a1a1a]">
          <h2 className="font-display text-2xl font-black mb-1 text-white">
            {plan.name}
          </h2>
          <p className="text-sm mb-6 text-[#999]">{plan.description}</p>

          <div className="mb-8">
            <span className="text-4xl font-bold text-white">{plan.price}</span>
            <span className="text-sm ml-1 text-[#999]">
              {" "}{plan.currency}/month
            </span>
          </div>

          <ul className="space-y-3 mb-8 flex-1">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2.5 text-sm">
                <Check className="h-4 w-4 flex-shrink-0 text-[#E65100]" />
                <span className="text-[#ccc]">{feature}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full py-3 rounded-full text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer bg-[#E65100] text-white hover:bg-[#bf4000]"
          >
            {loading ? "Redirecting..." : plan.cta}
          </button>
        </div>
      </div>

      <p className="text-center text-sm text-[#999] mt-8">
        Cancel anytime. No questions asked.
      </p>
    </div>
  );
}
