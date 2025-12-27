import { verifyAccessToken } from "@/lib/auth";
import User from "@/models/User.model";
import Event from "@/models/Event.model";
import { connectDB } from "@/utils/db.config";
import { sendError, sendSuccess } from "@/utils/response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

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

    const search = req.nextUrl.searchParams.get("search")?.trim() || "";
    const query = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { location: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const events = await Event.find(query)
      .populate("organizer", "userName email")
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return sendSuccess(events, "Events fetched successfully");
  } catch (error) {
    console.error("Admin events GET error", error);
    return sendError("Internal Server Error", 500);
  }
}
