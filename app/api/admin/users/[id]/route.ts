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
    const { role, isBlocked } = body;

    // Validate role if provided
    if (role !== undefined && !["admin", "user", "organizer"].includes(role)) {
      return sendError("Invalid role", 400);
    }

    // Build update object
    const updateData: { role?: string; isBlocked?: boolean } = {};
    if (role !== undefined) {
      updateData.role = role;
    }
    if (isBlocked !== undefined) {
      updateData.isBlocked = isBlocked;
    }

    if (Object.keys(updateData).length === 0) {
      return sendError("No valid update data provided", 400);
    }

    // Prevent admin from blocking themselves
    if (id === payload._id && isBlocked === true) {
      return sendError("You cannot block yourself", 400);
    }

    // Prevent admin from changing their own role
    if (id === payload._id && role !== undefined) {
      return sendError("You cannot change your own role", 400);
    }

    const updated = await User.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
        select: "userName email role createdAt avatar emailVerified isBlocked",
      }
    );

    if (!updated) {
      return sendError("User not found", 404);
    }

    return sendSuccess(updated, "User updated successfully");
  } catch (error) {
    console.error("Admin user PATCH error", error);
    return sendError("Internal Server Error", 500);
  }
}
