"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";

type QuestionId =
  | "industry"
  | "name"
  | "tone"
  | "busiest_time"
  | "main_goal";

export default function OnboardingPage() {
  const t = useTranslations("onboarding");
  const [loaded, setLoaded] = useState(false);
  // step 0 = language selection, steps 1–5 = questions
  const [step, setStep] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("pl");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [textValue, setTextValue] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // On mount, check if user already chose a language (coming back after page reload)
  useEffect(() => {
    const savedStep = localStorage.getItem("onboarding_step");
    const savedLang = localStorage.getItem("locale") ?? "pl";
    setSelectedLanguage(savedLang);
    if (savedStep && parseInt(savedStep) > 0) {
      setStep(parseInt(savedStep));
    }
    setLoaded(true);
  }, []);

  const questions: {
    id: QuestionId;
    type: "choice" | "text";
    options?: { value: string; label: string }[];
    placeholder?: string;
  }[] = [
    {
      id: "industry",
      type: "choice",
      options: [
        { value: "dental", label: t("industry.dental") },
        { value: "barber", label: t("industry.barber") },
        { value: "beauty", label: t("industry.beauty") },
        { value: "massage", label: t("industry.massage") },
        { value: "other", label: t("industry.other") },
      ],
    },
    {
      id: "name",
      type: "text",
      placeholder: t("name.placeholder"),
    },
    {
      id: "tone",
      type: "choice",
      options: [
        { value: "warm", label: t("tone.warm") },
        { value: "professional", label: t("tone.professional") },
        { value: "casual", label: t("tone.casual") },
      ],
    },
    {
      id: "busiest_time",
      type: "choice",
      options: [
        { value: "mornings", label: t("busiestTime.mornings") },
        { value: "afternoons", label: t("busiestTime.afternoons") },
        { value: "evenings", label: t("busiestTime.evenings") },
        { value: "all_day", label: t("busiestTime.allDay") },
      ],
    },
    {
      id: "main_goal",
      type: "choice",
      options: [
        { value: "missing_calls", label: t("mainGoal.missingCalls") },
        { value: "no_time", label: t("mainGoal.noTime") },
        { value: "after_hours", label: t("mainGoal.afterHours") },
        { value: "all", label: t("mainGoal.all") },
      ],
    },
  ];

  const totalSteps = questions.length + 1; // +1 for language step
  const currentQuestion = step > 0 ? questions[step - 1] : null;

  const questionLabels: Record<QuestionId, { question: string; subtitle: string }> = {
    industry: { question: t("industry.question"), subtitle: t("industry.subtitle") },
    name: { question: t("name.question"), subtitle: t("name.subtitle") },
    tone: { question: t("tone.question"), subtitle: t("tone.subtitle") },
    busiest_time: { question: t("busiestTime.question"), subtitle: t("busiestTime.subtitle") },
    main_goal: { question: t("mainGoal.question"), subtitle: t("mainGoal.subtitle") },
  };

  const handleLanguageSelect = (lang: string) => {
    setSelectedLanguage(lang);
    document.cookie = `NEXT_LOCALE=${lang};path=/;max-age=31536000;SameSite=Lax`;
    localStorage.setItem("locale", lang);
    localStorage.setItem("onboarding_step", "1");
    window.location.reload();
  };

  const handleChoice = (value: string) => {
    if (!currentQuestion) return;
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);
    const nextStep = step + 1;
    if (nextStep <= questions.length) {
      localStorage.setItem("onboarding_step", String(nextStep));
      setTimeout(() => setStep(nextStep), 300);
    } else {
      handleSubmit(newAnswers);
    }
  };

  const handleTextNext = () => {
    if (!textValue.trim() || !currentQuestion) return;
    const newAnswers = { ...answers, [currentQuestion.id]: textValue.trim() };
    setAnswers(newAnswers);
    setTextValue("");
    const nextStep = step + 1;
    localStorage.setItem("onboarding_step", String(nextStep));
    setStep(nextStep);
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
        language: selectedLanguage,
        onboarded: true,
      })
      .eq("user_id", user.id);

    localStorage.removeItem("onboarding_step");
    router.push("/onboarding/loading");
  };

  if (!loaded || loading) return null;

  return (
    <div className="min-h-screen bg-[#FFFCF7] flex flex-col">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@700;900&display=swap'); .font-display { font-family: 'Fraunces', serif; }`}</style>

      {/* Header */}
      <div className="max-w-xl mx-auto w-full px-4 pt-8">
        <div className="flex items-center justify-between mb-4">
          <span className="font-display font-bold text-lg text-[#1a1a1a]">
            Receply
          </span>
          <span className="text-sm text-[#999]">
            {t("stepCounter", { current: step + 1, total: totalSteps })}
          </span>
        </div>
        {/* Progress bar — one segment per step */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                i < step
                  ? "bg-[#E65100]"
                  : i === step
                    ? "bg-[#E65100]/60"
                    : "bg-[#f0ebe0]"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question / Language step */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-xl">
          <div
            key={step}
            style={{ animation: "fadeUp 0.4s ease forwards", opacity: 0 }}
          >
            <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>

            {/* Step 0: Language selection */}
            {step === 0 && (
              <>
                <h1 className="font-display text-3xl md:text-4xl font-black text-[#1a1a1a] mb-3">
                  {t("language.title")}
                </h1>
                <p className="text-[#666] mb-10">{t("language.subtitle")}</p>
                <div className="space-y-3">
                  <button
                    onClick={() => handleLanguageSelect("pl")}
                    className="w-full text-left px-6 py-4 rounded-2xl border-2 transition-all duration-150 text-sm font-medium border-[#f0ebe0] bg-white text-[#1a1a1a] hover:border-[#E65100]/40 hover:bg-[#FFF8F3] cursor-pointer"
                  >
                    {t("language.polish")}
                  </button>
                  <button
                    onClick={() => handleLanguageSelect("en")}
                    className="w-full text-left px-6 py-4 rounded-2xl border-2 transition-all duration-150 text-sm font-medium border-[#f0ebe0] bg-white text-[#1a1a1a] hover:border-[#E65100]/40 hover:bg-[#FFF8F3] cursor-pointer"
                  >
                    {t("language.english")}
                  </button>
                </div>
              </>
            )}

            {/* Steps 1–5: Questions */}
            {step > 0 && currentQuestion && (
              <>
                <h1 className="font-display text-3xl md:text-4xl font-black text-[#1a1a1a] mb-3">
                  {questionLabels[currentQuestion.id].question}
                </h1>
                <p className="text-[#666] mb-10">
                  {questionLabels[currentQuestion.id].subtitle}
                </p>

                {currentQuestion.type === "choice" && (
                  <div className="space-y-3">
                    {currentQuestion.options?.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleChoice(option.value)}
                        className={`w-full text-left px-6 py-4 rounded-2xl border-2 transition-all duration-150 text-sm font-medium cursor-pointer
                          ${
                            answers[currentQuestion.id] === option.value
                              ? "border-[#E65100] bg-[#FFF3E0] text-[#E65100]"
                              : "border-[#f0ebe0] bg-white text-[#1a1a1a] hover:border-[#E65100]/40 hover:bg-[#FFF8F3]"
                          }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}

                {currentQuestion.type === "text" && (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={textValue}
                      onChange={(e) => setTextValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleTextNext()}
                      placeholder={currentQuestion.placeholder}
                      autoFocus
                      className="w-full px-6 py-4 border-2 border-[#f0ebe0] rounded-2xl bg-white text-sm focus:outline-none focus:border-[#E65100] transition-colors"
                    />
                    <button
                      onClick={handleTextNext}
                      disabled={!textValue.trim()}
                      className="w-full bg-[#1a1a1a] text-white py-4 rounded-full text-sm font-medium hover:bg-[#333] transition-colors disabled:opacity-30 cursor-pointer"
                    >
                      {t("continue")}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
