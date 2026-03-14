"use client";

import { useState, useEffect } from "react";
import { Appointment } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Play, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  appointments: Appointment[];
  clinicId: string;
}

export default function AppointmentsTable({
  appointments: initial,
  clinicId,
}: Props) {
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
        <p className="font-medium text-[#1a1a1a]">No appointments yet</p>
        <p className="text-sm text-[#666] mt-1">
          Appointments booked via phone will appear here automatically.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border border-[#f0ebe0] rounded-2xl overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-7 gap-4 px-6 py-3 border-b border-[#f0ebe0] bg-[#f8f4ee]">
          {[
            "Patient",
            "Phone",
            "Date",
            "Time",
            "Reason",
            "Status",
            "Recording",
          ].map((h) => (
            <p key={h} className="text-xs font-medium text-[#666]">
              {h}
            </p>
          ))}
        </div>

        {/* Table rows */}
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
                    Play
                  </button>
                ) : (
                  <span className="text-[#666] text-sm">—</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog
        open={!!selectedAppointment}
        onOpenChange={() => setSelectedAppointment(null)}
      >
        <DialogContent className="max-w-lg bg-[#FFFCF7] border-[#f0ebe0]">
          <DialogHeader>
            <DialogTitle className="text-[#1a1a1a]">
              Call Recording — {selectedAppointment?.patient_name}
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
                <p className="text-sm font-medium text-[#1a1a1a]">Transcript</p>
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
