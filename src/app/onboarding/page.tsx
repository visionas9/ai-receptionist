"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const questions = [
  {
    id: "industry",
    question: "What kind of business do you run?",
    subtitle: "We'll customize your AI receptionist based on your industry.",
    type: "choice",
    options: [
      { value: "dental", label: "Dental Clinic" },
      { value: "barber", label: "Barber Shop" },
      { value: "beauty", label: "Beauty Salon" },
      { value: "massage", label: "Massage Salon" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "name",
    question: "What's your business called?",
    subtitle: "Your AI receptionist will introduce itself using this name.",
    type: "text",
    placeholder: "e.g. Bright Smile Dental",
  },
  {
    id: "tone",
    question: "How do you talk to your customers?",
    subtitle: "Your AI will match this tone in every conversation.",
    type: "choice",
    options: [
      { value: "warm", label: "Warm & friendly" },
      { value: "professional", label: "Professional & formal" },
      { value: "casual", label: "Casual & relaxed" },
    ],
  },
  {
    id: "busiest_time",
    question: "When do most of your customers call?",
    subtitle: "This helps us optimize your assistant's availability.",
    type: "choice",
    options: [
      { value: "mornings", label: "Mornings" },
      { value: "afternoons", label: "Afternoons" },
      { value: "evenings", label: "Evenings" },
      { value: "all_day", label: "All day" },
    ],
  },
  {
    id: "main_goal",
    question: "What's your biggest headache right now?",
    subtitle: "We'll make sure your AI tackles this first.",
    type: "choice",
    options: [
      { value: "missing_calls", label: "Missing calls" },
      { value: "no_time", label: "No time to answer" },
      { value: "after_hours", label: "After-hours bookings" },
      { value: "all", label: "All of the above" },
    ],
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [textValue, setTextValue] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const current = questions[step];
  const progress = (step / questions.length) * 100;

  const handleChoice = (value: string) => {
    const newAnswers = { ...answers, [current.id]: value };
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setTimeout(() => setStep(step + 1), 300);
    } else {
      handleSubmit(newAnswers);
    }
  };

  const handleTextNext = () => {
    if (!textValue.trim()) return;
    const newAnswers = { ...answers, [current.id]: textValue.trim() };
    setAnswers(newAnswers);
    setTextValue("");
    setStep(step + 1);
  };

  const handleSubmit = async (finalAnswers: Record<string, string>) => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("clinics")
      .update({
        industry: finalAnswers.industry,
        name: finalAnswers.name || undefined,
        tone: finalAnswers.tone,
        busiest_time: finalAnswers.busiest_time,
        main_goal: finalAnswers.main_goal,
        onboarded: true,
      })
      .eq("user_id", user.id);

    router.push("/onboarding/loading");
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#FFFCF7] flex flex-col">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700;900&display=swap'); .font-display { font-family: 'Fraunces', serif; }`}</style>

      {/* Progress bar */}
      <div className="w-full h-1 bg-[#f0ebe0]">
        <div
          className="h-1 bg-[#E65100] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      <div className="max-w-xl mx-auto w-full px-4 pt-8 flex items-center justify-between">
        <span className="font-display font-bold text-lg text-[#1a1a1a]">
          Receply
        </span>
        <span className="text-sm text-[#999]">
          {step + 1} of {questions.length}
        </span>
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-xl">
          <div
            key={step}
            style={{ animation: "fadeUp 0.4s ease forwards", opacity: 0 }}
          >
            <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>

            <h1 className="font-display text-3xl md:text-4xl font-black text-[#1a1a1a] mb-3">
              {current.question}
            </h1>
            <p className="text-[#666] mb-10">{current.subtitle}</p>

            {current.type === "choice" && (
              <div className="space-y-3">
                {current.options?.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleChoice(option.value)}
                    className={`w-full text-left px-6 py-4 rounded-2xl border-2 transition-all duration-150 text-sm font-medium
                      ${
                        answers[current.id] === option.value
                          ? "border-[#E65100] bg-[#FFF3E0] text-[#E65100]"
                          : "border-[#f0ebe0] bg-white text-[#1a1a1a] hover:border-[#E65100]/40 hover:bg-[#FFF8F3]"
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}

            {current.type === "text" && (
              <div className="space-y-4">
                <input
                  type="text"
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleTextNext()}
                  placeholder={current.placeholder}
                  autoFocus
                  className="w-full px-6 py-4 border-2 border-[#f0ebe0] rounded-2xl bg-white text-sm focus:outline-none focus:border-[#E65100] transition-colors"
                />
                <button
                  onClick={handleTextNext}
                  disabled={!textValue.trim()}
                  className="w-full bg-[#1a1a1a] text-white py-4 rounded-full text-sm font-medium hover:bg-[#333] transition-colors disabled:opacity-30"
                >
                  Continue →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
