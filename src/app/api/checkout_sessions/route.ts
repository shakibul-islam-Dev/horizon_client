import { NextResponse, type NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";

interface CartItemPayload {
  title: string;
  price: number;
  quantity: number;
}

export async function POST(request: NextRequest) {
  try {
    const { items }: { items: CartItemPayload[] } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "No items provided", data: null, error: "Cart is empty" },
        { status: 400 },
      );
    }

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/cart`,
    });

    if (!session.url) {
      return NextResponse.json(
        { success: false, message: "Failed to create checkout session", data: null, error: "No checkout URL" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Checkout session created",
      data: { url: session.url },
      error: null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      { success: false, message: "Checkout failed", data: null, error: message },
      { status: 500 },
    );
  }
}
