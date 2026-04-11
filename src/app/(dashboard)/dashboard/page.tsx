import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppointmentsTable from "@/components/dashboard/AppointmentsTable";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsBar from "@/components/dashboard/StatsBar";
import LocaleSyncer from "@/components/LocaleSyncer";
import UpgradeBanner from "@/components/dashboard/UpgradeBanner";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Record<string, string>;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: clinic } = await supabase
    .from("clinics")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!clinic) redirect("/login");
  if (!clinic.onboarded) redirect("/onboarding");

  // Fallback: if payment succeeded but webhook hasn't fired yet, grant minutes now
  const upgraded = searchParams?.upgraded === "true";
  if (upgraded && clinic.free_minutes_remaining <= 15) {
    await supabase
      .from("clinics")
      .update({ free_minutes_remaining: 1500 })
      .eq("user_id", user.id);
    clinic.free_minutes_remaining = 1500;
  }

  if (clinic.free_minutes_remaining <= 0) redirect("/paywall");

  const { data: appointments } = await supabase
    .from("appointments")
    .select("*")
    .eq("clinic_id", clinic.id)
    .order("created_at", { ascending: false });

  const t = await getTranslations("dashboard");

  return (
    <div className="min-h-screen bg-[#FFFCF7]">
      {/* Sync the locale stored in Supabase to the active cookie */}
      <LocaleSyncer savedLocale={clinic.language ?? null} />
      <UpgradeBanner show={upgraded} />
      <DashboardHeader
        clinicName={clinic.name}
        userEmail={user.email ?? ""}
        ownerName={clinic.owner_name ?? ""}
        freeMinutes={clinic.free_minutes_remaining ?? 15}
      />
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">{t("title")}</h1>
          <p className="text-sm text-[#666] mt-1">{t("subtitle")}</p>
        </div>
        <StatsBar appointments={appointments ?? []} />
        <AppointmentsTable
          appointments={appointments ?? []}
          clinicId={clinic.id}
        />
      </main>
    </div>
  );
}
