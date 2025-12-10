import { verifyAccessToken } from "@/lib/auth";
import User from "@/models/User.model";
import { sendError, sendSuccess } from "@/utils/response";
import { NextRequest } from "next/server";


export async function POST(req: NextRequest) {
    try {
        const token=req.cookies.get("accessToken")?.value;
        if(!token){
            return sendError("No token provided",401);
        }
        const decoded = verifyAccessToken(token);
        if(!decoded){
            return sendError("Invalid token",401);
        }
        const user=await User.findById((decoded as any)._id);
        if(!user){
            return sendError("User not found",404);
        }
        user.refreshToken=undefined;
        await user.save();
        return sendSuccess({}, "Logout successful", 200, [
            {
                name: "refreshToken", value: "", options: { httpOnly: true, maxAge: 0 }
            },{
                name: "accessToken", value: "", options: { httpOnly: true, maxAge: 0 }
            }
        ]);
    } catch (error) {
        return sendError("Internal server error", 500);
    }
}