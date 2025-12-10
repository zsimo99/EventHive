import { verifyAccessToken } from "@/lib/auth";
import User from "@/models/User.model";
import { connectDB } from "@/utils/db.config";
import { sendError, sendSuccess } from "@/utils/response";
import { NextRequest } from "next/server";

export async function GET(req:NextRequest) {
   try {
    await connectDB();
     const token=req.cookies.get("accessToken")?.value;
    if(!token){
        return sendError("Not authenticated",401);
    }
    const decoded = verifyAccessToken(token) as { _id: string } | null;
    if(!decoded?._id){
        return sendError("token-expired",401);
    }
    const user= await User.findById(decoded._id)


    if(!user){
        return sendError("User not found",404);
    }
    const data = {
      _id: user._id,
      userName: user.userName,
      email: user.email,
      role: user.role,
    };
    return sendSuccess(data,"User fetched successfully",200);
   } catch (error) {
    return sendError("Internal server error",500);
   }
}