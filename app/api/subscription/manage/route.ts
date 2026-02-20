import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, stripeSubscriptionId, customerId, annual } = body;

    // 🔹 1) GET REAL INTERVAL FROM STRIPE
    if (action === "interval") {
      if (!stripeSubscriptionId) {
        return NextResponse.json(
          { error: "Missing subscription id" },
          { status: 400 },
        );
      }

      const stripeSub =
        await stripe.subscriptions.retrieve(stripeSubscriptionId);
      const interval =
        stripeSub.items.data[0].price.recurring?.interval || "unknown";

      return NextResponse.json({ interval });
    }

    // 🔹 2) CANCEL SUBSCRIPTION
    if (action === "cancel") {
      if (!stripeSubscriptionId) {
        return NextResponse.json(
          { error: "Missing subscription id" },
          { status: 400 },
        );
      }

      await stripe.subscriptions.update(stripeSubscriptionId, {
        cancel_at_period_end: true,
      });

      return NextResponse.json({ success: true });
    }

    // 🔹 3) SWITCH PLAN MONTHLY ⇄ YEARLY (via Stripe Checkout)
    if (action === "switch") {
      if (!customerId) {
        return NextResponse.json(
          { error: "Missing customer id" },
          { status: 400 },
        );
      }

      const priceId = annual
        ? process.env.NEXT_PUBLIC_STRIPE_BASIC_YEARLY_PRICE_ID
        : process.env.NEXT_PUBLIC_STRIPE_BASIC_MONTHLY_PRICE_ID;

      const checkout = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: customerId,
        line_items: [{ price: priceId!, quantity: 1 }],
        success_url: `${process.env.BETTER_AUTH_URL}/account/subscription`,
        cancel_url: `${process.env.BETTER_AUTH_URL}/account/subscription`,
      });

      return NextResponse.json({ url: checkout.url });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("MANAGE SUB ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
