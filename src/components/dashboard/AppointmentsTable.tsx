"use client";

import { useState, useEffect } from "react";
import { Appointment } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Play, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";

interface Props {
  appointments: Appointment[];
  clinicId: string;
}

export default function AppointmentsTable({
  appointments: initial,
  clinicId,
}: Props) {
  const t = useTranslations("dashboard");
  const [appointments, setAppointments] = useState<Appointment[]>(initial);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel("appointments")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "appointments",
          filter: `clinic_id=eq.${clinicId}`,
        },
        (payload) => {
          setAppointments((prev) => [payload.new as Appointment, ...prev]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [clinicId]);

  if (appointments.length === 0) {
    return (
      <div className="bg-white border border-[#f0ebe0] rounded-2xl p-16 text-center">
        <div className="w-12 h-12 bg-[#FFF3E0] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Phone className="h-6 w-6 text-[#E65100]" />
        </div>
        <p className="font-medium text-[#1a1a1a]">{t("empty.title")}</p>
        <p className="text-sm text-[#666] mt-1">{t("empty.subtitle")}</p>
      </div>
    );
  }

  const tableHeaders = [
    t("table.patient"),
    t("table.phone"),
    t("table.date"),
    t("table.time"),
    t("table.reason"),
    t("table.status"),
    t("table.recording"),
  ];

  return (
    <>
      {/* Desktop table */}
        <div className="hidden md:block bg-white border border-[#f0ebe0] rounded-2xl overflow-hidden">
          <div className="grid grid-cols-7 gap-4 px-6 py-3 border-b border-[#f0ebe0] bg-[#f8f4ee]">
            {tableHeaders.map((h) => (
              <p key={h} className="text-xs font-medium text-[#666]">
                {h}
              </p>
            ))}
          </div>
          <div className="divide-y divide-[#f0ebe0]">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="grid grid-cols-7 gap-4 px-6 py-4 hover:bg-[#FFFCF7] transition-colors items-center"
              >
                <p className="text-sm font-medium text-[#1a1a1a] truncate">
                  {appointment.patient_name}
                </p>
                <p className="text-sm text-[#666] truncate">
                  {appointment.patient_phone ?? "—"}
                </p>
                <p className="text-sm text-[#666]">
                  {appointment.appointment_date ?? "—"}
                </p>
                <p className="text-sm text-[#666]">
                  {appointment.appointment_time ?? "—"}
                </p>
                <p className="text-sm text-[#666] truncate">
                  {appointment.reason ?? "—"}
                </p>
                <div>
                  <span className="inline-flex items-center text-xs bg-[#E8F5E9] text-[#2E7D32] px-2.5 py-1 rounded-full font-medium">
                    {appointment.status}
                  </span>
                </div>
                <div>
                  {appointment.recording_url ? (
                    <button
                      onClick={() => setSelectedAppointment(appointment)}
                      className="flex items-center gap-1.5 text-xs text-[#E65100] hover:text-[#bf4000] font-medium transition-colors"
                    >
                      <Play className="h-3.5 w-3.5" />
                      {t("table.play")}
                    </button>
                  ) : (
                    <span className="text-[#666] text-sm">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white border border-[#f0ebe0] rounded-2xl p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-[#1a1a1a]">
                  {appointment.patient_name}
                </p>
                <span className="text-xs bg-[#E8F5E9] text-[#2E7D32] px-2.5 py-1 rounded-full font-medium">
                  {appointment.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-y-3">
                <div>
                  <p className="text-xs text-[#999] mb-1">{t("table.date")}</p>
                  <p className="text-sm font-medium text-[#1a1a1a]">
                    {appointment.appointment_date ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#999] mb-1">{t("table.time")}</p>
                  <p className="text-sm font-medium text-[#1a1a1a]">
                    {appointment.appointment_time ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#999] mb-1">{t("table.reason")}</p>
                  <p className="text-sm font-medium text-[#1a1a1a]">
                    {appointment.reason ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#999] mb-1">{t("table.phone")}</p>
                  <p className="text-sm font-medium text-[#1a1a1a]">
                    {appointment.patient_phone ?? "—"}
                  </p>
                </div>
              </div>

              {appointment.recording_url && (
                <button
                  onClick={() => setSelectedAppointment(appointment)}
                  className="flex items-center gap-2 text-xs text-[#E65100] font-medium bg-[#FFF3E0] hover:bg-[#ffe0b2] px-3 py-2 rounded-xl transition-colors w-full justify-center"
                >
                  <Play className="h-3.5 w-3.5" />
                  {t("table.playRecording")}
                </button>
              )}
            </div>
          ))}
        </div>

        <Dialog
          open={!!selectedAppointment}
          onOpenChange={() => setSelectedAppointment(null)}
        >
          <DialogContent className="max-w-lg bg-[#FFFCF7] border-[#f0ebe0]">
            <DialogHeader>
              <DialogTitle className="text-[#1a1a1a]">
                {t("dialog.title", { name: selectedAppointment?.patient_name ?? "" })}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedAppointment?.recording_url && (
                <audio controls className="w-full">
                  <source
                    src={selectedAppointment.recording_url}
                    type="audio/mpeg"
                  />
                </audio>
              )}
              {selectedAppointment?.transcript && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-[#1a1a1a]">
                    {t("dialog.transcript")}
                  </p>
                  <p className="text-sm text-[#666] bg-[#f8f4ee] border border-[#f0ebe0] p-4 rounded-xl whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
                    {selectedAppointment.transcript}
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
    </>
  );
}
