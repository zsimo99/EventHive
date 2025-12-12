// app/api/webhooks/stripe/route.ts
import { stripe } from "@/lib/stripe";
import { Booking } from "@/models/Booking.model";
import { connectDB } from "@/utils/db.config";

export const runtime = "nodejs";

export async function POST(req: Request) {
  // Must read raw body before any parsing
  const body = await req.text();
  try {
    await connectDB()
  } catch (error) {
    return new Response("Database connection error", { status: 500 });
  }

  // Read signature from the incoming request headers (use req.headers)
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature", { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  // Handle events
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as any;
      const bookingId = session?.metadata?.bookingId;
      const booking = await Booking.findById(bookingId);
     
      booking!.status = "PAID";
      await booking!.save();
      break;
    }
    case "checkout.session.expired": {
      const session = event.data.object as any;
      const bookingId = session?.metadata?.bookingId;
      const booking = await Booking.findById(bookingId);
     
      booking!.status = "CANCELLED";
      await booking!.save();
      console.log("Checkout session expired for booking:", bookingId);

      break;
    }

    // case "payment_intent.payment_failed": {
      
    //   break;
    // }

    default:
      console.log("Unhandled stripe event:", event.type);
  }

  return new Response("OK", { status: 200 });
}
