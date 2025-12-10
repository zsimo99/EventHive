import { verifyRefreshToken } from "@/lib/auth";
import User from "@/models/User.model";
import { sendError, sendSuccess } from "@/utils/response";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try {
        const refreshToken = req.cookies.get("refreshToken")?.value;
        if (!refreshToken) {
            return sendError("No refresh token provided", 401);
        }
        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) {
            throw new Error("Invalid refresh token");
        }
        const user = await User.findById((decoded as any)._id).select("+refreshToken");
        if (!user || user.refreshToken !== refreshToken) {
            throw new Error("Invalid refresh token");
        }
        const { accessToken , refreshToken: newRefreshToken } = user.generateTokens();
        user.refreshToken = newRefreshToken;
        await user.save();
        return sendSuccess({}, "Tokens refreshed successfully", 200, [
            {
                name: "refreshToken", value: newRefreshToken, options: {httpOnly: true, path: "/api/user/refresh-token", maxAge: 7 * 24 * 60 * 60,}
            },
            {
                name: "accessToken", value: accessToken, options: {httpOnly: true, path: "/", maxAge: 15 * 60,}
            },
        ]);
    } catch (error) {
        const res=NextResponse.json({message:"Internal server error"}, {status:500});
        res.cookies.delete("refreshToken");
        res.cookies.delete("accessToken");
        return res
    }
}