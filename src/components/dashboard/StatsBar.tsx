import { Appointment } from "@/types";
import { Calendar, Clock, CheckCircle, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";

interface Props {
  appointments: Appointment[];
}

export default async function StatsBar({ appointments }: Props) {
  const t = await getTranslations("dashboard.stats");
  const today = new Date().toISOString().split("T")[0];

  const todayCount = appointments.filter((a) =>
    a.created_at.startsWith(today),
  ).length;
  const confirmedCount = appointments.filter(
    (a) => a.status === "confirmed",
  ).length;
  const totalCount = appointments.length;
  const withRecordingCount = appointments.filter((a) => a.recording_url).length;

  const stats = [
    { label: t("total"), value: totalCount, icon: Calendar },
    { label: t("today"), value: todayCount, icon: Clock },
    { label: t("confirmed"), value: confirmedCount, icon: CheckCircle },
    { label: t("withRecording"), value: withRecordingCount, icon: Phone },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white border border-[#f0ebe0] rounded-2xl p-5 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-[#666] font-medium">{stat.label}</p>
            <div className="w-8 h-8 bg-[#FFF3E0] rounded-xl flex items-center justify-center">
              <stat.icon className="h-4 w-4 text-[#E65100]" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[#1a1a1a]">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
