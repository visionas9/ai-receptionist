import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.message?.type !== "end-of-call-report") {
      return NextResponse.json({ received: true });
    }

    const message = body.message;
    const artifact = message.artifact || {};

    // Structured outputs are on artifact, keyed by output ID
    const structuredOutputs = artifact.structuredOutputs || {};
    const bookingEntry = Object.values(structuredOutputs).find(
      (o: any) => o.name === "Booking Details",
    ) as any;
    const booking = bookingEntry?.result || {};

    console.log("Booking:", JSON.stringify(booking, null, 2));

    const { data: clinic } = await supabase
      .from("clinics")
      .select("id")
      .limit(1)
      .single();

    if (!clinic) {
      return NextResponse.json({ error: "No clinic found" }, { status: 404 });
    }

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

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
