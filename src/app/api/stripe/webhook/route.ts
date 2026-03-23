import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    console.error("Stripe webhook error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.CheckoutSession;
    const { userId, planName } = session.metadata!;

    await supabase
      .from("clinics")
      .update({
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: session.subscription as string,
        plan: planName,
        free_minutes_remaining: 99999,
      })
      .eq("user_id", userId);
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;

    await supabase
      .from("clinics")
      .update({
        plan: null,
        stripe_subscription_id: null,
        free_minutes_remaining: 0,
      })
      .eq("stripe_customer_id", customerId);
  }

  return NextResponse.json({ received: true });
}
