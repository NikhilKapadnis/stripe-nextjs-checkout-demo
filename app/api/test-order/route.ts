import { NextResponse } from "next/server";
import { createOrder } from "@/lib/orders";

export async function GET() {
  try {
    const order = await createOrder({
      userId: "test_user",
      productId: "test_product",
      productName: "Test Product",
      color: "Blue",
      quantity: 2,
      unitAmount: 1999,
      amountTotal: 3998,
      currency: "usd",
      paymentStatus: "paid",
      stripeSessionId: `test_session_${Date.now()}`,
      stripePaymentIntentId: `test_pi_${Date.now()}`,
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("TEST_ORDER_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}