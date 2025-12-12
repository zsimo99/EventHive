import { verifyAccessToken } from "@/lib/auth";
import User from "@/models/User.model";
import { Booking } from "@/models/Booking.model";
import { connectDB } from "@/utils/db.config";
import { sendError, sendSuccess } from "@/utils/response";
import { NextRequest } from "next/server";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const token = req.cookies.get("accessToken")?.value;
    if (!token) {
      return sendError("unauthorized", 401);
    }
    const payload = verifyAccessToken(token);
    if (!payload) {
      return sendError("unvalide-token", 401);
    }
    const userId = (payload as { _id: string })._id;
    const user = await User.findById(userId);
    if (!user) {
      return sendError("user not found", 404);
    }

    // Base user fields to always return
    const baseUser = {
      _id: user._id,
      avatar: user.avatar ?? null,
      userName: user.userName,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    // Organizer / admin dashboard: earnings from events they own
    if (user.role === "organizer" || user.role === "admin") {
      const data = await User.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: "events",
            localField: "_id",
            foreignField: "organizer",
            as: "data",
            pipeline: [
              {
                $lookup: {
                  from: "bookings",
                  localField: "_id",
                  foreignField: "eventId",
                  as: "bookings",
                },
              },
              {
                $addFields: {
                  eventTotalGain: {
                    $sum: "$bookings.totalPrice",
                  },
                },
              },
              {
                $project: {
                  title: 1,
                  eventTotalGain: 1,
                },
              },
              {
                $group: {
                  _id: null,
                  totalGain: { $sum: "$eventTotalGain" },
                  events: {
                    $push: { title: "$title", totalGain: "$eventTotalGain" },
                  },
                },
              },
            ],
          },
        },
        {
          $unwind: {
            path: "$data",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            data: {
              $ifNull: [
                "$data",
                {
                  _id: null,
                  totalGain: 0,
                  events: [],
                },
              ],
            },
          },
        },
        {
          $project: {
            password: 0,
            refreshToken: 0,
          },
        },
      ]);

      const dashboard = (data && data[0]) || {
        ...baseUser,
        data: { _id: null, totalGain: 0, events: [] },
      };

      return sendSuccess(dashboard, "Dashboard data fetched successfully");
    }

    // Regular user dashboard: spending/booking summary
    const bookingsSummary = await Booking.aggregate([
      {
        $match: {
          userId: user._id,
          status: { $in: ["PENDING", "PAID"] },
        },
      },
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "event",
        },
      },
      { $unwind: "$event" },
      {
        $group: {
          _id: "$event._id",
          title: { $first: "$event.title" },
          totalGain: { $sum: "$totalPrice" },
        },
      },
      {
        $group: {
          _id: null,
          totalGain: { $sum: "$totalGain" },
          events: {
            $push: { title: "$title", totalGain: "$totalGain" },
          },
        },
      },
    ]);

    const bookingData = (bookingsSummary && bookingsSummary[0]) || {
      _id: null,
      totalGain: 0,
      events: [],
    };

    return sendSuccess(
      {
        ...baseUser,
        data: bookingData,
      },
      "Dashboard data fetched successfully"
    );
  } catch (error) {
    console.log("Error connecting to DB in dashboard route:", error);
    return sendError("internal server error", 500);
  }
}
