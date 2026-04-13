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
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Verify the uid param matches the logged-in user (prevents session confusion after Stripe redirect)
  const uid = Array.isArray(params?.uid) ? params.uid[0] : params?.uid;
  if (uid && uid !== user.id) {
    redirect("/login");
  }

  const { data: clinic } = await supabase
    .from("clinics")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!clinic) redirect("/login");
  if (!clinic.onboarded) redirect("/onboarding");

  const upgradedParam = Array.isArray(params?.upgraded) ? params.upgraded[0] : params?.upgraded;
  const upgraded = upgradedParam === "true";

  // If the user just came from Stripe but the webhook hasn't updated the plan yet,
  // show a "processing" state instead of redirecting to paywall
  const paymentPending = upgraded && !clinic.plan && clinic.free_minutes_remaining <= 0;

  if (!paymentPending && clinic.free_minutes_remaining <= 0) redirect("/paywall");

  const { data: appointments } = await supabase
    .from("appointments")
    .select("*")
    .eq("clinic_id", clinic.id)
    .order("created_at", { ascending: false });

  const t = await getTranslations("dashboard");

  if (paymentPending) {
    return (
      <div className="min-h-screen bg-[#FFFCF7] flex flex-col items-center justify-center px-4">
<div className="text-center max-w-md">
          <div className="w-16 h-16 bg-[#FFF3E0] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-[#E65100] animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-black text-[#1a1a1a] mb-2">
            Processing your payment...
          </h1>
          <p className="text-[#666] text-sm mb-6">
            This usually takes a few seconds. The page will refresh automatically.
          </p>
          <meta httpEquiv="refresh" content="3" />
        </div>
      </div>
    );
  }

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
        plan={clinic.plan ?? null}
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
