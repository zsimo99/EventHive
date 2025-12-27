import { verifyAccessToken } from "@/lib/auth";
import User from "@/models/User.model";
import { Booking } from "@/models/Booking.model";
import Event from "@/models/Event.model";
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

    // Check if user is blocked
    if (user.isBlocked) {
      return sendError("Your account has been blocked", 403);
    }

    // Base user fields to always return
    const baseUser = {
      _id: user._id,
      avatar: user.avatar ?? null,
      userName: user.userName,
      email: user.email,
      role: user.role,
      isBlocked: user.isBlocked || false,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    // For organizer role, get both user spending data AND organizer earnings data
    if (user.role === "organizer") {
      // Get organizer earnings data
      const organizerData = await User.aggregate([
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
            as: "events",
            pipeline: [
              {
                $lookup: {
                  from: "bookings",
                  localField: "_id",
                  foreignField: "eventId",
                  as: "bookings",
                  pipeline: [
                    { $match: { status: { $in: ["PENDING", "PAID"] } } }
                  ]
                },
              },
              {
                $addFields: {
                  eventTotalGain: { $sum: "$bookings.totalPrice" },
                  totalBookings: { $size: "$bookings" },
                  totalSeatsBooked: { $sum: "$bookings.seats" },
                },
              },
              {
                $project: {
                  _id: 1,
                  title: 1,
                  date: 1,
                  location: 1,
                  price: 1,
                  capacity: 1,
                  image: 1,
                  category: 1,
                  eventTotalGain: 1,
                  totalBookings: 1,
                  totalSeatsBooked: 1,
                },
              },
            ],
          },
        },
        {
          $addFields: {
            totalRevenue: { $sum: "$events.eventTotalGain" },
            totalEvents: { $size: "$events" },
            totalBookingsReceived: { $sum: "$events.totalBookings" },
          },
        },
        {
          $project: {
            password: 0,
            refreshToken: 0,
          },
        },
      ]);

      // Get user spending data (as a user who also books events)
      const userBookingsData = await Booking.aggregate([
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
            totalSpent: { $sum: "$totalPrice" },
          },
        },
        {
          $group: {
            _id: null,
            totalSpent: { $sum: "$totalSpent" },
            eventsBooked: {
              $push: { title: "$title", totalSpent: "$totalSpent" },
            },
            totalBookings: { $sum: 1 },
          },
        },
      ]);

      const organizerStats = organizerData[0] || {
        totalRevenue: 0,
        totalEvents: 0,
        totalBookingsReceived: 0,
        events: [],
      };

      const userStats = userBookingsData[0] || {
        totalSpent: 0,
        eventsBooked: [],
        totalBookings: 0,
      };

      return sendSuccess(
        {
          ...baseUser,
          organizerData: {
            totalRevenue: organizerStats.totalRevenue,
            totalEvents: organizerStats.totalEvents,
            totalBookingsReceived: organizerStats.totalBookingsReceived,
            events: organizerStats.events,
          },
          userData: {
            totalSpent: userStats.totalSpent,
            totalBookings: userStats.totalBookings,
            eventsBooked: userStats.eventsBooked,
          },
        },
        "Dashboard data fetched successfully"
      );
    }

    // Admin dashboard data
    if (user.role === "admin") {
      const [userCount, eventCount, bookingStats] = await Promise.all([
        User.countDocuments(),
        Event.countDocuments(),
        Booking.aggregate([
          { $match: { status: "PAID" } },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$totalPrice" },
              totalBookings: { $sum: 1 },
            },
          },
        ]),
      ]);

      return sendSuccess(
        {
          ...baseUser,
          adminData: {
            totalUsers: userCount,
            totalEvents: eventCount,
            totalRevenue: bookingStats[0]?.totalRevenue || 0,
            totalBookings: bookingStats[0]?.totalBookings || 0,
          },
        },
        "Dashboard data fetched successfully"
      );
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
          totalSpent: { $sum: "$totalPrice" },
        },
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: "$totalSpent" },
          eventsBooked: {
            $push: { title: "$title", totalSpent: "$totalSpent" },
          },
          totalBookings: { $sum: 1 },
        },
      },
    ]);

    const bookingData = bookingsSummary[0] || {
      totalSpent: 0,
      eventsBooked: [],
      totalBookings: 0,
    };

    return sendSuccess(
      {
        ...baseUser,
        userData: {
          totalSpent: bookingData.totalSpent,
          totalBookings: bookingData.totalBookings,
          eventsBooked: bookingData.eventsBooked,
        },
      },
      "Dashboard data fetched successfully"
    );
  } catch (error) {
    console.log("Error connecting to DB in dashboard route:", error);
    return sendError("internal server error", 500);
  }
}
