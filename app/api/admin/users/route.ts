import { verifyAccessToken } from "@/lib/auth";
import User from "@/models/User.model";
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
            { userName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(
      query,
      "userName email role createdAt avatar emailVerified"
    )
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return sendSuccess(users, "Users fetched successfully");
  } catch (error) {
    console.error("Admin users GET error", error);
    return sendError("Internal Server Error", 500);
  }
}
