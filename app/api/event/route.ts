import { verifyAccessToken } from "@/lib/auth";
import Event from "@/models/Event.model";
import User from "@/models/User.model";
import { connectDB } from "@/utils/db.config";
import { sendError, sendSuccess } from "@/utils/response";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const {
      title,
      date,
      location,
      description = undefined,
      tags = undefined,
      category,
    } = await req.json();
    const token = req.cookies.get("accessToken")?.value;
    if (!token) {
      return sendError("Unauthorized, no token provided", 401);
    }
    const decode = verifyAccessToken(token);
    if (!decode) {
      return sendError("Unauthorized, invalid token", 401);
    }
    const user = await User.findById((decode as any)._id);
    if (!user) {
      return sendError("Unauthorized,user not found", 401);
    }
    const newEvent = await Event.create({
      title,
      date,
      location,
      organizer: user._id,
      description,
      tags,
      category,
    });
    if (!newEvent) {
      return sendError("Failed to create event", 400);
    }
    return sendSuccess({ event: newEvent }, "Event created successfully", 201);
  } catch (error: any) {
    //check if error is instance of mongoose error
    if (error.name == "ValidationError") {
      const errors = Object.keys((error as any).errors).map((key) => ({
        [key]: (error as any).errors[key].message,
      }));
      return sendError("Please check all fields", 400, errors);
    }
    return sendError("Internal Server Error", 500);
  }
}

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const page = parseInt(params.get("page") || "1");
    const limit = parseInt(params.get("limit") || "10");
    const skip = (page - 1) * limit;
    const category = params.get("category");
    await connectDB();
    const events = await Event.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "organizer",
          foreignField: "_id",
          as: "owner",
        },
      },
      { $unwind: "$owner" },
      {
        $facet: {
          data: [
            { $sort: { createdAt: -1 } },
            { $skip: skip }, // pagination: skip
            { $limit: limit }, // pagination: limit
          ],
          totalCount: [{ $count: "count" }],
        },
      },
      {
        $addFields: {
          totalCount: {
            $arrayElemAt: ["$totalCount.count", 0],
          },
        },
      },
    ]);
    return sendSuccess({ events:events[0] }, "Events fetched successfully");
  } catch (error) {
    return sendError("Internal Server Error", 500);
  }
}
