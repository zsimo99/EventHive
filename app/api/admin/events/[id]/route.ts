import { verifyAccessToken } from "@/lib/auth";
import User from "@/models/User.model";
import Event from "@/models/Event.model";
import { Booking } from "@/models/Booking.model";
import { connectDB } from "@/utils/db.config";
import { sendError, sendSuccess } from "@/utils/response";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError("Invalid event ID", 400);
    }

    const token = req.cookies.get("accessToken")?.value;
    if (!token) {
      return sendError("Unauthorized", 401);
    }

    const payload = verifyAccessToken(token) as { _id: string } | null;
    if (!payload?._id) {
      return sendError("token-expired", 401);
    }

    const currentUser = await User.findById(payload._id);
    if (!currentUser || currentUser.role !== "admin") {
      return sendError("Forbidden", 403);
    }

    const event = await Event.findById(id);
    if (!event) {
      return sendError("Event not found", 404);
    }

    // Delete all bookings associated with this event
    await Booking.deleteMany({ eventId: id });

    // Delete the event
    await Event.findByIdAndDelete(id);

    return sendSuccess({}, "Event deleted successfully");
  } catch (error) {
    console.error("Admin event DELETE error", error);
    return sendError("Internal Server Error", 500);
  }
}
