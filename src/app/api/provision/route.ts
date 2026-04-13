import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { createVapiAssistant } from "@/lib/vapi";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminClient = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // Get clinic data
    const { data: clinic, error: clinicError } = await adminClient
      .from("clinics")
      .select("*")
      .eq("user_id", user.id)
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
      language: clinic.language,
    });

    console.log("Created assistant ID:", assistantId);

    // Save assistant ID to clinic
    await adminClient
      .from("clinics")
      .update({ vapi_assistant_id: assistantId })
      .eq("user_id", user.id);

    return NextResponse.json({ assistantId });
  } catch (err: any) {
    console.error("Provision error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
