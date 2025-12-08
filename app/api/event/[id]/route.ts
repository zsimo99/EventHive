import { verifyAccessToken } from "@/lib/auth";
import Event from "@/models/Event.model";
import User from "@/models/User.model";
import { connectDB } from "@/utils/db.config";
import { sendError, sendSuccess } from "@/utils/response";

import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
     const { id: eventId } = await params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return sendError("Invalid event ID", 400);
    }


    const event = await Event.findById(eventId).populate(
      "organizer",
      "name email"
    );

    if (!event) {
      return sendError("Event not found", 404);
    }

    return sendSuccess({ event }, "Event fetched successfully");
  } catch (error) {
    console.error(error);
    return sendError("Internal Server Error", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) { 
  try {
    await connectDB();
    const { id: eventId } = await params;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return sendError("Invalid event ID", 400);
    }
    const token=request.cookies.get("accessToken")?.value;
    if(!token){
        return sendError("Not authenticated",401);
    }
    const decoded=verifyAccessToken(token) as { _id: string } | null;
    if(!decoded?._id){
        return sendError("token-expired",401);
    }
    const user=await User.findById(decoded?._id);
    if(!user){
        return sendError("User not found", 404);
    }
    const event = await Event.findByIdAndDelete(eventId);
    if (!event) {
      return sendError("Event not found", 404);
    }
    return sendSuccess({  }, "Event deleted successfully", 200);
  } catch (error) {
    console.error(error);
    return sendError("Internal Server Error", 500);
  }
}