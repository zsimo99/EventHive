import { verifyAccessToken } from "@/lib/auth";
import { Booking } from "@/models/Booking.model";
import User from "@/models/User.model";
import { connectDB } from "@/utils/db.config";
import { sendError, sendSuccess } from "@/utils/response";
import mongoose from "mongoose";
import { NextRequest } from "next/server";


export async function GET(req: NextRequest,{ params }: { params: Promise<{ id: string }> }) {
    try {
        const {id}=await params;
        await connectDB();
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return sendError("Invalid booking ID", 400);
        }
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
        const booking = await Booking.findById(id).populate("eventId", "title");
        if (!booking) {
            return sendError("Booking not found", 404);
        }
        if(!booking.userId.equals(user._id)){
            return sendError("Forbidden", 403);
        }
        return sendSuccess(booking, "Booking fetched successfully");
    } catch (error) {
        console.error(error);
        return sendError("Internal Server Error", 500);
    }
}