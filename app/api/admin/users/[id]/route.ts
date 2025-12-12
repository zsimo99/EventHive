import { verifyAccessToken } from "@/lib/auth";
import User from "@/models/User.model";
import { connectDB } from "@/utils/db.config";
import { sendError, sendSuccess } from "@/utils/response";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError("Invalid user ID", 400);
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

    const body = await req.json();
    const role = body?.role as "admin" | "user" | "organizer" | undefined;

    if (!role || !["admin", "user", "organizer"].includes(role)) {
      return sendError("Invalid role", 400);
    }

    const updated = await User.findByIdAndUpdate(
      id,
      { role },
      {
        new: true,
        runValidators: true,
        select: "userName email role createdAt avatar emailVerified",
      }
    );

    if (!updated) {
      return sendError("User not found", 404);
    }

    return sendSuccess(updated, "User role updated successfully");
  } catch (error) {
    console.error("Admin user PATCH error", error);
    return sendError("Internal Server Error", 500);
  }
}
