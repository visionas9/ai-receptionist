import { Card, CardContent } from "@/components/ui/card";
import { Appointment } from "@/types";
import { Calendar, Clock, CheckCircle, Phone } from "lucide-react";

interface Props {
  appointments: Appointment[];
}

export default function StatsBar({ appointments }: Props) {
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
    {
      label: "Total Appointments",
      value: totalCount,
      icon: Calendar,
    },
    {
      label: "Booked Today",
      value: todayCount,
      icon: Clock,
    },
    {
      label: "Confirmed",
      value: confirmedCount,
      icon: CheckCircle,
    },
    {
      label: "With Recording",
      value: withRecordingCount,
      icon: Phone,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
              <stat.icon className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
