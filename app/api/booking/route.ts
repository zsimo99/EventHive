import { verifyAccessToken } from "@/lib/auth";
import { Booking, IBooking } from "@/models/Booking.model";
import Event from "@/models/Event.model";
import User from "@/models/User.model";
import { connectDB } from "@/utils/db.config";
import { sendError, sendSuccess } from "@/utils/response";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const token = req.cookies.get("accessToken")?.value;
    if (!token) {
      return sendError("Unauthorized", 401);
    }
    const payload = verifyAccessToken(token);
    if (!payload) {
      return sendError("unvalide-token", 401);
    }
    const userId = (payload as { _id: string })._id;
    const user = await User.findById(userId);
    if (!user) {
      return sendError("User not found", 404);
    }
    const bookings = await Booking.find({ userId: user._id }).populate(
      "eventId",
      "title"
    );
    return sendSuccess(bookings, "Bookings fetched successfully");
  } catch (error) {
    console.error(error);
    return sendError("Internal Server Error", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("accessToken")?.value;
    if (!token) {
      return sendError("Unauthorized", 401);
    }
    const payload = verifyAccessToken(token);
    if (!payload) {
      return sendError("unvalide-token", 401);
    }
    const userId = (payload as { _id: string })._id;
    const user = await User.findById(userId);
    if (!user) {
      return sendError("User not found", 404);
    }
    const { eventId, seats } = await req.json();
    if (
      !mongoose.Types.ObjectId.isValid(eventId) ||
      !Number.isInteger(seats) ||
      seats < 1 ||
      seats > 10
    ) {
      return sendError("Invalid event ID or seats", 400);
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return sendError("Event not found", 404);
    }
    const howManyBookings = await Booking.aggregate([
      {
        $match: {
          eventId: event._id,
          status: {
            $in: ["PENDING", "PAID"],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalseats: {
            $sum: "$seats",
          },
        },
      },
    ]);
    if (event.capacity - (howManyBookings[0]?.totalseats || 0) < seats) {
      return sendError("Not enough seats available", 400);
    }
    const newBooking: IBooking = await Booking.create({
      userId: user._id,
      eventId: event._id,
      seats,
      status: "PENDING",
      totalPrice: event.price * seats,
    });

    return sendSuccess(newBooking, "Booking created successfully");
  } catch (error) {
    sendError("Internal Server Error", 500);
  }
}
