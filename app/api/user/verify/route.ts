import { NextRequest } from "next/server";
import { connectDB } from "@/utils/db.config";
import { sendError, sendSuccess } from "@/utils/response";
import User from "@/models/User.model";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    console.log("Received token:", token);
    if (!token) {
      return sendError("Verification token is missing", 400);
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const user=await User.findById((decoded as { userId: string }).userId);
    if(!user){
      return sendError("User not found", 404);
    }
    if (user.emailVerified) {
      return sendSuccess({}, "Email already verified", 200);
    }
    if (user.emailVerificationToken !== token) {
      return sendError("Invalid verification token", 400);
    }
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();
    return sendSuccess({}, "Email verified successfully", 200);
  } catch (error) {
    console.error("Error in user route:", error);
    return sendError("Internal Server Error", 500);
  }
}
