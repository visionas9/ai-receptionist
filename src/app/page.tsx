"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Phone,
  Calendar,
  Clock,
  ChevronRight,
  Zap,
  Shield,
  BarChart3,
  Check,
} from "lucide-react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const HeroPhoneAnimation = dynamic(
  () => import("@/components/HeroPhoneAnimation"),
  { ssr: false },
);

const featureKeys = [
  { key: "phone", Icon: Phone },
  { key: "booking", Icon: Calendar },
  { key: "realtime", Icon: Clock },
  { key: "recordings", Icon: BarChart3 },
  { key: "setup", Icon: Zap },
  { key: "secure", Icon: Shield },
] as const;

const stepKeys = ["step1", "step2", "step3"] as const;

export default function LandingPage() {
  const t = useTranslations("landing");

  return (
    <div
      className="min-h-screen bg-[#FFFCF7] text-[#1a1a1a]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
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
              className="text-sm text-[#666] hover:text-[#1a1a1a] transition-colors cursor-pointer"
            >
              {t("nav.features")}
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("how")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="text-sm text-[#666] hover:text-[#1a1a1a] transition-colors cursor-pointer"
            >
              {t("nav.howItWorks")}
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("pricing")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="text-sm text-[#666] hover:text-[#1a1a1a] transition-colors cursor-pointer"
            >
              {t("nav.pricing")}
            </button>
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              href="/login"
              className="text-sm text-[#666] hover:text-[#1a1a1a] transition-colors cursor-pointer"
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
            className="flex items-center gap-2 text-sm text-[#666] hover:text-[#1a1a1a] transition-colors px-8 py-4 cursor-pointer"
          >
            {t("hero.ctaSecondary")}
          </button>
        </div>

        {/* Phone-call animation (replaces former static dashboard mockup) */}
        <div className="animate-fade-up delay-4 mt-16">
          <HeroPhoneAnimation />
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

      {/* Pricing */}
      <section id="pricing" className="bg-[#f8f4ee] py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl font-black mb-4">
              {t("pricingSection.title")}
            </h2>
            <p className="text-[#666] text-lg max-w-xl mx-auto">
              {t("pricingSection.subtitle")}
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <div className="bg-[#1a1a1a] text-white rounded-2xl p-8 flex flex-col">
              <h3 className="font-display text-3xl font-black mb-2 text-white">
                {t("pricingSection.planName")}
              </h3>
              <p className="text-sm text-[#999] mb-6">
                {t("pricingSection.description")}
              </p>
              <div className="mb-8">
                <span className="text-5xl font-bold text-white">
                  {t("pricingSection.price")}
                </span>
                <span className="text-sm text-[#999] ml-1">
                  {t("pricingSection.period")}
                </span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {(["feature1", "feature2", "feature3", "feature4", "feature5"] as const).map((key) => (
                  <li key={key} className="flex items-center gap-2.5 text-sm">
                    <Check className="h-4 w-4 text-[#E65100] flex-shrink-0" />
                    <span className="text-[#ccc]">{t(`pricingSection.${key}`)}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block w-full text-center py-3 rounded-full text-sm font-medium bg-[#E65100] text-white hover:bg-[#bf4000] transition-colors"
              >
                {t("pricingSection.cta")}
              </Link>
            </div>
            <p className="text-center text-sm text-[#999] mt-4">
              {t("pricingSection.note")}
            </p>
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
