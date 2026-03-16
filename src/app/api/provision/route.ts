import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { createVapiAssistant } from "@/lib/vapi";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    // Get clinic data
    const { data: clinic, error: clinicError } = await supabase
      .from("clinics")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (clinicError || !clinic) {
      return NextResponse.json({ error: "Clinic not found" }, { status: 404 });
    }

    // Skip if already provisioned
    if (clinic.vapi_assistant_id) {
      return NextResponse.json({ assistantId: clinic.vapi_assistant_id });
    }

    // Create Vapi assistant
    const assistantId = await createVapiAssistant({
      name: clinic.name,
      industry: clinic.industry,
      tone: clinic.tone,
      busiest_time: clinic.busiest_time,
      main_goal: clinic.main_goal,
    });

    console.log("Created assistant ID:", assistantId);

    // Save assistant ID to clinic
    await supabase
      .from("clinics")
      .update({ vapi_assistant_id: assistantId })
      .eq("user_id", userId);

    return NextResponse.json({ assistantId });
  } catch (err: any) {
    console.error("Provision error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
