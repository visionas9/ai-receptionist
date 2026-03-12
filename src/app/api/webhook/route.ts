import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Only process end-of-call reports
    if (body.message?.type !== "end-of-call-report") {
      return NextResponse.json({ received: true });
    }

    const message = body.message;
    const analysis = message.analysis?.structuredData || {};
    const artifact = message.artifact || {};

    // Get the first clinic for demo purposes
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
      patient_name: analysis.patient_name || "Unknown",
      patient_phone: message.customer?.number || null,
      appointment_date: analysis.appointment_date || null,
      appointment_time: analysis.appointment_time || null,
      reason: analysis.reason || null,
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
