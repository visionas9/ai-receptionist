"use client";

import Link from "next/link";
import {
  Phone,
  Calendar,
  Clock,
  ChevronRight,
  Zap,
  Shield,
  BarChart3,
} from "lucide-react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const featureKeys = [
  { key: "phone", Icon: Phone },
  { key: "booking", Icon: Calendar },
  { key: "realtime", Icon: Clock },
  { key: "recordings", Icon: BarChart3 },
  { key: "setup", Icon: Zap },
  { key: "secure", Icon: Shield },
] as const;

const stepKeys = ["step1", "step2", "step3"] as const;

const rows = [
  {
    name: "Anna Kowalski",
    date: "Mar 14",
    time: "10:00",
    reason: "Checkup",
    phone: "+48 501 234 567",
  },
  {
    name: "John Smith",
    date: "Mar 14",
    time: "11:30",
    reason: "Cleaning",
    phone: "+48 602 345 678",
  },
  {
    name: "Maria Nowak",
    date: "Mar 15",
    time: "09:00",
    reason: "Toothache",
    phone: "+48 703 456 789",
  },
];

export default function LandingPage() {
  const t = useTranslations("landing");

  const stats = [
    { value: "12", label: t("preview.statTotal") },
    { value: "3", label: t("preview.statToday") },
    { value: "12", label: t("preview.statConfirmed") },
    { value: "8", label: t("preview.statRecordings") },
  ];

  return (
    <div
      className="min-h-screen bg-[#FFFCF7] text-[#1a1a1a]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Fraunces:wght@700;900&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .animate-fade-up { animation: fadeUp 0.6s ease forwards; opacity: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#FFFCF7]/90 backdrop-blur-sm border-b border-[#f0ebe0]">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-display text-xl font-bold text-[#1a1a1a] hover:opacity-80 transition-opacity"
          >
            Receply
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="text-sm text-[#666] hover:text-[#1a1a1a] transition-colors"
            >
              {t("nav.features")}
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("how")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="text-sm text-[#666] hover:text-[#1a1a1a] transition-colors"
            >
              {t("nav.howItWorks")}
            </button>
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              href="/login"
              className="text-sm text-[#666] hover:text-[#1a1a1a] transition-colors"
            >
              {t("nav.signIn")}
            </Link>
            <Link
              href="/signup"
              className="text-sm bg-[#1a1a1a] text-white px-4 py-2 rounded-full hover:bg-[#333] transition-colors"
            >
              {t("nav.getStarted")}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 pt-20 md:pt-32 pb-20 text-center">
        <div className="animate-fade-up inline-flex items-center gap-2 bg-[#FFF3E0] text-[#E65100] text-sm font-medium px-4 py-1.5 rounded-full mb-8">
          <span className="w-2 h-2 bg-[#E65100] rounded-full animate-pulse" />
          {t("hero.badge")}
        </div>
        <h1 className="animate-fade-up delay-1 font-display text-5xl md:text-7xl font-black leading-tight mb-6 text-[#1a1a1a]">
          {t("hero.title")}
        </h1>
        <p className="animate-fade-up delay-2 text-lg md:text-xl text-[#666] max-w-2xl mx-auto mb-10 leading-relaxed">
          {t("hero.subtitle")}
        </p>
        <div className="animate-fade-up delay-3 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="flex items-center gap-2 bg-[#1a1a1a] text-white px-8 py-4 rounded-full text-sm font-medium hover:bg-[#333] transition-colors"
          >
            {t("hero.ctaPrimary")}
            <ChevronRight className="h-4 w-4" />
          </Link>
          <button
            onClick={() =>
              document
                .getElementById("how")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="flex items-center gap-2 text-sm text-[#666] hover:text-[#1a1a1a] transition-colors px-8 py-4"
          >
            {t("hero.ctaSecondary")}
          </button>
        </div>

        {/* Dashboard preview */}
        <div className="animate-fade-up delay-4 mt-16 rounded-2xl overflow-hidden border border-[#f0ebe0] shadow-2xl shadow-[#00000015] hover:shadow-[0_32px_64px_rgba(0,0,0,0.12)] transition-shadow duration-300">
          <div className="bg-[#f8f4ee] border-b border-[#f0ebe0] px-4 py-3 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="ml-3 text-xs text-[#999]">
              {t("preview.label")}
            </span>
          </div>
          <div className="bg-white p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-[#FFFCF7] border border-[#f0ebe0] rounded-xl p-4 hover:border-[#E65100]/30 hover:bg-[#FFF3E0]/30 transition-all duration-200 cursor-default"
                >
                  <p className="text-2xl font-bold text-[#1a1a1a]">
                    {stat.value}
                  </p>
                  <p className="text-xs text-[#999] mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {rows.map((row, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-[#FFFCF7] border border-[#f0ebe0] rounded-lg px-4 py-3 hover:border-[#E65100]/30 hover:bg-[#FFF8F3] transition-all duration-200 cursor-default"
                >
                  <span className="text-sm font-medium text-[#1a1a1a] w-32 truncate">
                    {row.name}
                  </span>
                  <span className="text-xs text-[#999] hidden sm:block">
                    {row.phone}
                  </span>
                  <span className="text-xs text-[#999]">
                    {row.date} · {row.time}
                  </span>
                  <span className="text-xs text-[#666] hidden md:block">
                    {row.reason}
                  </span>
                  <span className="text-xs bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded-full">
                    {t("preview.statusConfirmed")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-[#f8f4ee] py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-black mb-4">
              {t("featuresSection.title")}
            </h2>
            <p className="text-[#666] text-lg max-w-xl mx-auto">
              {t("featuresSection.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureKeys.map(({ key, Icon }) => (
              <div
                key={key}
                className="bg-[#FFFCF7] rounded-2xl p-6 border border-[#f0ebe0] hover:shadow-lg hover:shadow-[#00000008] transition-shadow"
              >
                <div className="w-10 h-10 bg-[#FFF3E0] rounded-xl flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-[#E65100]" />
                </div>
                <h3 className="font-semibold text-[#1a1a1a] mb-2">
                  {t(`featuresSection.${key}.title`)}
                </h3>
                <p className="text-sm text-[#666] leading-relaxed">
                  {t(`featuresSection.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-black mb-4">
              {t("howItWorksSection.title")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stepKeys.map((key, i) => (
              <div key={key} className="text-center">
                <div className="font-display text-6xl font-black text-[#f0ebe0] mb-4">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-semibold text-[#1a1a1a] text-lg mb-2">
                  {t(`howItWorksSection.${key}.title`)}
                </h3>
                <p className="text-[#666] text-sm leading-relaxed">
                  {t(`howItWorksSection.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1a1a1a] py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-4 md:px-8 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-4">
            {t("ctaSection.title")}
          </h2>
          <p className="text-[#999] text-lg mb-10">
            {t("ctaSection.subtitle")}
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-white text-[#1a1a1a] px-8 py-4 rounded-full text-sm font-medium hover:bg-[#f0f0f0] transition-colors"
          >
            {t("ctaSection.button")}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] border-t border-[#333] py-8">
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-display text-white font-bold">Receply</span>
          <p className="text-[#666] text-sm">{t("footer.copyright")}</p>
        </div>
      </footer>
    </div>
  );
}
