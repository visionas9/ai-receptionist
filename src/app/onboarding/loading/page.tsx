"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const stages = [
  {
    label: "Creating your AI assistant",
    sublabel: "Training on your business preferences...",
    duration: 3000,
  },
  {
    label: "Setting up your dashboard",
    sublabel: "Preparing your booking management system...",
    duration: 2500,
  },
];

export default function OnboardingLoadingPage() {
  const [stageIndex, setStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const stage = stages[stageIndex];
    const interval = 30;
    const steps = stage.duration / interval;
    const increment = 100 / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      setProgress(Math.min(Math.round(current), 100));

      if (current >= 100) {
        clearInterval(timer);
        if (stageIndex < stages.length - 1) {
          setTimeout(() => {
            setStageIndex(stageIndex + 1);
            setProgress(0);
          }, 400);
        } else {
          setTimeout(() => {
            router.push("/onboarding/pricing");
          }, 600);
        }
      }
    }, interval);

    return () => clearInterval(timer);
  }, [stageIndex]);

  const stage = stages[stageIndex];

  return (
    <div className="min-h-screen bg-[#FFFCF7] flex flex-col items-center justify-center px-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700;900&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
      `}</style>

      <div className="w-full max-w-md text-center">
        <span className="font-display font-bold text-lg text-[#1a1a1a] block mb-16">
          Receply
        </span>

        <div key={stageIndex} className="fade-up">
          <div className="w-16 h-16 bg-[#FFF3E0] rounded-2xl flex items-center justify-center mx-auto mb-8">
            {stageIndex === 0 ? (
              <svg
                className="w-8 h-8 text-[#E65100]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21a48.309 48.309 0 01-8.135-1.587c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
                />
              </svg>
            ) : (
              <svg
                className="w-8 h-8 text-[#E65100]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                />
              </svg>
            )}
          </div>

          <h1 className="font-display text-2xl font-black text-[#1a1a1a] mb-2">
            {stage.label}
          </h1>
          <p className="text-[#666] text-sm mb-10">{stage.sublabel}</p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#f0ebe0] rounded-full h-2 mb-3">
          <div
            className="bg-[#E65100] h-2 rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm font-medium text-[#E65100]">{progress}%</p>

        {/* Stage dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {stages.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === stageIndex
                  ? "w-6 h-2 bg-[#E65100]"
                  : i < stageIndex
                    ? "w-2 h-2 bg-[#E65100]/40"
                    : "w-2 h-2 bg-[#f0ebe0]"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
