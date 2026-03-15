import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppointmentsTable from "@/components/dashboard/AppointmentsTable";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsBar from "@/components/dashboard/StatsBar";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
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

  const { data: appointments } = await supabase
    .from("appointments")
    .select("*")
    .eq("clinic_id", clinic.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#FFFCF7]">
      <DashboardHeader
        clinicName={clinic.name}
        userEmail={user.email ?? ""}
        ownerName={clinic.owner_name ?? ""}
      />
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Appointments</h1>
          <p className="text-sm text-[#666] mt-1">
            All bookings made via your AI receptionist
          </p>
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
