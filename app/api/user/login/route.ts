import User, { IUser } from "@/models/User.model";
import { connectDB } from "@/utils/db.config";
import { sendError, sendSuccess } from "@/utils/response";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const userExist: IUser = await User.findOne({ email: body.email }).select("+password");
    if (!userExist) return sendError("email not found please make sure you have registered", 401);
    const isMatch = await userExist.comparePassword(body.password);
    if (!isMatch) return sendError("Invalid password", 401);
    if (!userExist.emailVerified)
      return sendError("Please verify your email before logging in", 401);
    const { accessToken, refreshToken } = userExist.generateTokens();
    userExist.refreshToken = refreshToken;
    await userExist.save();
    const data = {
      _id: userExist._id,
      userName: userExist.userName,
      email: userExist.email,
      role: userExist.role,
    };
    return sendSuccess(data, "Login successful", 200, [
      {
        name: "refreshToken",
        value: refreshToken,
        options: { httpOnly: true, path: "/api/user/refresh-token", sameSite: "none", secure: true },
      },
      {
        name: "accessToken",
        value: accessToken,
        options: { httpOnly: true, path: "/",sameSite: "none", secure: true },
      },
    ]);
  } catch (error: any) {
    console.error("Error in login route:", error);
    return sendError("somthing went wrong," + error.message);
  }
}
