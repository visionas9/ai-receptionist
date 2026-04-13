// Required env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY
// Resend: sender domain must be verified in your Resend account dashboard.
// Default sender: bookings@receply.com (update RESEND_FROM_EMAIL env var to override)

import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { escapeHtml } from "@/lib/escapeHtml";

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  try {
    const body = await req.json();

    if (body.message?.type !== "end-of-call-report") {
      return NextResponse.json({ received: true });
    }

    const message = body.message;
    const artifact = message.artifact || {};

    const assistantId = message.assistant?.id || message.call?.assistantId;
    console.log("Assistant ID from webhook:", assistantId);

    if (!assistantId) {
      return NextResponse.json(
        { error: "No assistant ID in webhook" },
        { status: 400 },
      );
    }

    const { data: clinic } = await supabase
      .from("clinics")
      .select("id, user_id, name, free_minutes_remaining")
      .eq("vapi_assistant_id", assistantId)
      .single();

    if (!clinic) {
      return NextResponse.json(
        { error: "No clinic found for this assistant" },
        { status: 404 },
      );
    }

    // Deduct call duration from free minutes
    const callDuration = message.durationMinutes || 0;
    const currentMinutes = clinic.free_minutes_remaining || 0;
    const newMinutes = Math.max(0, currentMinutes - callDuration);

    await supabase
      .from("clinics")
      .update({ free_minutes_remaining: newMinutes })
      .eq("id", clinic.id);

    const structuredOutputs = artifact.structuredOutputs || {};
    const bookingEntry = Object.values(structuredOutputs).find(
      (o: any) => o.name === "Booking Details",
    ) as any;
    const booking = bookingEntry?.result || {};

    // Guard 1: skip ghost bookings with null or empty name
    const customerName = booking.customerName;
    if (!customerName ||
        customerName === "null" ||
        customerName.trim() === "") {
      console.log("Skipping ghost booking: customerName is null or empty");
      return NextResponse.json({ received: true });
    }

    // Guard 2: skip bookings with missing or placeholder date
    const appointmentDate = booking.appointmentDate;
    const isInvalidDate =
      !appointmentDate ||
      appointmentDate === "null" ||
      appointmentDate === "2024-01-01" ||
      appointmentDate === "1970-01-01";

    if (isInvalidDate) {
      console.log("Skipping ghost booking: invalid date", appointmentDate);
      return NextResponse.json({ received: true });
    }

    // Guard 3: fix wrong year on valid dates
    const parsedDate = new Date(appointmentDate);
    const currentYear = new Date().getFullYear();
    if (parsedDate.getFullYear() < currentYear) {
      const corrected = appointmentDate.replace(
        /^\d{4}/,
        String(currentYear)
      );
      booking.appointmentDate = corrected;
    }

    console.log("Booking:", JSON.stringify(booking, null, 2));
    console.log(`Minutes deducted: ${callDuration}, remaining: ${newMinutes}`);

    const { error } = await supabase.from("appointments").insert({
      clinic_id: clinic.id,
      patient_name: booking.customerName || "Unknown",
      patient_phone: message.customer?.number || null,
      appointment_date: booking.appointmentDate || null,
      appointment_time: booking.appointmentTime || null,
      reason: booking.serviceType || null,
      call_id: message.call?.id || null,
      recording_url: artifact.recordingUrl || null,
      transcript: artifact.transcript || null,
      status: "confirmed",
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Send email notification to clinic owner
    try {
      const { data: userData } = await supabase.auth.admin.getUserById(clinic.user_id);
      const ownerEmail = userData?.user?.email;

      if (ownerEmail && process.env.RESEND_API_KEY) {
        const patientName = booking.customerName || "Unknown";
        const serviceType = booking.serviceType || "—";
        const apptDate = booking.appointmentDate || "—";
        const apptTime = booking.appointmentTime || "—";
        const phone = message.customer?.number || "—";

        await resend.emails.send({
          from: fromEmail,
          to: ownerEmail,
          subject: `New booking — ${patientName}`,
          html: `
<div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
  <h2 style="margin-bottom: 4px;">New booking</h2>
  <p style="color: #666; margin-top: 0;">${escapeHtml(clinic.name || "Your clinic")}</p>
  <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
    <tr>
      <td style="padding: 8px 0; color: #666; width: 40%;">Patient</td>
      <td style="padding: 8px 0; font-weight: 600;">${escapeHtml(patientName)}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; color: #666;">Service</td>
      <td style="padding: 8px 0;">${escapeHtml(serviceType)}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; color: #666;">Date</td>
      <td style="padding: 8px 0;">${escapeHtml(apptDate)}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; color: #666;">Time</td>
      <td style="padding: 8px 0;">${escapeHtml(apptTime)}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; color: #666;">Phone</td>
      <td style="padding: 8px 0;">${escapeHtml(phone)}</td>
    </tr>
  </table>
  <hr style="border: none; border-top: 1px solid #f0ebe0; margin: 24px 0;" />
  <p style="color: #999; font-size: 12px;">Receply — AI receptionist</p>
</div>`,
        });
        console.log(`Booking email sent to ${ownerEmail}`);
      }
    } catch (emailErr) {
      // Email failure must not affect the booking response
      console.error("Email notification error:", emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
