import { createOrder } from "@/lib/orders";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);

    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  try {
    console.log("WEBHOOK EVENT:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log("CHECKOUT SESSION COMPLETED:", session.id);
      console.log("SESSION METADATA:", session.metadata);

      await createOrder({
        userId: session.metadata?.userId || "guest",
        productId: session.metadata?.productId || "unknown",
        productName: session.metadata?.productName || "Unknown Product",
        color: session.metadata?.color || "unknown",
        quantity: session.metadata?.quantity || "1",
        unitAmount: session.metadata?.unitAmount || "",
        amountTotal: session.amount_total || 0,
        currency: session.currency || "eur",
        paymentStatus: session.payment_status || "unknown",
        stripeSessionId: session.id,
        stripePaymentIntentId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id || "",
      });

      console.log("ORDER WRITTEN TO GOOGLE SHEETS");
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handling error:", error);

    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}