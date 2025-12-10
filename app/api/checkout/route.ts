import { stripe } from "@/lib/stripe";
import { Booking } from "@/models/Booking.model";
import { connectDB } from "@/utils/db.config";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { bookingId } = await req.json();

    if (!bookingId) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: `Booking #${bookingId}` },
            unit_amount: booking.totalPrice * 100, // Stripe takes cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?booking=${bookingId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel?booking=${bookingId}`,
      // metadata for SESSION
      metadata: { bookingId },


      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.log("Checkout error:", error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
