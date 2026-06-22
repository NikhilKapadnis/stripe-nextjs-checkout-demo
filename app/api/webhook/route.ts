import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      productId,
      productName,
      productDescription,
      color,
      unitAmount,
      quantity,
    } = body;

    if (!productId || !productName || !unitAmount || !quantity) {
      return NextResponse.json(
        { error: "Missing product checkout data" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],

      line_items: [
        {
          quantity,
          price_data: {
            currency: "eur",
            unit_amount: unitAmount,
            product_data: {
              name: productName,
              description: productDescription || `${color} demo shirt`,
            },
          },
        },
      ],

      metadata: {
        userId: "test_user",
        productId,
        productName,
        color: color || "unknown",
        quantity: String(quantity),
        unitAmount: String(unitAmount),
      },

      payment_intent_data: {
        metadata: {
          userId: "test_user",
          productId,
          productName,
          color: color || "unknown",
          quantity: String(quantity),
          unitAmount: String(unitAmount),
        },
      },

      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);

    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}