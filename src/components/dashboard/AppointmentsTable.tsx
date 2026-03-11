"use client";

import { useState } from "react";
import { Appointment } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Play, Phone } from "lucide-react";

interface Props {
  appointments: Appointment[];
}

export default function AppointmentsTable({ appointments }: Props) {
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  if (appointments.length === 0) {
    return (
      <div className="border rounded-lg p-12 text-center text-muted-foreground">
        <Phone className="h-10 w-10 mx-auto mb-3 opacity-30" />
        <p className="font-medium">No appointments yet</p>
        <p className="text-sm mt-1">
          Appointments booked via phone will appear here automatically.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Recording</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell className="font-medium">
                  {appointment.patient_name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {appointment.patient_phone ?? "—"}
                </TableCell>
                <TableCell>{appointment.appointment_date ?? "—"}</TableCell>
                <TableCell>{appointment.appointment_time ?? "—"}</TableCell>
                <TableCell>{appointment.reason ?? "—"}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      appointment.status === "confirmed"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {appointment.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {appointment.recording_url ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedAppointment(appointment)}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Play
                    </Button>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!selectedAppointment}
        onOpenChange={() => setSelectedAppointment(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
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
                <p className="text-sm font-medium">Transcript</p>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md whitespace-pre-wrap">
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
