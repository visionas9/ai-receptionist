import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const priceMap: Record<string, string> = {
  Starter: process.env.STRIPE_PRICE_STARTER!,
  Growth: process.env.STRIPE_PRICE_GROWTH!,
  Pro: process.env.STRIPE_PRICE_PRO!,
};

export async function POST(req: NextRequest) {
  try {
    const { userId, planName } = await req.json();

    if (!userId || !planName) {
      return NextResponse.json(
        { error: "userId and planName required" },
        { status: 400 },
      );
    }

    const priceId = priceMap[planName];
    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const { data: clinic } = await supabase
      .from("clinics")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!clinic) {
      return NextResponse.json({ error: "Clinic not found" }, { status: 404 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        clinicId: clinic.id,
        planName,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/paywall`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
